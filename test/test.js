require('mocha');

var MetaInspector = require('../index'),
	should = require('should');

require('./fixtures/fixtures');

describe('metainspector', function(){

	describe('multiple clients', function(){
		var firstClient = new MetaInspector('http://www.google.com');
		var secondClient = new MetaInspector('http://www.google.com');

		it('should not keep the same eventEmitter reference among clients', function(done){
			var calledOnce = false;

			firstClient.on('fetch', function(){
				if (!calledOnce) {
					calledOnce = true;
				} else {
					throw new Error('I should not get called twice');
				}
			});

			secondClient.on('fetch', function(){
				should.exists(secondClient.parsedDocument);

				if (calledOnce) done();
			});

			firstClient.fetch();
			secondClient.fetch();
		});
	});

	describe('client', function(){
		var client = null;

		it('should have a url property', function(done){
			client = new MetaInspector("http://www.google.com");

			client.url.should.equal("http://www.google.com/");
			done();
		});

		it('should add http as the default scheme if no scheme is passed', function(done){
			client = new MetaInspector("www.google.com");

			client.url.should.equal("http://www.google.com/");
			done();
		});

		it('should have a scheme property', function(done){
			client = new MetaInspector("http://www.google.com");

			client.scheme.should.equal("http");
			done();
		});

		it('should have a host property', function(done){
			client = new MetaInspector("http://www.google.com");

			client.host.should.equal("www.google.com");
			done();
		});

		it('should have a rootUrl property', function(done){
			client = new MetaInspector("http://www.google.com");

			client.rootUrl.should.equal("http://www.google.com");
			done();
		});

		it('should have a parsedDocument', function(done){
			client = new MetaInspector("http://www.google.com");

			client.once("fetch", function(){
				should.exists(client.parsedDocument);
				done();
			});

			client.fetch();
		});

		it('should have a title', function(done){
			client = new MetaInspector("http://www.google.com", {});

			client.once("fetch", function(){
				client.title.should.equal("Google");
				done();
			});

			client.fetch();
		});

		it('should have keywords', function(done){
			client = new MetaInspector("http://www.simple.com", {});

			client.once("fetch", function(){
				client.keywords.should.be.instanceof(Array).and.be.eql([ 'HTML', 'CSS', 'XML', 'JavaScript' ]).and.have.lengthOf(4);
				done();
			});

			client.fetch();
		});

		it('keywords should be undefined if there is no keywords', function(done){
			client = new MetaInspector("http://www.google.com", {});

			client.once("fetch", function(){
				client.keywords.should.be.instanceof(Array).and.be.eql([]);
				done();
			});

			client.fetch();
		});

		it('author should be undefined if there is no author', function(done){
			client = new MetaInspector("http://www.google.com", {});

			client.once("fetch", function(){
				should.not.exist(client.author);
				done();
			});

			client.fetch();
		});

		it('charset should be undefined if there is no charset', function(done){
			client = new MetaInspector("http://www.google.com", {});

			client.once("fetch", function(){
				should.not.exist(client.charset);
				done();
			});

			client.fetch();
		});

		it('should have author', function(done){
			client = new MetaInspector("http://www.simple.com", {});

			client.once("fetch", function(){
				client.author.should.be.equal('Author Name');
				done();
			});

			client.fetch();
		});

		it('should have charset', function(done){
			client = new MetaInspector("http://www.simple.com", {});

			client.once("fetch", function(){
				client.charset.should.be.equal('UTF-8');
				done();
			});

			client.fetch();
		});

		it('should have links returned as an array', function(done){
			client = new MetaInspector("http://www.google.com", {});

			client.once("fetch", function(){
				client.links.length.should.equal(51);
				done();
			});

			client.fetch();
		});

		it('should have a description', function(done){
			client = new MetaInspector("http://www.google.com", {});

			client.once("fetch", function(){
				client.description.should.equal("Search the world's information, including webpages, images, videos and more. Google has many special features to help you find exactly what you're looking for.");
				done();
			});

			client.fetch();
		});

		it('should return undefined if the meta description is not defined when metaDescription used', function(done){
			client = new MetaInspector("http://www.simple.com", {});

			client.once("fetch", function(){
				should.not.exist(client.metaDescription);
				done();
			});

			client.fetch();
		});

		it('should find a secondary description if there is no description meta element', function(done){
			client = new MetaInspector("http://www.simple.com", {});

			client.once("fetch", function(){
				client.description.should.equal("This is a new paragraph! This paragraph should be very long so we can grab it as the secondary description. What do you think of that?");
				done();
			});

			client.fetch();
		});

		it('should find a the image based on the og:image tag if defined', function(done){
			client = new MetaInspector("http://www.simple.com", {});

			client.once("fetch", function(){
				client.image.should.equal("http://placehold.it/350x150");
				done();
			});

			client.fetch();
		});

		it('should return an array of absolute image paths for all images on the page', function(done){
			client = new MetaInspector("http://www.simple.com", {});

			client.once("fetch", function(){
				client.images.should.be.instanceof(Array).and.be.eql(
					[ 'http://www.simple.com/clouds.jpg',
						'http://www.simple.com/image/relative.gif',
						'http://www.simple.com/image/relative2.gif',
						'http://placehold.it/350x150',
						'https://placehold.it/350x65',
						'//placehold.it/350x65' ]);
				done();
			});

			client.fetch();
		});

		it('should return an array of rss or atom feeds if defined', function(done){
			client = new MetaInspector("http://www.simple.com", {});

			client.once("fetch", function(){
				client.feeds.length.should.equal(2);
				done();
			});

			client.fetch();
		});

		it('should return the open graph title if defined', function(done){
			client = new MetaInspector("http://www.simple.com", {});

			client.once("fetch", function(){
				client.ogTitle.should.equal("I am an Open Graph title");
				done();
			});

			client.fetch();
		});

		it('should emit errors', function(done){
			client = new MetaInspector("http://www.google-404.com/", {});

			client.once("error", function(error){
				should.exists(error);
				done();
			});

			client.fetch();
		});
	});
});
