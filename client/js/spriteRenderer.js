function spriteRenderer()
{
    var that = {};
    
    that.sprites = [];
    
    that.addSprite = function(sprite)
    {
        that.sprites.push(sprite);
        that.sprites = that.sprites.sort(function(s1,s2){
           return s1.zIndex - s2.zIndex;               
        });
    };
    
    that.removeSprite = function(sprite)
    {
        var i;		
		for (i = 0; i < that.sprites.length; i += 1) {
			if (that.sprites[i] === sprite) {
				that.sprites[i] = null;
				that.sprites.splice(i, 1);
				break;
			}
		}
    };
    
    that.distance = function(p1, p2)
    {	
		var dx = p1.x - p2.x,
			dy = p1.y - p2.y;
			
		return Math.sqrt(dx * dx + dy * dy);
	};
	
    
    that.getSpriteAtLocation = function(loc)
    {
        var sprite;
       
        for (var i = 0; i < that.sprites.length; i += 1) {
		
			// Distance between tap and coin
			dist = that.distance({
				x: (that.sprites[i].posx + that.sprites[i].getFrameWidth() / 2 * that.sprites[i].scaleRatio),
				y: (that.sprites[i].posy + that.sprites[i].getFrameWidth() / 2 * that.sprites[i].scaleRatio)
			}, {
				x: loc.x,
				y: loc.y
			});
			
			// Check for tap collision with coin		
			if (dist < that.sprites[i].getFrameWidth() / 2 * that.sprites[i].scaleRatio) {
				sprite = that.sprites[i];
			}
		}
        
        return sprite;
    };
    
    that.update = function()
    {        
        that.sprites.forEach(function(sprite){
            sprite.update();
        });
    };
    
    that.render = function()
    {        
        that.sprites.forEach(function(sprite){
            sprite.render();
        });
    };
    
    return that;
}