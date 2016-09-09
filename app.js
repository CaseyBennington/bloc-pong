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
  //this.x = x;
  //this.y = y;
  this.width = 6;
  this.height = 30;
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
function Ball() {
  this.x = canvas.width/2;
  this.y = canvas.height/2;
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
var ball = new Ball();

function render() {
  player.render();
  computer.render();
  ball.render();
}
window.onload = function() {
  setupCanvas();
  render();
};
