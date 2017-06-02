const express = require('express')
const app = express()
const http    = require('http').Server(app);
const io      = require('socket.io')(http);
const chatServer = require('./chat-server')();
const config  = require('./config.json');

app.use(express.static(__dirname + '/../client'));

io.on('connection', function (socket) {
  console.log("Somebody connected! "+socket.id);
  console.log("chatServer: "+chatServer);
  chatServer.handleNetwork(socket);
});

var serverPort = process.env.PORT || config.port;
http.listen(serverPort, function() {
  console.log("Server is listening on port " + serverPort);
});