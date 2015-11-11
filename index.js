'use strict';

const util = require('util');

const cheerio = require('cheerio');
const events = require('events');
const request = require('request');
const URI = require('uri-js');

let debug = function() {};

if (~String(process.env.NODE_DEBUG).indexOf('metainspector')) {
	debug = () => {
		console.error('METAINSPECTOR %s', util.format.apply(util, arguments));
	};
}

let withDefaultScheme = (url) => {
	return URI.parse(url).scheme ? url : 'http://' + url;
};

class MetaInspector extends events.EventEmitter {
	constructor (url, options) {
		super();

		this.url = URI.normalize(withDefaultScheme(url));
		this.options = options || {};

		this.parsedUrl = URI.parse(this.url);
		this.scheme = this.parsedUrl.scheme;
		this.host = this.parsedUrl.host;
		this.rootUrl = this.scheme + '://' + this.host;

		//default to a sane limit, since for meta-inspector usually 5 redirects should do a job
		//more over beyond this there could be an issue with event emitter loop detection with new nodejs version
		//which prevents error event from getting fired
		this.maxRedirects = this.options.maxRedirects || 5;

		//some urls are timing out after one minute, hence need to specify a reasoable default timeout
		this.timeout = this.options.timeout || 20000; //Timeout in ms

		this.strictSSL = !!this.options.strictSSL;
	}

	getTitle () {
		debug('Parsing page title');

		if (!this.title) {
			this.title = this.parsedDocument('head > title').text();
		}

		return this;
	}

	getOgTitle () {
		debug('Parsing page Open Graph title');

		if (!this.ogTitle) {
			this.ogTitle = this.parsedDocument(`meta[property='og:title']`).attr('content');
		}

		return this;
	}

	getOgDescription () {
		debug('Parsing page Open Graph description');

		if (this.ogDescription === undefined) {
			this.ogDescription = this.parsedDocument(`meta[property='og:description']`).attr('content');
		}

		return this;
	}

	getLinks () {
		debug('Parsing page links');

		if (!this.links) {
			this.links = Array.prototype.slice.call(this.parsedDocument('a').map((i, element) => {
				return this.parsedDocument(element).attr('href');
			}));
		}

		return this;
	}

	getMetaDescription () {
		debug('Parsing page description based on meta elements');

		if (!this.description) {
			this.description = this.parsedDocument(`meta[name='description']`).attr('content');
		}

		return this;
	}

	getSecondaryDescription () {
		debug('Parsing page secondary description');

		if (!this.description) {
			const minimumPLength = 120;

			this.parsedDocument('p').each((i, element) => {
				if (this.description) {
					return;
				}

				let text = this.parsedDocument(element).text();

				// If we found a paragraph with more than
				if (text.length >= minimumPLength) {
					this.description = text;
				}
			});
		}

		return this;
	}

	getDescription () {
		debug('Parsing page description based on meta description or secondary description');

		if (this.getMetaDescription()) {
			this.getSecondaryDescription();
		}

		return this;
	}

	getKeywords () {
		debug('Parsing page keywords from apropriate metatag');

		if (!this.keywords) {
			let keywordsString = this.parsedDocument(`meta[name='keywords']`).attr('content');

			let keywords = [];

			if (keywordsString) {
				keywords = keywordsString.split(',');
			}

			this.keywords = keywords;
		}

		return this;
	}

	getAuthor () {
		debug('Parsing page author from apropriate metatag');

		if (!this.author) {
			this.author = this.parsedDocument(`meta[name='author']`).attr('content');
		}

		return this;
	}

	getCharset () {
		debug('Parsing page charset from apropriate metatag');

		if (!this.charset) {
			this.charset = this.parsedDocument('meta[charset]').attr('charset');
		}

		return this;
	}

	getImage () {
		debug('Parsing page image based on the Open Graph image');

		if (!this.image) {
			let img = this.parsedDocument(`meta[property='og:image']`).attr('content');

			if (img) {
				this.image = this.getAbsolutePath(img);
			}
		}

		return this;
	}

	getImages () {
		debug('Parsing page body images');

		if (this.images === undefined) {
			this.images = Array.prototype.slice.call(this.parsedDocument('img').map((i, element) => {
				let src = this.parsedDocument(element).attr('src');

				return this.getAbsolutePath(src);
			}));
		}

		return this;
	}

	getFeeds () {
		debug('Parsing page feeds based on rss or atom feeds');

		if (!this.feeds) {
			this.feeds = this.parseFeeds('rss') || this.parseFeeds('atom');
		}

		return this;
	}

	parseFeeds (format) {
		let feedList = this.parsedDocument(`link[type='application/${format}+xml']`);

		return feedList.map((i, element) => this.parsedDocument(element).attr('href'));
	}

	initAllProperties () {
		// title of the page, as string
		this.getTitle()
			.getAuthor()
			.getCharset()
			.getKeywords()
			.getLinks()
			.getDescription()
			.getImage()
			.getImages()
			.getFeeds()
			.getOgTitle()
			.getOgDescription();
	}

	getAbsolutePath (href) {
		if ((/^(http:|https:)?\/\//i).test(href)) {
			return href;
		}

		if (!(/^\//).test(href)) {
			href = '/' + href;
		}

		return this.rootUrl + href;
	}

	fetch () {
		var totalChunks = 0;

		var req = request({
			uri: this.url,
			gzip: true,
			maxRedirects: this.maxRedirects,
			timeout: this.timeout,
			strictSSL: this.strictSSL
		}, (error, response, body) => {
			if (!error && response.statusCode === 200) {
				this.document = body;
				this.parsedDocument = cheerio.load(body);
				this.response = response;

				this.initAllProperties();

				this.emit('fetch');
			} else {
				this.emit('error', error);
			}
		});

		if (this.options.limit) {
			this.__stoppedAtLimit = false;

			req.on('data', (chunk) => {
				totalChunks += chunk.length;
				if (totalChunks > this.options.limit) {
					if (!this.__stoppedAtLimit) {
						this.emit('limit');
						this.__stoppedAtLimit = true;
					}

					req.abort();
				}
			});
		}
	}
}

module.exports = MetaInspector;