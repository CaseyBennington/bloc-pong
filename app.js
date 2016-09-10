var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');

function setupCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.setLineDash([5, 2]);

  ctx.beginPath();
  ctx.moveTo(canvas.width/2, 0);
  ctx.lineTo(canvas.width/2, canvas.height);
  ctx.strokeStyle="white";
  ctx.stroke();
  ctx.closePath();
}

function Paddle(x, y) {
  this.x = x;
  this.y = y;
  this.width = 5;
  this.height = 25;
  this.speed = 10;
}
function Player(x, y) {
  Paddle.call(this);
  this.x = x;
  this.y = y;
}
function Computer(x, y) {
  Paddle.call(this);
  this.x = x;
  this.y = y;
}
function Ball(x, y) {
  this.x = x;
  this.y = y;
  this.width = 5;
  this.height = 5;
  this.vx = Math.floor(Math.random() * 4 - 2);
  this.vy = 3 - Math.abs(this.vx);
}

Paddle.prototype = {
  render: function() {
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = "white";
    ctx.fill();
  },
  move: function() {
    if (upPressed && this.y > 0) {
      this.y -= this.speed;
    } else if (downPressed && this.y < canvas.height-this.height) {
      this.y += this.speed;
    }
  }
};

Player.prototype = Object.create(Paddle.prototype);
Player.prototype.constructor = Player;
Computer.prototype = Object.create(Paddle.prototype);
Computer.prototype.constructor = Computer;
//Player.prototype.render = function() {
  //Paddle.render();
//};
//Computer.prototype.render = function() {
  //Paddle.render();
//};

Ball.prototype = {
  render: function() {
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = "white";
    ctx.fill();
  },
  update: function() {
    this.x += this.vx;
    this.y += this.vy;

    if (this.vx > 0) {
      if (player.x <= this.x + this.width && player.x > this.x - this.vx + this.width) {
        var collisionDiff = this.x + this.width - player.x;
        var k = collisionDiff / this.vx;
        var y = this.vy * k + (this.y - this.vy);
        if (y >= player.y && y + this.height <= player.y + player.height) {
          // collides with right Paddle
          this.x = player.x - player.width;
          this.y = Math.floor(this.y - this.vy + this.vy * k);
          this.vx = -this.vx;
        }
      }
      //if (this.x + this.vx > canvas.width - this.width || this.x + this.vx < 0) {
      //  score increase
      //}
      //if (this.y + this.vy > canvas.height - this.height || this.y + this.vy < 0) {
      //  this.vy = -this.vy;
      //}
    } else {
      if (computer.x + computer.width >= this.x) {
        var collisionDiff = computer.x + computer.width - this.x;
        var k = collisionDiff / -this.vx;
        var y = this.vy * k + (this.y - this.vy);
        if (y >= computer.y && y + this.height <= computer.y + computer.height) {
          // collides with left Paddle
          this.x = computer.x - computer.width;
          this.y = Math.floor(this.y - this.vy + this.vy * k);
          this.vx = -this.vx;
        }
      }
    }

    // Top and bottom collision
    if ((this.vy < 0 && this.y < 0) || (this.vy > 0 && this.y + this.height > canvas.height)) {
      this.vy = -this.vy;
    }
  }
};

var player = new Player(285, 10);
var computer = new Computer(10, 100);
var ball = new Ball(canvas.width/2, canvas.height/2);

function render() {
  setupCanvas();
  player.render();
  computer.render();
  ball.render();
}

var animate =
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequesetAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(step) {
          window.setTimeout(step, 1000/60);
        };
function step() {
  render();
  ball.update();
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
