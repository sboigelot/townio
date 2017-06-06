var playerName;
var playerNameInput = document.getElementById('playerNameInput');
var socket;

var screenWidth = window.innerWidth;
var screenHeight = window.innerHeight;

var c = document.getElementById('cvs');
var canvas = c.getContext('2d');
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
  calculateFps(canvas);
}

window.addEventListener('resize', function() {
    screenWidth = window.innerWidth;
    screenHeight = window.innerHeight;
    c.width = screenWidth;
    c.height = screenHeight;
}, true);
