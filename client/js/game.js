function Game() 
{
    var that = {};
    
    that.spriteRenderer = new spriteRenderer();   
    that.playerName;
    that.syncListTest = new SyncListClient('test');
    that.syncListPlayers = new SyncListClient('player');
    that.syncListBuildings = new SyncListClient('buildings');
    
    that.syncListTest.onAdd.push(function(item){
        that.spriteRenderer.addSprite(sprite({
            context: canvas,
            width: 1000,
            height: 100,
            src: "images/coin-sprite-animation.png",
            numberOfFrames: 10,
            ticksPerFrame: 4,
            loop: true,
            autoClear: false,
            posx: item.location.x,
            posy: item.location.y
        }));
    });
    
    that.cameraCenter = {x:0, y:0};
    
    that.syncListTest.onRemove.push(function(item){
    
        var spriteToRemove;
        
        that.spriteRenderer.sprites.forEach(function(sprite)
        {
            if(sprite.posx == item.location.x &&
              sprite.posy == item.location.y)
                {
                    spriteToRemove = sprite;
                }
        });
                  
        if(spriteToRemove)
        {
            that.spriteRenderer.removeSprite(spriteToRemove);
        }
                                    
    });
    
    that.getElementPosition = function (element) {
	
       var parentOffset,
       	   pos = {
               x: element.offsetLeft,
               y: element.offsetTop 
           };
           
       if (element.offsetParent) {
           parentOffset = that.getElementPosition(element.offsetParent);
           pos.x += parentOffset.x;
           pos.y += parentOffset.y;
       }
       return pos;
    }
    
    that.getMousePosition = function(e)
    {
        var loc = {},
            pos = that.getElementPosition(that.canvasElement),
			tapX = e.targetTouches ? e.targetTouches[0].pageX : e.pageX,
			tapY = e.targetTouches ? e.targetTouches[0].pageY : e.pageY,
			canvasScaleRatio = that.canvasElement.width / that.canvasElement.offsetWidth;

		loc.x = (tapX - pos.x) * canvasScaleRatio - that.cameraCenter.x;
		loc.y = (tapY - pos.y) * canvasScaleRatio - that.cameraCenter.y;
     
        return loc;        
    };
    
    that.tap = function(e)
    {        
		var loc = that.getMousePosition(e);
        
        if(that.lastSpriteOver)
        {
            that.syncListTest.remove({type: 'coin', location : {x: that.lastSpriteOver.posx, y:that.lastSpriteOver.posy}});
            //that.spriteRenderer.removeSprite(that.lastSpriteOver);
            that.lastSpriteOver = null;
        }
        else
        {
            that.syncListTest.push({type: 'coin', location : loc});
        }
    };
    
    that.mousemove = function(e)
    {
		var loc = that.getMousePosition(e);
        
        var spriteOver = that.spriteRenderer.getSpriteAtLocation(loc);
        
        if(spriteOver)
        {
            if(that.lastSpriteOver !== spriteOver)
            {
                if(that.lastSpriteOver)
                {
                    that.lastSpriteOver.hotChangeSrc("images/coin-sprite-animation.png");                    
                }
                that.lastSpriteOver = spriteOver;
                spriteOver.hotChangeSrc("images/coin-sprite-animation-over.png");
            }
        }
        else
        {            
            if(that.lastSpriteOver)
            {
                that.lastSpriteOver.hotChangeSrc("images/coin-sprite-animation.png"); 
                that.lastSpriteOver = null;
            }
        }
    };
    
    that.SetupInputs = function(canvasElement)
    {
        that.canvasElement = canvasElement;
        canvasElement.addEventListener("touchstart", that.tap);
        canvasElement.addEventListener("mousedown", that.tap);
        canvasElement.addEventListener("mousemove", that.mousemove);
        
        canvasElement.addEventListener('keypress', function (e) 
        {
            var key = e.which || e.keyCode;

            var KEY_LEFT = 113;
            var KEY_RIGTH = 100;
            var KEY_UP = 122;
            var KEY_DOWN = 115;
            var speed = 5;
            
            if (key === KEY_LEFT) 
                that.cameraCenter.x -= speed;
            if (key === KEY_RIGTH) 
                that.cameraCenter.x += speed;
            if (key === KEY_UP) 
                that.cameraCenter.y += speed;
            if (key === KEY_DOWN) 
                that.cameraCenter.y -= speed;            
        });
    };
    
    that.handleNetwork = function(socket) {
      console.log('Game connection process here');
      console.log(socket);
      that.syncListTest.handleNetwork(socket);
      that.syncListPlayers.handleNetwork(socket);
      that.syncListBuildings.handleNetwork(socket);
        
        that.player = {
            Name: playerName,
            Score: 0
        };
        that.syncListPlayers.push(that.player);        
    };

    that.handleLogic = function() {
      //console.log('Game is running');
      // This is where you update your game logic
        that.spriteRenderer.update();
    };

    that.handleGraphics = function(gfx) {
      // This is where you draw everything
      gfx.fillStyle = '#fbfcfc';
      gfx.fillRect(0, 0, screenWidth, screenHeight);

      that.spriteRenderer.render(that.cameraCenter);
    
      that.syncListPlayers.items.forEach(function(player, i){
          gfx.font = 'bold 16px Verdana';
          gfx.textAlign = 'Left';
          gfx.lineWidth = 2;
          gfx.fillStyle = '#0045ff';
          gfx.fillText(player.Name + ': '+ player.Score, screenWidth - 150, (i+1) * 20);
          //gfx.strokeStyle = '#27ae60';
          //gfx.strokeText(player.Name + ': '+ player.Score, screenWidth / 2, i * 20)
      });
    /*  gfx.fillStyle = '#2ecc71';
      gfx.strokeStyle = '#27ae60';
      gfx.font = 'bold 50px Verdana';
      gfx.textAlign = 'center';
      gfx.lineWidth = 2;
      gfx.fillText('Now playing...', screenWidth / 2, screenHeight / 2);
      gfx.strokeText('Now playing...', screenWidth / 2, screenHeight / 2);*/
    };
    
    return that;
};