var util = require('util'),
	request = require('request'),
	events = require('events'),
	cheerio = require('cheerio'),
	URI = require('uri-js');

var MetaInspector = function(url, opts){
	this.url = URI.normalize(withDefaultScheme(url));
	
	this.opts = opts || {};
	
	this.parsedUrl = URI.parse(this.url);
	this.scheme = this.parsedUrl.scheme;
	this.host = this.parsedUrl.host;
	this.rootUrl = this.scheme + "://" + this.host;
};

MetaInspector.prototype = new events.EventEmitter;

module.exports = MetaInspector;

MetaInspector.prototype.fetch = function(){
	var self = this;

	request(this.url, function(error, response, body){
		if(!error && response.statusCode == 200){
			self.document = body
			self.parsedDocument = cheerio.load(body);
			self.response = response;

			initAllProperties.apply(self);

			self.emit("fetch");
		}
		else{
			self.emit("error", error);
		}
	});
};

MetaInspector.prototype.title = function(){
	return this.parsed_document('title').text();
};

function initAllProperties()
{
	this.title = getTitle.apply(this);
	this.links = getLinks.apply(this);
	this.description = getDescription.apply(this) || getSecondaryDescription.apply(this);
}

function getTitle()
{
	return this.parsedDocument('title').text();
}

function getLinks()
{
	var self = this;

	return self.parsedDocument('a').map(function(i ,elem){
		return self.parsedDocument(this).attr('href');
	});
}

function getDescription()
{
	return this.parsedDocument("meta[name='description']").attr("content");
}

function getSecondaryDescription()
{
	var self = this;
	var first_long_text = null;
	var minimum_p_length = 120;

	self.parsedDocument("p").each(function(i, elem){
		if(first_long_text !== null) return;
		
		var text = this.parsedDocument(this).text();
		// If we found a paragraph with more than
		if(text.length >= minimum_p_length)
		{
			first_long_text = text;
		}
	});
}

function withDefaultScheme(url){
	return URI.parse(url).scheme ? url : "http://" + url;
};