// Not used yet
// var fs = require('fs');
// var https = require('https');

// HTTP Portion - Just redirect
var http = require('http');
var httpServer = http.createServer(requestHandler);
httpServer.listen(80);

function requestHandler(req, res) {
  	//res.writeHead(302, {'Location': 'https://open-channel.io'});
  	res.end("Life is wonderful");
}

// Express Portion - https
/*
var https = require('https');
var fs = require('fs'); // Using the filesystem module
var url =  require('url');

var credentials = {
  key: fs.readFileSync('my-key.pem'),
  cert: fs.readFileSync('my-cert.pem')
};

var express = require('express');
var app = express();
 
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
*/


