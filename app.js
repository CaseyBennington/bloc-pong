function Display(x, y) {
  this.x = x;
  this.y = y;
  this.value = 0;
}

function Paddle(x, y) {
  this.x = x;
  this.y = y;
  this.width = 5;
  this.height = 25;
  this.speed = 10;
  this.score = 0;
}

Paddle.prototype = {
  render: function(ctx) {
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = "white";
    ctx.fill();
  }
  // },
  // move: function() {
  //   if (upPressed && this.y > 0) {
  //     this.y -= this.speed;
  //   } else if (downPressed && this.y < game.ctx.canvas.height-this.height) {
  //     this.y += this.speed;
  //   }
  // }
};

// Player.prototype = new Paddle();
// Player.prototype.constructor = Player;
// Computer.prototype = new Paddle();
// Computer.prototype.constructor = Computer;
//
Player.prototype = Object.create(Paddle.prototype);
Player.prototype.constructor = Player;
Computer.prototype = Object.create(Paddle.prototype);
Computer.prototype.constructor = Computer;

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

Computer.prototype = {
  update: function(ball) {
    //this.move;
    console.log(ball);
  }
};

Player.prototype = {
  move: function() {
    if (upPressed && this.y > 0) {
      this.y -= this.speed;
    } else if (downPressed && this.y < game.ctx.canvas.height-this.height) {
      this.y += this.speed;
    }
  }
};

Display.prototype = {
  render: function(ctx) {
    ctx.fillText(this.value, this.x, this.y);
  }
};

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

    // Determine scoring play
    if (this.x >= game.width) {
      game.score(game.computer);
    } else if (this.x + this.width <= 0) {
      game.score(game.player);
    }
  }
};

function Game() {
  var canvas = document.getElementById('myCanvas');
  this.ctx = canvas.getContext('2d');

  this.player = new Player(285, 10);
  this.computer = new Computer(10, 100);
  this.ball = new Ball(this.ctx.canvas.width/2, this.ctx.canvas.height/2);
  this.display1 = new Display(this.width/4, 25);
  this.display2 = new Display(this.width*3/4, 25);
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

      this.ball.update();
      this.display1.value = this.computer.score;
      this.display2.value = this.player.score;
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

    this.display1.render(this.ctx);
    this.display2.render(this.ctx);
  },
  score: function(paddle) {
    paddle.score++;
    var player = paddle == this.computer ? 0 : 1;

    this.ball.x = this.width/2;
    this.ball.y = paddle.y + paddle.height/2;

    this.vx = Math.floor(Math.random() * 4 - 4);
    this.vy = 2 - Math.abs(this.vx);
    if (player == 1)
      this.ball.vx *= -1;
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
  game.computer.update(game.ball);
  animate(step);
}

function MainFunction() {
  animate(step);
}

// Begin the game execution
window.onload = function() {
  MainFunction();
};
