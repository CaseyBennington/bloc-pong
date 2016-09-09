var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');

function setupCanvas() {
  ctx.setLineDash([5, 2]);

  ctx.beginPath();
  ctx.moveTo(canvas.width/2, 0);
  ctx.lineTo(canvas.width/2, canvas.height);
  ctx.strokeStyle="white";
  ctx.stroke();
  ctx.closePath();
}

function Paddle() {
  this.x = 1;
  this.y = 1;
  this.width = 6;
  this.height = 30;
  this.speed = 5;
  this.move = function() {
    if (upPressed && this.y < canvas.height-this.height) {
      this.y += this.speed;
    } else if (downPressed && this.y > 0) {
      this.y -= this.speed;
    }
  };
}
function Player() {
  Paddle.call(this);
  this.x = 10;
  this.y = 100;
}
function Computer() {
  Paddle.call(this);
  this.x = 285;
  this.y = 10;
}
function Ball(x, y) {
  this.x = x;
  this.y = y;
  this.width = 6;
  this.height = 6;
}
Player.prototype = Object.create(Paddle.prototype);
Player.prototype.constructor = Player;
Computer.prototype = Object.create(Paddle.prototype);
Computer.prototype.constructor = Computer;

Paddle.prototype.move = function() {
  return stuff;
};
Paddle.prototype.render = function() {
  ctx.beginPath();
  ctx.rect(this.x, this.y, this.width, this.height);
  ctx.fillStyle = "white";
  ctx.fill();
};
//Player.prototype.render = function() {
  //Paddle.render();
//};
//Computer.prototype.render = function() {
  //Paddle.render();
//};
Ball.prototype.render = function() {
  ctx.beginPath();
  ctx.rect(this.x, this.y, this.width, this.height);
  ctx.fillStyle = "white";
  ctx.fill();
};

var player = new Player();
var computer = new Computer();
var ball = new Ball(canvas.width/2, canvas.height/2);

function render() {
  player.render();
  computer.render();
  ball.render();
}

var animate =
        window.requestAnimationFrame(step) ||
        window.webkitRequestAnimationFrame(step) ||
        window.mozRequesetAnimationFrame(step) ||
        window.oRequestAnimationFrame(step) ||
        window.msRequestAnimationFrame(step) ||
        function(step) {
          window.setTimeout(step, 1000/60);
        };
function step() {
  render();
  animate(step);
}
window.onload = function() {
  setupCanvas();
  animate(step);
};

var upPressed = false;
var downPressed = false;
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
function keyDownHandler(e) {
  if (e.keyCode == 38) {
    upPressed = true;
    player.move();
  } else if (e.keyCode == 40) {
    downPressed = true;
    player.move();
  }
}
function keyUpHandler(e) {
  if (e.keyCode == 38) {
    upPressed = false;
  } else if (e.keyCode == 40) {
    downPressed = false;
  }
}
