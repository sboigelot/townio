const express = require('express')
const app = express()
const http    = require('http').Server(app);
const io      = require('socket.io')(http);
const chatServer = require('./chat-server')();
const config  = require('./config.json');
const game = require('./game')();

app.use(express.static(__dirname + '/../client'));

io.on('connection', function (socket) {
    console.log("[Server] Somebody connected! "+socket.id);
  
    chatServer.handleNetwork(socket);
    game.handleNetwork(io, socket);
});

var serverPort = process.env.PORT || config.port;
http.listen(serverPort, function() {
  console.log("[Server] listening on port " + serverPort);
});