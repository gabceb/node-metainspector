![status](https://secure.travis-ci.org/gabceb/node-metainspector.png?branch=master)

## Node-Metainspector

MetaInspector is an npm package for web scraping purposes. You give it an URL, and it lets you easily get its title, links, images, description, keywords, meta tags....

Metainspector is inspired by the Metainspector gem by [jaimeiniesta](https://github.com/jaimeiniesta/metainspector)

### Scraped data

```
client.url                  # URL of the page
client.scheme               # Scheme of the page (http, https)
client.host                 # Hostname of the page (like, markupvalidator.com, without the scheme)
client.rootUrl              # Root url (scheme + host, i.e http://simple.com/)
client.title                # title of the page, as string
client.links                # array of strings, with every link found on the page as an absolute URL
client.author               # page author, as string
client.keywords             # keywords from meta tag, as array
client.charset              # page charset from meta tag, as string
client.description          # returns the meta description, or the first long paragraph if no meta description is found
client.image                # Most relevant image, if defined with og:image
client.images               # array of strings, with every img found on the page as an absolute URL
client.feeds                # Get rss or atom links in meta data fields as array
client.ogTitle              # opengraph title
client.ogDescription        # opengraph description
client.ogType               # Open Graph Object Type
client.ogUpdatedTime        # Open Graph Updated Time
client.ogLocale             # Open Graph Locale - for languages
```

### Options

```
timeout - Defines the time Metainspector will wait for the url to respond in ms
maxRedirects - Specifies the number of redirects Metainspector will follow
limit - The limit in the number of bytes Metainspector will download when querying a site
```

## Usage

```javascript
var MetaInspector = require('node-metainspector');
var client = new MetaInspector("http://www.google.com", { timeout: 5000 });

client.on("fetch", function(){
    console.log("Description: " + client.description);

    console.log("Links: " + client.links.join(","));
});

client.on("error", function(err){
	console.log(err);
});

client.fetch();

```

## TO DO

Finish implementation of the properties below:

```
Add absolutify url function to return all urls as an absolute url

client.internal_links     	# array of strings, with every internal link found on the page as an absolute URL
client.external_links     	# array of strings, with every external link found on the page as an absolute URL

```

## ZOMG Fork! Thank you!
You're welcome to fork this project and send pull requests. Just remember to include tests.

Copyright (c) 2009-2012 Gabriel Cebrian, released under the MIT license

[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/gabceb/node-metainspector/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

