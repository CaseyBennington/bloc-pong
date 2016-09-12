function Game() {
  var canvas = document.getElementById('myCanvas');
  this.ctx = canvas.getContext('2d');

  this.player = new Player(285, 10);
  this.computer = new Computer(10, 100);
  this.ball = new Ball(this.ctx.canvas.width/2, this.ctx.canvas.height/2);
}

Game.prototype = {
  render: function() {
    this.setupCanvas();
    this.player.render(this.ctx);
    this.computer.render(this.ctx);
    this.ball.render(this.ctx);
  },
  update: function() {
    if (this.paused)
      return;
  },
  setupCanvas: function() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.ctx.setLineDash([5, 2]);

    this.ctx.beginPath();
    this.ctx.moveTo(this.ctx.canvas.width/2, 0);
    this.ctx.lineTo(this.ctx.canvas.width/2, this.ctx.canvas.height);
    this.ctx.strokeStyle="white";
    this.ctx.stroke();
    this.ctx.closePath();
  }
};

function Paddle(x, y) {
  this.x = x;
  this.y = y;
  this.width = 5;
  this.height = 25;
  this.speed = 10;
  this.score = 0;
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
  this.vx = Math.floor(Math.random() * 4 - 4);
  this.vy = 2 - Math.abs(this.vx);
}

Paddle.prototype = {
  render: function(ctx) {
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = "white";
    ctx.fill();
  },
  move: function() {
    if (upPressed && this.y > 0) {
      this.y -= this.speed;
    } else if (downPressed && this.y < game.ctx.canvas.height-this.height) {
      this.y += this.speed;
    }
  }
};

Player.prototype = Object.create(Paddle.prototype);
Player.prototype.constructor = Player;
Computer.prototype = Object.create(Paddle.prototype);
Computer.prototype.constructor = Computer;

Ball.prototype = {
  render: function(ctx) {
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = "white";
    ctx.fill();
  },
  move: function() {
    this.x += this.vx;
    this.y += this.vy;
  },
  update: function() {
    this.move();
    if (this.vx > 0) {
      if (game.player.x <= this.x + this.width && game.player.x > this.x - this.vx + this.width) {
        var collisionDiff = this.x + this.width - game.player.x;
        var k = collisionDiff / this.vx;
        var y = this.vy * k + (this.y - this.vy);
        if (y >= game.player.y && y + this.height <= game.player.y + game.player.height) {
          // collides with right Paddle
          this.x = game.player.x - game.player.width;
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
      if (game.computer.x + game.computer.width >= this.x) {
        var collisionDiff = game.computer.x + game.computer.width - this.x;
        var k = collisionDiff / -this.vx;
        var y = this.vy * k + (this.y - this.vy);
        if (y >= game.computer.y && y + this.height <= game.computer.y + game.computer.height) {
          // collides with left Paddle
          this.x = game.computer.x - game.computer.width;
          this.y = Math.floor(this.y - this.vy + this.vy * k);
          this.vx = -this.vx;
        }
      }
    }

    // Top and bottom collision
    if ((this.vy < 0 && this.y < 0) || (this.vy > 0 && this.y + this.height > game.ctx.canvas.height)) {
      this.vy = -this.vy;
    }
  }
};

var upPressed = false;
var downPressed = false;
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
function keyDownHandler(e) {
  if (e.keyCode == 38) {
    upPressed = true;
    game.player.move();
  } else if (e.keyCode == 40) {
    downPressed = true;
    game.player.move();
  }
}
function keyUpHandler(e) {
  if (e.keyCode == 38) {
    upPressed = false;
  } else if (e.keyCode == 40) {
    downPressed = false;
  }
}

// Initialize our game.
var game = new Game();

// Define our animation frames
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
  game.render();
  game.ball.update();
  animate(step);
}

function MainFunction() {
  game.setupCanvas();
  animate(step);
}

// Begin the game execution
window.onload = function() {
  MainFunction();
};
