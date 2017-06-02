function spriteRenderer()
{
    var that = {};
    
    that.sprites = [];
    
    that.addSprite = function(sprite)
    {
        that.sprites.push(sprite);
    };
    
    that.removeSprite = function(sprite)
    {
        //TOTEST
        var i;		
		for (i = 0; i < that.sprites.length; i += 1) {
			if (that.sprites[i] === sprite) {
				that.sprites[i] = null;
				that.sprites.splice(i, 1);
				break;
			}
		}
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