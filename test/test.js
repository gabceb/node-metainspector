'use strict';

require('mocha');

const MetaInspector = require('../index');
const should = require('should');

require('./fixtures/fixtures')();

describe('metainspector', () => {
	describe('multiple clients', () => {
		const firstClient = new MetaInspector('http://www.google.com');
		const secondClient = new MetaInspector('http://www.google.com');

		it('should not keep the same eventEmitter reference among clients', (done) => {
			let calledOnce = false;

			firstClient.on('fetch', () => {
				if (calledOnce) {
					throw new Error('I should not get called twice');
				} else {
					calledOnce = true;
				}
			});

			secondClient.on('fetch', () => {
				should.exists(secondClient.parsedDocument);

				if (calledOnce) {
					done();
				}
			});

			firstClient.fetch();
			secondClient.fetch();
		});
	});

	describe('client', () => {
		let client = null;

		it('should have a url property', () => {
			client = new MetaInspector('http://www.google.com');

			client.url.should.equal('http://www.google.com/');
		});

		it('should add http as the default scheme if no scheme is passed', () => {
			client = new MetaInspector('www.google.com');

			client.url.should.equal('http://www.google.com/');
		});

		it('should have a scheme property', () => {
			client = new MetaInspector('http://www.google.com');

			client.scheme.should.equal('http');
		});

		it('should have a host property', () => {
			client = new MetaInspector('http://www.google.com');

			client.host.should.equal('www.google.com');
		});

		it('should have a rootUrl property', () => {
			client = new MetaInspector('http://www.google.com');

			client.rootUrl.should.equal('http://www.google.com');
		});

		it('should have a parsedDocument', () => {
			client = new MetaInspector('http://www.google.com');

			client.once('fetch', () => {
				should.exists(client.parsedDocument);
				done();
			});

			client.fetch();
		});

		it('should have a title', () => {
			client = new MetaInspector('http://www.google.com', {});

			client.once('fetch', () => {
				client.title.should.equal('Google');
				done();
			});

			client.fetch();
		});

		it('should have keywords', (done) => {
			client = new MetaInspector('http://www.simple.com', {});

			client.once('fetch', () => {
				client.keywords.should.be.instanceof(Array).and.be.eql(['HTML', 'CSS', 'XML', 'JavaScript']).and.have.lengthOf(4);
				done();
			});

			client.fetch();
		});

		it('keywords should be undefined if there is no keywords', (done) => {
			client = new MetaInspector('http://www.google.com', {});

			client.once('fetch', () => {
				client.keywords.should.be.instanceof(Array).and.be.eql([]);

				done();
			});

			client.fetch();
		});

		it('author should be undefined if there is no author', (done) => {
			client = new MetaInspector('http://www.google.com', {});

			client.once('fetch', () => {
				should.not.exist(client.author);

				done();
			});

			client.fetch();
		});

		it('charset should be undefined if there is no charset', (done) => {
			client = new MetaInspector('http://www.google.com', {});

			client.once('fetch', () => {
				should.not.exist(client.charset);

				done();
			});

			client.fetch();
		});

		it('should have author', (done) => {
			client = new MetaInspector('http://www.simple.com', {});

			client.once('fetch', () => {
				client.author.should.be.equal('Author Name');

				done();
			});

			client.fetch();
		});

		it('should have charset', (done) => {
			client = new MetaInspector('http://www.simple.com', {});

			client.once('fetch', () => {
				client.charset.should.be.equal('UTF-8');

				done();
			});

			client.fetch();
		});

		it('should have links returned as an array', (done) => {
			client = new MetaInspector('http://www.google.com', {});

			client.once('fetch', () => {
				client.links.length.should.equal(39);
				done();
			});

			client.fetch();
		});

		it('should have a description', (done) => {
			client = new MetaInspector('http://www.google.com', {});

			client.once('fetch', () => {
				client.description.should.equal('I am a very simple page, nothing complex. But even IE5 can read me.');

				done();
			});

			client.fetch();
		});

		it('should have a og:image with relative path and return as absolute', (done) => {
			client = new MetaInspector('http://www.fastandfurious7-film.com');

			client.once('fetch', () => {
				client.image.should.equal('http://www.fastandfurious7-film.com/images/fb.jpg');

				done();
			});

			client.fetch();
		});

		it('should have a og:description', (done) => {
			client = new MetaInspector('http://www.fastandfurious7-film.com');

			client.once('fetch', () => {
				client.ogDescription.should.equal('Continuing the global exploits in the unstoppable franchise built on speed, Vin Diesel, Paul Walker and Dwayne Johnson lead the returning cast of Fast & Furious 7.');

				done();
			});

			client.fetch();
		});

		it('should return undefined if the meta description is not defined when metaDescription used', (done) => {
			client = new MetaInspector('http://www.simple.com', {});

			client.once('fetch', () => {
				should.not.exist(client.metaDescription);

				done();
			});

			client.fetch();
		});

		it('should find a secondary description if there is no description meta element', (done) => {
			client = new MetaInspector('http://www.simple.com', {});

			client.once('fetch', () => {
				client.description.should.equal('This is a new paragraph! This paragraph should be very long so we can grab it as the secondary description. What do you think of that?');

				done();
			});

			client.fetch();
		});

		it('should find a the image based on the og:image tag if defined', (done) => {
			client = new MetaInspector('http://www.simple.com', {});

			client.once('fetch', () => {
				client.image.should.equal('http://placehold.it/350x150');

				done();
			});

			client.fetch();
		});

		it('should return an array of absolute image paths for all images on the page', (done) => {
			client = new MetaInspector('http://www.simple.com', {});

			client.once('fetch', () => {
				client.images.should.be.instanceof(Array).and.be.eql(
					['http://www.simple.com/clouds.jpg',
						'http://www.simple.com/image/relative.gif',
						'http://www.simple.com/image/relative2.gif',
						'http://placehold.it/350x150',
						'https://placehold.it/350x65',
						'//placehold.it/350x65'
					]);
				done();
			});

			client.fetch();
		});

		it('should return an array of rss or atom feeds if defined', (done) => {
			client = new MetaInspector('http://www.simple.com', {});

			client.once('fetch', () => {
				client.feeds.length.should.equal(2);

				done();
			});

			client.fetch();
		});

		it('should return the open graph title if defined', (done) => {
			client = new MetaInspector('http://www.simple.com', {});

			client.once('fetch', () => {
				client.ogTitle.should.equal('I am an Open Graph title');

				done();
			});

			client.fetch();
		});

		it('should emit errors', (done) => {
			client = new MetaInspector('http://www.google-404.com/', {});

			client.once('error', (error) => {
				should.exists(error);

				done();
			});

			client.fetch();
		});
	});
});