function Game() 
{
    var that = {};
    
    that.spriteRenderer = new spriteRenderer();   

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

		loc.x = (tapX - pos.x) * canvasScaleRatio;
		loc.y = (tapY - pos.y) * canvasScaleRatio;
     
        return loc;        
    };
    
    that.tap = function(e)
    {        
		var loc = that.getMousePosition(e);
        
        if(that.lastSpriteOver)
        {
            that.spriteRenderer.removeSprite(that.lastSpriteOver);
            that.lastSpriteOver = null;
        }
        else
        {
            that.spriteRenderer.addSprite(sprite({
                context: canvas,
                width: 1000,
                height: 100,
                src: "images/coin-sprite-animation.png",
                numberOfFrames: 10,
                ticksPerFrame: 4,
                loop: true,
                autoClear: false,
                posx: loc.x,
                posy: loc.y
            }));
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
    };
    
    that.handleNetwork = function(socket) {
      console.log('Game connection process here');
      console.log(socket);
      // This is where you receive all socket messages
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

      that.spriteRenderer.render();

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