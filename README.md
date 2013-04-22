![status](https://secure.travis-ci.org/gabceb/node-metainspector.png?branch=master)

## Metainspector

MetaInspector is an npm for web scraping purposes. You give it an URL, and it lets you easily get its title, links, images, charset, description, keywords, meta tags.... Metainspector is inspired by the Metainspector gem by [jaimeiniesta](https://github.com/jaimeiniesta/metainspector)

```
page.url                # URL of the page
page.scheme             # Scheme of the page (http, https)
page.host               # Hostname of the page (like, markupvalidator.com, without the scheme)
page.root_url           # Root url (scheme + host, like http://markupvalidator.com/)
page.title              # title of the page, as string
page.links              # array of strings, with every link found on the page as an absolute URL
page.internal_links     # array of strings, with every internal link found on the page as an absolute URL
page.external_links     # array of strings, with every external link found on the page as an absolute URL
page.meta_description   # meta description, as string
page.description        # returns the meta description, or the first long paragraph if no meta description is found
page.meta_keywords      # meta keywords, as string
page.image              # Most relevant image, if defined with og:image
page.images             # array of strings, with every img found on the page as an absolute URL
page.feed               # Get rss or atom links in meta data fields as array
page.meta_og_title      # opengraph title
page.meta_og_image      # opengraph image
page.charset            # UTF-8
page.content_type       # content-type returned by the server when the url was requested
```

## Usage

```javascript
var client = new MetaInspector("http://www.google.com", {});

client.on("fetch", function(body){
    console.log(body);
});

client.fetch();

```

## Examples

You can view more examples in the [example folder.](https://github.com/gabceb/node-metainspector/tree/master/examples)

## ZOMG Fork! Thank you!
You're welcome to fork this project and send pull requests. Just remember to include tests.

Copyright (c) 2009-2012 Gabriel Cebrian, released under the MIT license