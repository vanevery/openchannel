// For Let's Encrypt

/*
var express = require('express');
var app = express();
app.use(express.static('public'));
app.listen(80);
*/

// HTTP Portion - Just redirect
var http = require('http');
var httpServer = http.createServer(requestHandler);
httpServer.listen(80);

function requestHandler(req, res) {
  	res.writeHead(302, {'Location': 'https://open-channel.io'});
	res.end();
  	//res.end("Life is wonderful");
}

// Express Portion - https
var https = require('https');
var fs = require('fs'); // Using the filesystem module
var url =  require('url');

var credentials = {
  key: fs.readFileSync('/etc/letsencrypt/live/open-channel.io/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/open-channel.io/cert.pem')
};

var express = require('express');
var app = express();

app.use(function(req,resp,next){
    if (req.headers.host.indexOf("www") > -1) {
        return resp.redirect(301, 'https://open-channel.io/');
    } else {
        return next();
    }
});
 
app.use(express.static('public'));

 
app.get('/', function(req, res, next) { res.redirect('/index.html'); });
 
//var server = app.listen(80);
var httpsServer = https.createServer(credentials, app);
httpsServer.listen(443);
 

// Peer JS Portion

var ExpressPeerServer = require('peer').ExpressPeerServer;

var options = {
     debug: true
};
 
//var peerserver = ExpressPeerServer(server, options);
var peerserver = ExpressPeerServer(httpsServer, options);
 
app.use('/peerjs', peerserver);

peerserver.on('connection', function(id) { 
	console.log("Connection: " + id);
});

peerserver.on('connection', function(id) { 
	console.log("Connection: " + id);
});

peerserver.on('disconnect', function(id) {
	console.log("Disconnect: " + id);
});


