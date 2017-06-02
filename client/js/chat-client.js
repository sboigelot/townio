function ChatClient(socket) {
    var self = this;
    self.socket = socket;
        
    self.sendChatMsg = function(text) {
        var self = this;
        console.log('sendChatMsg', text);
        self.socket.emit('playerChat', { sender: playerName, message: text });
        self.addChatLine(playerName, text, true);
    };
    
    self.handleNetwork = function(socket) {  
      // This is where you receive all socket messages
      socket.on('serverSendPlayerChat', function (data) {
         self.addChatLine(data.sender, data.message, false);
      });
    };

    self.addChatLine = function (name, message, me) 
    {
        var self = this;
        var newline = document.createElement('li');

        // Colours the chat input correctly.
        newline.className = (me) ? 'me' : 'friend';
        newline.innerHTML = '<b>' + ((name.length < 1) ? 'An unnamed cell' : name) + '</b>: ' + message;

        self.appendMessage(newline);
    };
    
    self.appendMessage = function (node) {

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
            self.sendChatMsg(chatInput.value);
            chatInput.value = "";
        }
    });
}