module.exports = exports = Game;

const syncList = require('./synclist');

function Game(listType){ 
    var that = {};
    
    that.syncListTest = syncList('test');
    that.syncListPlayers = syncList('player');
    that.syncListPlayers.onAdd.push(function(player){
        that.log("Adding player to sync list");
        player.test = 'test';
    });
    that.syncListBuildings = syncList('buildings');
    
    that.enableLog = true;
    that.log = function(content, data)
    {
        if(!that.enableLog)
            return;
        if(data)
            console.log('[SyncList<'+that.listType+'>] '+ content, data);
        else
            console.log('[SyncList<'+that.listType+'>] '+ content);        
    }
          
    that.handleNetwork = function(io, socket) 
    {
        that.socket = socket;
        that.io = io;
        
        that.syncListTest.handleNetwork(io, socket);
        that.syncListPlayers.handleNetwork(io, socket);
        that.syncListBuildings.handleNetwork(io, socket);
        
        socket.on("request_clientId", function(data){
           that.log("Client requested clientId, responding: ", socket.id);
           socket.emit('respond_clientId', socket.id);
        });
      
        socket.on('disconnect', function() {
            that.log('Player got disconnect! socket id = ', socket.id);

            var disconnectedPlayer;
            that.syncListPlayers.items.forEach(function(player){
                if(player.ClientId === socket.id)
                    {
                        disconnectedPlayer = player;
                    }
            });
            
            if(disconnectedPlayer)
            {
                that.syncListPlayers.remove(disconnectedPlayer);
            }
       });
    }
    
    return that;
}