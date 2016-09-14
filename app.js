class Display {
  constructor (x, y, v) {
    this.x = x;
    this.y = y;
    this.value = v;
  }
  render (ctx) {
    ctx.fillText(this.value, this.x, this.y);
  }
}

class Paddle {
  constructor (x, y) {
    this.x = x;
    this.y = y;
    this.width = 5;
    this.height = 25;
    this.speed = 10;
    this.score = 0;
  }
  render (ctx) {
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = "white";
    ctx.fill();
  }
}

class Player extends Paddle {
  constructor (x, y, width, height, speed, score) {
    super(width, height, speed, score);
    this.x = x;
    this.y = y;
  }
  move () {
    if (upPressed && this.y > 0) {
      this.y -= this.speed;
    } else if (downPressed && this.y < game.ctx.canvas.height-this.height) {
      this.y += this.speed;
    }
  }
}

class Computer extends Paddle {
  constructor (x, y, width, height, speed, score) {
    super(width, height, speed, score);
    this.x = x;
    this.y = y;
  }
  move (ball) {
    if (ball.y > this.y) {
      this.y += this.speed;
    } else if (ball.y < this.y) {
      this.y -= this.speed;
    }
  }
}
class Ball {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 5;
    this.height = 5;
    this.vx = Math.floor(Math.random() * 4 - 4);
    this.vy = 2 - Math.abs(this.vx);
  }
  render (ctx) {
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = "white";
    ctx.fill();
  }
  move () {
    this.x += this.vx;
    this.y += this.vy;
  }
  update () {
    this.move();
    if (this.vx > 0) {
      if (game.player.x <= this.x + this.width && game.player.x > this.x - this.vx + this.width) {
        let collisionDiff = this.x + this.width - game.player.x;
        let k = collisionDiff / this.vx;
        let y = this.vy * k + (this.y - this.vy);
        if (y >= game.player.y && y + this.height <= game.player.y + game.player.height) {
          // collides with right Paddle
          this.x = game.player.x - game.player.width;
          this.y = Math.floor(this.y - this.vy + this.vy * k);
          this.vx = -this.vx;
        }
      }
    } else {
      if (game.computer.x + game.computer.width >= this.x) {
        let collisionDiff = game.computer.x + game.computer.width - this.x;
        let k = collisionDiff / -this.vx;
        let y = this.vy * k + (this.y - this.vy);
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
    if (this.x >= game.canvas.width || isNaN(this.x)) {
      game.score(game.computer);
    } else if (this.x + this.width <= 0) {
      game.score(game.player);
    }
  }
}

class Game {
  constructor () {
    this.canvas = document.getElementById('myCanvas');
    this.ctx = this.canvas.getContext('2d');

    this.player = new Player(285, 10);
    this.computer = new Computer(10, 100);
    this.ball = new Ball(this.canvas.width/2, this.canvas.height/2);
    this.display1 = new Display(this.canvas.width/4, 10, 0);
    this.display2 = new Display(this.canvas.width*3/4, 10, 0);
    this.displayMessage = new Display(this.canvas.width/2, this.canvas.height/2, '');
  }
  render () {
    this.setupCanvas();
    this.player.render(this.ctx);
    this.computer.render(this.ctx);
    this.ball.render(this.ctx);
  }
  update () {
      this.display1.value = this.computer.score;
      this.display2.value = this.player.score;
  }
  setupCanvas () {
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
    this.displayMessage.render(this.ctx);
  }
  score (paddle) {
    paddle.score++;
    let player = paddle == this.computer ? 0 : 1;

    this.ball.x = this.canvas.width/2;
    this.ball.y = paddle.y + paddle.height/2;

    this.vx = Math.floor(Math.random() * 4 - 4);
    this.vy = 2 - Math.abs(this.ball.vx);
    if (player == 1)
      this.ball.vx *= -1;
  }
  endGame () {
    if (this.player.score === 11) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.displayMessage.value = 'Game Over. You win!';
      this.setupCanvas();
      this.pause = true;
    }
    if (this.computer.score === 2) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.displayMessage.value = 'Game Over. You lose!';
      this.setupCanvas();
      this.pause = true;
    }
  }
}

// Initialize our game.
let game = new Game();

let upPressed = false;
let downPressed = false;
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

// Define our animation frames
let animate =
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequesetAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(step) {
          window.setTimeout(step, 1000/60);
        };
function step() {
  if (game.pause) {
    return;
  }
  game.render();
  game.ball.update();
  game.computer.move(game.ball);
  game.update();
  game.endGame();
  animate(step);
}

function MainFunction() {
  animate(step);
}

// Begin the game execution
window.onload = function() {
  MainFunction();
};
