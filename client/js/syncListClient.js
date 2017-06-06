function SyncListClient(listType)
{
    var that = {};
    that.listType = listType;    
    that.items = [];
    that.socket = socket;
    that.onAdd = [];
    that.onRemove = [];
    
    that.handleNetwork = function(socket) {  
      // This is where you receive all socket messages

        that.socket = socket;
        
        console.log('on '+'synclist_'+that.listType+'_serverAdd initiated');
        socket.on('synclist_'+that.listType+'_serverAdd', function(data) {
            var sender = data.sender;
            var item = data.item;
            
            that.items.push(item);
            that.onAdd.forEach(function(callback){
                callback(item);
            });
                        
            console.log('[SyncList<'+that.listType+'>] received synclist_'+that.listType+'_serverAdd', data);
        });
        
        socket.on('synclist_'+that.listType+'_serverRemove', function(data) {
            var sender = data.sender;
            var item = data.item;
            
            //that.items.push(item);
            
            var i;	
            var removed;
            for (i = 0; i < that.items.length; i += 1) 
            {
                if(JSON.stringify(that.items[i]) === JSON.stringify(item) )
                {
                    removed = that.items[i];
                    that.items[i] = null;
                    that.items.splice(i, 1);
                    break;
                }
            }
            
            if(removed)
            {
                that.onRemove.forEach(function(callback){
                    callback(removed);
                });
            }
                        
            console.log('[SyncList<'+that.listType+'>] received synclist_'+that.listType+'_serverRemove', data);
        });
        
        socket.on('synclist_'+that.listType+'_serverSendAll', function(data) {
            console.log('[SyncList<'+that.listType+'>] received synclist_'+that.listType+'_serverSendAll', data);
            that.items = data;
            that.items .forEach(function(item){
                that.onAdd.forEach(function(callback){
                    callback(item);
                });
            });
        });
        
        console.log('[SyncList<'+that.listType+'>] sending synclist_'+that.listType+'_playerRequestAll');
        socket.emit('synclist_'+that.listType+'_playerRequestAll', {});  
    };
    
    that.push = function(item)
    {
        var sender = 'server';
        var data = {sender: 'player', item: item};
        console.log('[SyncList<'+that.listType+'>] sending synclist_'+that.listType+'_playerAdd', data);
        that.socket.emit('synclist_'+that.listType+'_playerAdd', data);       
    };
    
    that.remove = function(item)
    {
        var sender = 'server';
        var data = {sender: 'player', item: item};
        console.log('[SyncList<'+that.listType+'>] sending synclist_'+that.listType+'_playerRemove', data);
        that.socket.emit('synclist_'+that.listType+'_playerRemove', data);       
    };
    
    return that;
}