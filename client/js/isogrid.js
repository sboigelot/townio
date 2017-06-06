function IsoGrid() 
{
    var that = {};
    
    that.visible = true;
    that.size = {x: 250, y: 250};
    that.tileSize = {x: 64, y: 64};
    
    that.drawLine = function(pp1, pp2, ctx, offset)
    {
        var p1 = {x: pp1.x + offset.x,
                  y: pp1.y + offset.y};
        var p2 = {x: pp2.x + offset.x,
                  y: pp2.y + offset.y};
        
        if(p1.x >= -that.tileSize.x && 
           p1.x <= screenWidth + that.tileSize.x &&
           p1.y >= -that.tileSize.y &&
           p1.y <= screenHeight + that.tileSize.y &&
           p2.x >= -that.tileSize.x && 
           p2.x <= screenWidth + that.tileSize.x &&
           p2.y >= -that.tileSize.y &&
           p2.y <= screenHeight + that.tileSize.y)
            {        
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();        
            }
    };
    
    that.drawSquare = function(x, y, ctx, offset)
    {
        var corners = [
            { x: x * that.tileSize.x, y: y * that.tileSize.y},
            { x: (x+1) * that.tileSize.x, y: y * that.tileSize.y},
            { x: (x+1) * that.tileSize.x, y: (y+1) * that.tileSize.y},
            { x: x * that.tileSize.x, y: (y+1) * that.tileSize.y}
        ];
        
        //-
        that.drawLine(corners[0], corners[1], ctx, offset);
        
        // |
        if(x == that.size.x - 1)
            that.drawLine(corners[1], corners[2], ctx, offset);
        
        //_
        if(y == that.size.y - 1)
         that.drawLine(corners[2], corners[3], ctx, offset);
        
        //|
        that.drawLine(corners[3], corners[0], ctx, offset);
    };
    
    that.render = function(ctx, offset)
    {   
        for(var y = 0; y < that.size.y; y++)
        {
            for(var x = 0; x < that.size.x; x++)
            {
                that.drawSquare(x, y, ctx, offset);
            }
        }
    };
    
    return that;
}