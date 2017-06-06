module.exports = exports = Game;

const syncList = require('./synclist');

function Game(listType){ 
    var that = {};
    
    that.syncListTest = syncList('test');
    that.syncListPlayers = syncList('player');
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
    }
    
    return that;
}