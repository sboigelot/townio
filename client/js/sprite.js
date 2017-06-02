function sprite (options) {
				
    var that = {};
					
    that.frameIndex = 0;
    that.tickCount = 0;
    that.ticksPerFrame = options.ticksPerFrame || 0;
    that.context = options.context;
    that.width = options.width;
    that.height = options.height;
    that.image = new Image();
    that.image.src = options.src;
    that.numberOfFrames = options.numberOfFrames || 1;
    that.loop = options.loop;
    that.posx = options.posx || 0,
    that.posy = options.posy || 0;
    that.autoClear = options.autoClear;
    
    that.render = function () {
	
        if(that.autoClear) {
            // Clear the canvas
            context.clearRect(0, 0, that.width, that.height);            
        }
        
        // Draw the animation
        that.context.drawImage(
           that.image,
           that.frameIndex * that.width / that.numberOfFrames,
           0,
           that.width / that.numberOfFrames,
           that.height,
           that.posx,
           that.posy,
           that.width / that.numberOfFrames,
           that.height);
        
    };
    
    that.update = function () {

        that.tickCount += 1;
			
        if (that.tickCount > that.ticksPerFrame) {
        
            that.tickCount = 0;
        	
            // If the current frame index is in range
            if (that.frameIndex < that.numberOfFrames - 1) {	
                // Go to the next frame
                that.frameIndex += 1;
            } else if (that.loop) {
                that.frameIndex = 0;
            }
        }
    }; 
    
    return that;
}