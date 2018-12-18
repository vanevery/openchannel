// Not used yet
// var fs = require('fs');
// var https = require('https');
// 
// 
// var express = require('express');
// var app = express();
// var ExpressPeerServer = require('peer').ExpressPeerServer;
// 
// app.use(express.static('public'));
// 
// app.get('/', function(req, res, next) { res.redirect('/openchannel.html'); });
// 
// var server = app.listen(9000);
// 
// var options = {
//     debug: true
// };
// 
// var peerserver = ExpressPeerServer(server, options);
// 
// app.use('/api', peerserver);


var PeerServer = require('peer').PeerServer;
var peerserver = PeerServer({port: 9000, path: '/peerjs'});

peerserver.on('connection', function(id) { 
	console.log("Connection: " + id);
});

peerserver.on('connection', function(id) { 
	console.log("Connection: " + id);
});

peerserver.on('disconnect', function(id) {
	console.log("Disconnect: " + id);
});



