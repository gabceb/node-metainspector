var MetaInspector = require('../index'),
	should = require('should'),
	util = require('util');

require('mocha');


describe('metainspector', function(){

	describe('client', function(){
		it('should have a url property', function(done){
			var client = new MetaInspector("http://www.google.com", {});

			client.url.should.equal("http://www.google.com/");
			done();
		});

		it('should add http as the default scheme if no scheme is passed', function(done){
			var client = new MetaInspector("www.google.com", {});

			client.url.should.equal("http://www.google.com/");
			done();
		});

		it('should have a scheme property', function(done){
			var client = new MetaInspector("http://www.google.com", {});

			client.scheme.should.equal("http");
			done();
		});

		it('should have a host property', function(done){
			var client = new MetaInspector("http://www.google.com", {});

			client.host.should.equal("www.google.com");
			done();
		});

		it('should have a rootUrl property', function(done){
			var client = new MetaInspector("http://www.google.com", {});

			client.rootUrl.should.equal("http://www.google.com");
			done();
		});

		it('should have a parsedDocument', function(done){
			var client = new MetaInspector("http://www.google.com", {});

			client.once("fetch", function(){
				should.exists(client.parsedDocument);
				done();
			});

			client.fetch();
		});

		it('should have a title', function(done){
			var client = new MetaInspector("http://www.google.com", {});

			client.once("fetch", function(){
				client.title.should.equal("Google");
				done();
			});

			client.fetch();
		});

		it.skip('should have a links returned as an array', function(done){
			var client = new MetaInspector("http://www.google.com", {});

			client.once("fetch", function(){
				client.links.length.should.equal(33);
				done();
			});

			client.fetch();
		});

		it('should have a description', function(done){
			var client = new MetaInspector("http://www.google.com", {});

			client.once("fetch", function(){
				client.description.should.equal("Search the world's information, including webpages, images, videos and more. Google has many special features to help you find exactly what you're looking for.");
				done();
			});

			client.fetch();
		});

		it.skip('should find a secondary description if there is no description meta element', function(done){
			var client = new MetaInspector("http://www.google.com", {});

			client.once("fetch", function(){
				client.description.should.equal("Search the world's information, including webpages, images, videos and more. Google has many special features to help you find exactly what you're looking for.");
				done();
			});

			client.fetch();
		});

		it('should emit errors', function(done){
			var client = new MetaInspector("http://www.google1456.com/", {});

			client.once("error", function(error){
				should.exists(error);
				done();
			});

			client.fetch();
		});
	});
});