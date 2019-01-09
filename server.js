const STATUS_CONNECTED = "Connected";
const STATUS_DISCONNECTED = "Not Connected";
const STATUS_FULL = "Channel Full";

const CHANNEL_PEERS = "CHANNEL_PEERS";
const NEW_CHANNEL_PEER = "NEW_CHANNEL_PEER";
const DISCONNECT_CHANNEL_PEER = "DISCONNECT_CHANNEL_PEER";
const CHANNEL_STATUS_MESSAGE = "CHANNEL_STATUS_MESSAGE";

const MAX_USERS = 10;
const MAX_TIME = 10 * 60 * 1000;

// For Testing
//const MAX_TIME = 5000;

function log(toLog) {
	console.log(Date.now() + " " + toLog);
}


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
     debug: false
};
 
//var peerserver = ExpressPeerServer(server, options);
var peerserver = ExpressPeerServer(httpsServer, options);
 
app.use('/peerjs', peerserver);

peerserver.on('connection', function(id) { 
	log("Peer Connection: " + id);
});

peerserver.on('disconnect', function(id) {
	log("Peer Disconnect: " + id);
});

// Socket.io Portion

let connectedSockets = [];

var io = require('socket.io')(httpsServer);

io.on('connection', function (socket) {
	if (connectedSockets.length < MAX_USERS) {
		connectedSockets.push(socket);
	} else {
		// Send message that channel is full	
		socket.emit(CHANNEL_STATUS_MESSAGE, STATUS_FULL);
		socket.disconnect();	
	}

	log("New Connection: socket.id: " + socket.id);
	log("Connected Sockets: " + connectedSockets.length);

	socket.on('peerid', function(data) {
		log(socket.id + " peerid: " + data);
		socket.peerid = data;
		
		socket.startTime = Date.now();
		socket.maxTimeTimeout = setTimeout(function() {
			log(socket.id + " timeout");
			socket.disconnect(true);
		}, MAX_TIME);

		let channelPeers = [];
		for (let i = 0; i < connectedSockets.length; i++) {
			if (connectedSockets[i].peerid) {
				channelPeers.push(connectedSockets[i].peerid);
			}
		}
		log("Sending " + channelPeers.length + " channelPeers");
		socket.emit(CHANNEL_PEERS, channelPeers);

		socket.broadcast.emit(NEW_CHANNEL_PEER, socket.peerid);	
	});
	
	socket.on('disconnect', function() {
		log(socket.id + " disconnect ");
		 
		clearTimeout(socket.maxTimeTimeout);
	
		var indexToRemove = connectedSockets.indexOf(socket);
		if (indexToRemove > -1) {
			connectedSockets.splice(indexToRemove, 1);
		}
		
		socket.broadcast.emit(DISCONNECT_CHANNEL_PEER, socket.peerid);	
	});	
});

