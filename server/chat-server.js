module.exports = exports = ChatServer;

function ChatServer(){ 
    var that = {};
    
    that.handleNetwork = function(socket) {  
      // This is where you receive all socket messages

        socket.on('playerChat', function(data) {
            var _sender = data.sender;//.replace(/(<([^>]+)>)/ig, '');
            var _message = data.message;//.replace(/(<([^>]+)>)/ig, '');
            console.log('[CHAT] [' + (new Date()).getHours() + ':' + (new Date()).getMinutes() + '] ' + _sender + ': ' + _message);
            socket.broadcast.emit('serverSendPlayerChat', {sender: _sender, message: _message});
        });
    };
    
    return that;
}