class Display {
  constructor (x, y, v) {
    this.x = x;
    this.y = y;
    this.value = v;
  }
  render (ctx) {
    ctx.font = "40px Arial";
    ctx.textBaseline = 'top';
    ctx.fillText(this.value, this.x, this.y);
  }
}

class Paddle {
  constructor (x, y) {
    this.x = x;
    this.y = y;
    this.width = 20;
    this.height = 100;
    this.speed = 40;
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
  keyboardMove () {
    if (upPressed && this.y > 0) {
      this.y -= this.speed;
    } else if (downPressed && this.y < game.ctx.canvas.height-this.height) {
      this.y += this.speed;
    }
  }
  mouseMove () {
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
    this.width = 20;
    this.height = 20;
    this.vx = randomVelocity();
    this.vy = 10 - Math.abs(this.vx);
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
    } else if (this.x + this.width <= 0 || isNaN(this.x)) {
      game.score(game.player);
    }
  }
}

class Game {
  constructor () {
    this.canvas = document.getElementById('myCanvas');
    this.ctx = this.canvas.getContext('2d');

    this.player = new Player(this.canvas.width - 20 - 15, 10);
    this.computer = new Computer(15, 100);
    this.ball = new Ball(this.canvas.width/2, this.canvas.height/2);
    this.display1 = new Display(this.canvas.width/4, 40, 0);
    this.display2 = new Display(this.canvas.width*3/4, 40, 0);
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
  }
  score (paddle) {
    paddle.score++;
    let player = paddle == this.computer ? 0 : 1;

    this.ball.x = this.canvas.width/2;
    this.ball.y = paddle.y + paddle.height/2;

    this.vx = randomVelocity();
    this.vy = 10 - Math.abs(this.vx);
    if (player == 1)
      this.ball.vx *= -1;
  }
  startMenu () {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.displayMessage = new Display(this.canvas.width/2-(this.ctx.measureText(this.displayMessage).width), this.canvas.height/2 - 140, 'Welcome to Pong!');
    this.displayInputChoice = new Display(this.canvas.width/2-(this.ctx.measureText(this.displayInputChoice).width), this.canvas.height/2 - 40, 'Choose your control type:');
    this.displayInputChoice1 = new Display(this.canvas.width/2-(this.ctx.measureText(this.displayInputChoice1).width), this.canvas.height/2 + 40, '* Mouse');
    this.displayInputChoice2 = new Display(this.canvas.width/2-(this.ctx.measureText(this.displayInputChoice2).width), this.canvas.height/2 + 80, '* Keyboard');

    this.setupCanvas();
    this.displayMessage.render(this.ctx);
    this.displayInputChoice.render(this.ctx);
    this.displayInputChoice1.render(this.ctx);
    this.displayInputChoice2.render(this.ctx);

    this.pause = true;
  }
  computerMenu () {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.displayMessage = new Display(this.canvas.width/2-(this.ctx.measureText(this.displayMessage).width), this.canvas.height/2 - 140, '');
    this.displayInputChoice = new Display(this.canvas.width/2-(this.ctx.measureText(this.displayInputChoice).width), this.canvas.height/2 - 40, 'Choose your difficulty level:');
    this.displayInputChoice1 = new Display(this.canvas.width/2-(this.ctx.measureText(this.displayInputChoice1).width), this.canvas.height/2 + 40, '* Beginner');
    this.displayInputChoice2 = new Display(this.canvas.width/2-(this.ctx.measureText(this.displayInputChoice2).width), this.canvas.height/2 + 80, '* Intermediate');
    this.displayInputChoice3 = new Display(this.canvas.width/2-(this.ctx.measureText(this.displayInputChoice3).width), this.canvas.height/2 + 120, '* Expert');

    this.setupCanvas();
    this.displayMessage.render(this.ctx);
    this.displayInputChoice.render(this.ctx);
    this.displayInputChoice1.render(this.ctx);
    this.displayInputChoice2.render(this.ctx);
    this.displayInputChoice3.render(this.ctx);

    this.pause = true;
  }
  endMenu () {
    if (this.player.score === 11 || this.computer.score === 2) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.displayMessage = new Display(this.canvas.width/2-(this.ctx.measureText(this.displayMessage).width), this.canvas.height/2, '');
      this.displayRestartGame = new Display(this.canvas.width/2-(this.ctx.measureText(this.displayRestartGame).width), this.canvas.height/2 + 40, 'Click to play again.');

      if (this.player.score === 11) {
        this.displayMessage.value = 'Game Over. You win!';
      }
      if (this.computer.score === 2) {
        this.displayMessage.value = 'Game Over. You lose!';
      }

      this.setupCanvas();
      this.pause = true;

      this.displayMessage.render(this.ctx);
      this.displayRestartGame.render(this.ctx);
      document.addEventListener("click", handleEndMenu, false);
    }
  }
}

let upPressed = false;
let downPressed = false;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function handleStartMenu(e) {
  // get mouse position relative to the canvas
  let x = parseInt(e.clientX - game.canvas.offsetLeft);
  let y = parseInt(e.clientY - game.canvas.offsetTop);

  // check displayInputChoice1 for hits
  if (x >= game.displayInputChoice1.x && x <= game.displayInputChoice1.x + game.ctx.measureText(game.displayInputChoice1.value).width && y >= game.displayInputChoice1.y && y <= game.displayInputChoice1.y + 40) {
    // add in mouse behavior
  }
  // check displayInputChoice2 for hits
  if (x >= game.displayInputChoice2.x && x <= game.displayInputChoice2.x + game.ctx.measureText(game.displayInputChoice2.value).width && y >= game.displayInputChoice2.y && y <= game.displayInputChoice2.y + 40) {
    // delete this after everything works
  }
  document.removeEventListener("click", handleStartMenu, false);
  document.addEventListener("click", handleComputerMenu, false);
  game.computerMenu();
}
function handleComputerMenu(e) {
  // get mouse position relative to the canvas
  let x = parseInt(e.clientX - game.canvas.offsetLeft);
  let y = parseInt(e.clientY - game.canvas.offsetTop);

  // check displayInputChoice1 for hits
  if (x >= game.displayInputChoice1.x && x <= game.displayInputChoice1.x + game.ctx.measureText(game.displayInputChoice1.value).width && y >= game.displayInputChoice1.y && y <= game.displayInputChoice1.y + 40) {
    game.computer.speed = 10;
  }
  // check displayInputChoice2 for hits
  if (x >= game.displayInputChoice2.x && x <= game.displayInputChoice2.x + game.ctx.measureText(game.displayInputChoice2.value).width && y >= game.displayInputChoice2.y && y <= game.displayInputChoice2.y + 40) {
    game.computer.speed = 25;
  }
  // check displayInputChoice3 for hits
  if (x >= game.displayInputChoice3.x && x <= game.displayInputChoice3.x + game.ctx.measureText(game.displayInputChoice3.value).width && y >= game.displayInputChoice3.y && y <= game.displayInputChoice3.y + 40) {
    game.computer.speed = 40;
  }
  document.removeEventListener("click", handleComputerMenu, false);
  game.pause = false;
  animate(step);
}
function handleEndMenu(e) {
  // get mouse position relative to the canvas
  let x = parseInt(e.clientX - game.canvas.offsetLeft);
  let y = parseInt(e.clientY - game.canvas.offsetTop);

  // check displayRestartGame for hits
  if (x >= game.displayRestartGame.x && x <= game.displayRestartGame.x + game.ctx.measureText(game.displayRestartGame.value).width && y >= game.displayRestartGame.y && y <= game.displayRestartGame.y + 40) {
    let game = new Game();
    document.removeEventListener("click", handleEndMenu, false);
    document.addEventListener("click", handleStartMenu, false);
    MainFunction();
  }
}

function keyDownHandler(e) {
  if (e.keyCode == 38) {
    upPressed = true;
    game.player.keyboardMove();
  } else if (e.keyCode == 40) {
    downPressed = true;
    game.player.keyboardMove();
  }
}
function keyUpHandler(e) {
  if (e.keyCode == 38) {
    upPressed = false;
  } else if (e.keyCode == 40) {
    downPressed = false;
  }
}

function randomVelocity() {
  let v = 0;
  do {
    v = Math.floor((Math.random() * 20) - 10);
  } while (v === 0);
  return v;
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
  game.endMenu();
  animate(step);
}

function MainFunction() {
  // Initialize our game.
  game = new Game();
  game.render();
  game.startMenu();
  animate(step);
}

// Begin the game execution
window.onload = function() {
  let game = new Game();
  document.addEventListener("click", handleStartMenu, false);
  MainFunction();
};
