var fakeweb = require('node-fakeweb'),
    path = require('path');

fakeweb.allowNetConnect = false;
fakeweb.registerUri({uri: 'http://www.google.com:80/', file: path.join(__dirname, 'google.com.html')});
fakeweb.registerUri({uri: 'http://www.simple.com:80/', file: path.join(__dirname, 'simple.com.html')});
fakeweb.registerUri({uri: 'http://www.fastandfurious7-film.com:80/', file: path.join(__dirname, 'fastandfurious7-film.com.html')});
fakeweb.registerUri({uri: 'http://www.techsuplex.com:80/', file: path.join(__dirname, 'techsuplex.com.html')});
fakeweb.registerUri({uri: 'http://scriptinptag.html:80/', file: path.join(__dirname, 'scriptinptag.html')});

fakeweb.registerUri({uri: 'http://www.404-response.com:80/', statusCode: 404});