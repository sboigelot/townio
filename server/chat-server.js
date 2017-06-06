module.exports = exports = ChatServer;

function ChatServer(){ 
    var that = {};
    
    that.enableLog = false;
    that.log = function(content, data)
    {
        if(!that.enableLog)
            return;
        var dateStr = '[' + (new Date()).getHours() + ':' + (new Date()).getMinutes() + ']';
        if(data)
            console.log('[CHAT] '+ dateStr + content, data);
        else
            console.log('[CHAT]' + dateStr + content);        
    }
    
    that.handleNetwork = function(socket) {  
      // This is where you receive all socket messages

        socket.on('playerChat', function(data) {
            var _sender = data.sender;//.replace(/(<([^>]+)>)/ig, '');
            var _message = data.message;//.replace(/(<([^>]+)>)/ig, '');
            that.log(_sender,_message);
            socket.broadcast.emit('serverSendPlayerChat', {sender: _sender, message: _message});
        });
    };
    
    return that;
}