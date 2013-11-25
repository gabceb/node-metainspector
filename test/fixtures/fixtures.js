var fakeweb = require('node-fakeweb'),
	path = require('path');

fakeweb.allowNetConnect = false;
fakeweb.registerUri({uri: 'http://www.google.com:80/', file: path.join(__dirname, 'google.com.html')});
fakeweb.registerUri({uri: 'http://www.simple.com:80/', file: path.join(__dirname, 'simple.com.html')});

fakeweb.ignoreUri({uri: 'http://www.google-404.com:80/'});