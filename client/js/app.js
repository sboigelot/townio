var playerName;
var playerNameInput = document.getElementById('playerNameInput');
var socket;

var screenWidth = window.innerWidth;
var screenHeight = window.innerHeight;

var c = document.getElementById('cvs');
var canvas = c.getContext('2d');

//ISOMER
var iso = new Isomer(c);
var Shape = Isomer.Shape;
var Point = Isomer.Point;

/* add() also accepts arrays */

function makeGrid(xSize, ySize, zHeight, gridColor) {
  for (x = 0; x < xSize + 1; x++) {
    iso.add(new Isomer.Path([
      new Point(x, 0, zHeight),
      new Point(x, xSize, zHeight),
      new Point(x, 0, zHeight)
    ]), gridColor);
  }
  for (y = 0; y < ySize + 1; y++) {
    iso.add(new Isomer.Path([
      new Point(0, y, zHeight),
      new Point(ySize, y, zHeight),
      new Point(0, y, zHeight)
    ]), gridColor);
  }
}


var hoverColor = new Isomer.Color(150, 0, 0, 0.4);
var red = new Isomer.Color(160, 60, 50);
var blue = new Isomer.Color(50, 60, 160);

var stage = new createjs.Stage("canvas01");
    
//render for hit detection
iso.add(Shape.Prism(new Point(0, 0, 0)));//
var dataUrl2 = c.toDataURL();//
var bitmap2 = new createjs.Bitmap(dataUrl2);//
bitmap2.name = 'uno';//
iso.canvas.clear();//

function init() {
  stage.enableMouseOver(10);
  stage.addChild(bitmap2);
  //bitmap2.on("mouseover", handleInteraction);
  //bitmap2.on("mouseout", handleInteraction);
  bitmap2.addEventListener("click", function(event) {
    console.log('clicked Uno');
  });   
}
init();

function drawiso()
{
  /*  iso.add([
      Shape.Prism(Point.ORIGIN, 4, 4, 1),
      Shape.Prism(new Point(-1, 1, 0), 1, 2, 1),
      Shape.Prism(new Point(1, -1, 0), 2, 1, 1)
    ]);*/
    
    
  makeGrid(7, 7, 0, new Isomer.Color(111, 111, 111, 1));
  iso.add(Shape.Prism(new Point(0, 0, 0)));//
    
  /*  var offset = game.cameraCenter;
    iso.add(Shape.Prism(Point(5 - offset.x/10, 0, -5 + offset.y/10), 3, 3, 1));
    iso.add(Shape.Pyramid(Point(5 - offset.x/10, 2, -4+ offset.y/10)), red);
    iso.add(Shape.Prism(Point(7 - offset.x/10, 0, -4+ offset.y/10)), blue);
    iso.add(Shape.Prism(Point(7.1 - offset.x/10,0.1, -3+ offset.y/10),0.8,0.8,0.8), blue);*/
}
          
//ENDISOMER

c.width = screenWidth; 
c.height = screenHeight;

var KEY_ENTER = 13;

var game = new Game();
var chatClient= new ChatClient();

function startGame() {
    playerName = playerNameInput.value.replace(/(<([^>]+)>)/ig, '');
    document.getElementById('gameAreaWrapper').style.display = 'block';
    document.getElementById('startMenuWrapper').style.display = 'none';
    socket = io();
    SetupSocket(socket);    
    animloop();
    game.SetupInputs(c);
}

// check if nick is valid alphanumeric characters (and underscores)
function validNick() {
    var regex = /^\w*$/;
    console.log('Regex Test', regex.exec(playerNameInput.value));
    return regex.exec(playerNameInput.value) !== null;
}

window.onload = function() {
    'use strict';

    //Setup start button
    var btn = document.getElementById('startButton');
	var nickErrorText = document.querySelector('#startMenu .input-error');

    btn.onclick = function () {

        // check if the nick is valid
        if (validNick()) 
		{
            startGame();
        } 
		else 
		{
            nickErrorText.style.display = 'inline';
        }
    };

    playerNameInput.addEventListener('keypress', function (e) {
        var key = e.which || e.keyCode;

        if (key === KEY_ENTER) 
		{
            if (validNick()) 
			{
                startGame();
            } 
			else
			{
                nickErrorText.style.display = 'inline';
            }
        }
    });
};

function SetupSocket(socket) {
  chatClient.handleNetwork(socket);
    game.playerName = playerName;
  game.handleNetwork(socket);
      
  // socket.on('connect',function(){
    // socket.emit('greetings', { sender: playerName });
  // });  
}

window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            function( callback ){
                window.setTimeout(callback, 1000 / 60); //60fps
            };
})();

var lastCalledTime;
var fps;
var showfps = true;
var avgFps = [];

function calculateFps(gfx) {

  if(!lastCalledTime) {
     lastCalledTime = Date.now();
     fps = 0;
     return;
  }
  delta = (Date.now() - lastCalledTime)/1000;
  lastCalledTime = Date.now();
  fps = 1/delta;
    
  if(showfps)
  {
      avgFps.push(fps);
      while(avgFps.length > 100)
          avgFps.splice(0,1);

      var sum = 0;
        for( var i = 0; i < avgFps.length; i++ ){
            sum += avgFps[i];
        }

        var avg = sum/avgFps.length;
      
      gfx.font = 'bold 16px Verdana';
      gfx.textAlign = 'Left';
      gfx.lineWidth = 2;
      gfx.fillStyle = '#0045ff';
      gfx.fillText('fps: '+Math.round(avg), 10, 15);
  }
} 

function animloop(){
    requestAnimFrame(animloop);
    gameLoop();
}

function gameLoop() {
  game.handleLogic();
  game.handleGraphics(canvas);
  drawiso();
  calculateFps(canvas);
}

window.addEventListener('resize', function() {
    screenWidth = window.innerWidth;
    screenHeight = window.innerHeight;
    c.width = screenWidth;
    c.height = screenHeight;
}, true);
