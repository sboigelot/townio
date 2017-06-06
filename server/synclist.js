module.exports = exports = SyncList;

function SyncList(listType){ 
    var that = {};
    
    that.listType = listType;
    
    that.items = [];
    
    that.handleNetwork = function(io, socket) {  
      // This is where you receive all socket messages
        that.socket = socket;
        that.io = io;
        
        socket.on('synclist_'+that.listType+'_playerAdd', function(data) {
            var sender = data.sender;
            var item = data.item;
            
            console.log('[SyncList<'+that.listType+'>] received synclist_'+that.listType+'_playerAdd', data);
            that.push(item);
        });
        
        socket.on('synclist_'+that.listType+'_playerRemove', function(data) {
            var sender = data.sender;
            var item = data.item;
            
            console.log('[SyncList<'+that.listType+'>] received synclist_'+that.listType+'_playerRemove', data);
            that.remove(item);
        });
        
        socket.on('synclist_'+that.listType+'_playerRequestAll', function(data) {
            console.log('[SyncList<'+that.listType+'>] received synclist_'+that.listType+'_playerRequestAll');
        console.log('[SyncList<'+that.listType+'>] sending synclist_'+that.listType+'_serverSendAll',  that.items);
            socket.emit('synclist_'+that.listType+'_serverSendAll', that.items);  
        });
    };
    
    that.push = function(item)
    {
        that.items.push(item);
        var data = {sender: 'server', item: item};
        console.log('[SyncList<'+that.listType+'>] sending synclist_'+that.listType+'_serverAdd', data);
        that.io.emit('synclist_'+that.listType+'_serverAdd', data);     
    };
    
    that.remove = function(item)
    {
        var i;		
        for (i = 0; i < that.items.length; i += 1) 
        {
            //console.log('remove start');
            //console.log('   compare '+i);
            //console.log('       server: '+JSON.stringify(that.items[i]));
            //console.log('       client: '+JSON.stringify(item));
            if(JSON.stringify(that.items[i]) === JSON.stringify(item) )
            {
                //console.log('           match!');
                that.items[i] = null;
                that.items.splice(i, 1);
                break;
            }
            //console.log('remove end');
        }
        var data = {sender: 'server', item: item};
        console.log('[SyncList<'+that.listType+'>] sending synclist_'+that.listType+'_serverRemove', data);
        that.io.emit('synclist_'+that.listType+'_serverRemove', data);     
    }
    
    return that;
}