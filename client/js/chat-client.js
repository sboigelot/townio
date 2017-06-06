function ChatClient() {
    var that = {};
        
    that.sendChatMsg = function(text) {
        var that = this;
        console.log('sendChatMsg', text);
        that.socket.emit('playerChat', { sender: playerName, message: text });
        that.addChatLine(playerName, text, true);
    };
    
    that.handleNetwork = function(socket) {  
    that.socket = socket;
      // This is where you receive all socket messages
      socket.on('serverSendPlayerChat', function (data) {
         that.addChatLine(data.sender, data.message, false);
      });
    };

    that.addChatLine = function (name, message, me) 
    {
        var that = this;
        var newline = document.createElement('li');

        // Colours the chat input correctly.
        newline.className = (me) ? 'me' : 'friend';
        newline.innerHTML = '<b>' + ((name.length < 1) ? 'An unnamed cell' : name) + '</b>: ' + message;

        that.appendMessage(newline);
    };
    
    that.appendMessage = function (node) {

        var chatList = document.getElementById('chatList');
        if (chatList.childNodes.length > 10) {
            chatList.removeChild(chatList.childNodes[0]);
        }
        chatList.appendChild(node);
    };
    
    var chatInput = document.getElementById('chatInput');    
    chatInput.addEventListener('keypress', function (e) {
        var key = e.which || e.keyCode;

        if (key === KEY_ENTER) 
        {
            that.sendChatMsg(chatInput.value);
            chatInput.value = "";
        }
    });
    
    return that;
}