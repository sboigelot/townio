function BasicUiComponent()
{
    var that = {};
    that.visible = true;    
    that.position = {x:0, y:0};
    that.size = {x:100, y:100};
    that.backgroundColor = '#fbfcfc';
    that.update = null;
    
    that.render = function(ctx)
    {   
        if(!that.visible)
        {
            return;
        }
        
        gfx.fillStyle = that.backgroundColor;
        gfx.fillRect(that.position.x, that.position.y,  that.size.x,  that.size.y);
    };
    
    return that;    
}

function Canvas()
{
    var that = new BasicUiComponent();
     
    that.children = [];
    that.childBinding = null;
        
    that.update = function()
    {   
        if(!that.visible)
        {
            return;
        }
        
        that.children.forEach(function(child){
            if(child.update)
                child.update();
        })
    };
    
    that.render = function(ctx)
    {   
        if(!that.visible)
        {
            return;
        }
        
        if(that.childBinding)
        {
            that.children = that.childBinding();
        }
        
        gfx.fillStyle = that.backgroundColor;
        gfx.fillRect(that.position.x, that.position.y,  that.size.x,  that.size.y);
        
        that.children.forEach(function(child){
            if(child.render)
                child.render(ctx);
        });
    };
    
    return that;
}

function Label()
{    
    var that = new BasicUiComponent();
    
    that.text = "no text";
    that.foregroundColor = '#0045ff';
    that.font ='bold 16px Verdana';
    that.textAlign = 'Left';
    that.lineWidth = 2;
    that.textBinding = null;
        
    that.render = function(ctx)
    {   
        if(!that.visible)
        {
            return;
        }
        
        if(that.textBinding)
        {
            that.text = that.textBinding();
        }
        
        gfx.fillStyle = that.backgroundColor;
        gfx.fillRect(that.position.x, that.position.y,  that.size.x,  that.size.y);
                
        gfx.font = that.font;
        gfx.textAlign = that.textAlign;
        gfx.lineWidth = that.lineWidth;
        gfx.fillStyle = that.foregroundColor;
        gfx.fillText(that.text, that.position.x, that.position.y);
    };
    
    return that;
}

function StackPanel()
{
    var that = new Canvas();
    
    that.childSpacing = 2;    
    
    that.update = function()
    {   
        if(!that.visible)
        {
            return;
        }
        
        if(that.childBinding)
        {
            that.children = that.childBinding();
        }
        
        var offsety = 0;
        that.children.forEach(function(child, index)
        {
            offsety += that.childSpacing;
            child.position = {
                x: 0,
                y: offsety
            };
            if(child.update)
                child.update();
            offsety += child.size.y;
        });
    };
}