module.exports = exports = SyncList;

function SyncList(listType){ 
    var that = {};
    
    that.onAdd = [];
    that.onRemove = [];
    
    that.enableLog = false;
    that.log = function(content, data)
    {
        if(!that.enableLog)
            return;
        if(data)
            console.log('[SyncList<'+that.listType+'>] '+ content, data);
        else
            console.log('[SyncList<'+that.listType+'>] '+ content);        
    }
    
    that.listType = listType;
    
    that.items = [];
    
    that.handleNetwork = function(io, socket) {  
      // This is where you receive all socket messages
        that.socket = socket;
        that.io = io;
        
        socket.on('synclist_'+that.listType+'_playerAdd', function(data) {
            var sender = data.sender;
            var item = data.item;

            that.log('received synclist_'+that.listType+'_playerAdd', data);
            that.push(item);
        });

        socket.on('synclist_'+that.listType+'_playerRemove', function(data) {
            var sender = data.sender;
            var item = data.item;

            that.log('received synclist_'+that.listType+'_playerRemove', data);
            that.remove(item);
        });
        
        socket.on('synclist_'+that.listType+'_playerRequestAll', function(data) {
            that.log('received synclist_'+that.listType+'_playerRequestAll');
            that.log('sending synclist_'+that.listType+'_serverSendAll',  that.items);
            socket.emit('synclist_'+that.listType+'_serverSendAll', that.items);  
        });
    };
    
    that.push = function(item)
    {            
        that.items.push(item);
        that.onAdd.forEach(function(callback){
            callback(item);
        });
        
        var data = {sender: 'server', item: item};
        that.log('sending synclist_'+that.listType+'_serverAdd', data);
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
                var removed = that.items[i];
                that.items[i] = null;
                that.onRemove.forEach(function(callback){
                    callback(removed);
                });
                that.items.splice(i, 1);
                break;
            }
            //console.log('remove end');
        }
        
        var data = {sender: 'server', item: item};
        that.log('sending synclist_'+that.listType+'_serverRemove', data);
        that.io.emit('synclist_'+that.listType+'_serverRemove', data);     
    }
    
    return that;
}