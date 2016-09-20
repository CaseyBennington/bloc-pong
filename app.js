/**
* @class Display
* @desc Defines a Display object
* @method constructor
* @method render
*/
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

/**
* @class Paddle
* @desc Defines a Paddle object
* @method constructor
* @method rendor
*/
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

/**
* @class Display
* @desc Defines a Player object
* @extends Paddle object
* @method constructor
* @method keyboardMove
*/
class Player extends Paddle {
  constructor (x, y, width, height, speed, score) {
    super(width, height, speed, score);
    this.x = x;
    this.y = y;
    this.keyboard = true;
  }
  keyboardMove () {
    if (this.keyboard === true) {
      this.oldY = this.y;
      if (upPressed && this.y > 0) {
        this.y -= this.speed;
      } else if (downPressed && this.y < game.ctx.canvas.height-this.height) {
        this.y += this.speed;
      }
    }
  }
  mouseMove (up) {
    if (this.keyboard === false) {
      this.oldY = this.y;
      if (up === 1 && this.y > 0) {
        this.y -= this.speed;
      } else if (up === 2 && this.y < game.ctx.canvas.height-this.height) {
        this.y += this.speed;
      }
    }
  }
}

/**
* @class Display
* @desc Defines a Computer object
* @extends Paddle object
* @method constructor
* @method move
*/
class Computer extends Paddle {
  constructor (x, y, width, height, speed, score) {
    super(width, height, speed, score);
    this.x = x;
    this.y = y;
  }
  move (ball) {
    this.oldY = this.y;
    let diff = -((this.y + (this.height / 2 )) - ball.y);
    if ((diff < 0 && diff < -this.speed) && this.y > 0) { // ball higher than paddle
      this.y += diff;
    } else if ((diff > 0 && diff > this.speed) && this.y < game.ctx.canvas.height-this.height) { // ball lower than paddle
      this.y += diff;
    }
    if (this.y < 0) {
      this.y = 0;
    } else if (this.y + this.height > game.canvas.height) {
      this.y = game.canvas.height - this.height;
    }


    // if (ball.y > this.y) {
    //   this.y += 1;
    // } else if (ball.y < this.y) {
    //   this.y -= 1;
    // }
  }
}

/**
* @class Display
* @desc Defines a Ball object
* @method constructor
* @method ballSpeed
* @method render
* @method update
*/
class Ball {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 20;
    this.height = 20;
    this.vx = randomVelocity();
    this.vy = 12 - Math.abs(this.vx);
  }
  ballSpeed () {
    this.vx = randomVelocity();
    this.vy = 12 - Math.abs(this.vx);
  }
  render (ctx) {
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = "white";
    ctx.fill();
  }
  update () {
    this.x += this.vx;
    this.y += this.vy;
    let left_x = this.x;
    let left_y = this.y;
    let right_x = this.x + this.width;
    let right_y = this.y;
    let bottom_x = this.x;
    let bottom_y = this.y + this.height;

    // if (left_x > game.canvas.width/2) { // check if on the player's side
    //   if (right_x <= game.player.x && right_x <= game.player.x && right_y < game.player.y && right_y > game.player.y + game.player.height) {
    //     // hit the player's Paddle
    //
    //     // Add speed to top and bottom fifths, wnd top and bottom fifths, and reduce speed of middle fifth of the paddle
    //     if (((game.player.y + (game.player.height / 5)) >= this.y) || (game.player.y + (game.player.height - (game.player.height / 5)) <= this.y)) { // top fifth or bottom fifth
    //       this.vx = this.vx * 1.3; // limit to 20
    //       if (this.vx >= 20) {
    //         this.vx = 20;
    //       }
    //     } else if (((game.player.y + (game.player.height / 5) * 2) >= this.y) || (game.player.y + (game.player.height - (game.player.height / 5) * 2) <= this.y)) { // 2nd top fifth or 2nd bottom fifth
    //       this.vx = this.vx * 1.1; // limit to 20
    //       if (this.vx >= 20) {
    //         this.vx = 20;
    //       }
    //     } else { // middle fifth
    //       this.vx = this.vx * 0.8; // limit to 10
    //       if (this.vx <= 10) {
    //         this.vx = 10;
    //       }
    //     }
    //
    //     // add/remove spin based on paddle direction (FUTURE CONCEPT)
    //     // if (game.player.oldY > game.player.y || game.computer.oldY > game.computer.y) {
    //     //   this.vx = this.vx * (this.vx < 0 ? 0.5 : 1.5);
    //     // } else if (game.player.oldY > game.player.y || game.computer.oldY > game.computer.y) {
    //     //   this.vx = this.vx * (this.vx > 0 ? 0.5 : 1.5);
    //     // }
    //     this.vx = -this.vx;
    //   }
    // } else { // else its on the computer's side
    //   if (left_x <= (game.computer.x + game.computer.width) || right_x <= game.computer.x + game.computer.width && left_y <= (game.computer.y + game.computer.height) && right_y >= game.computer.y) {
    //     // hit the computer's Paddle
    //
    //     // Add speed to top and bottom fifths, wnd top and bottom fifths, and reduce speed of middle fifth of the paddle
    //     if (((game.computer.y + (game.computer.height / 5)) >= this.y) || (game.computer.y + (game.computer.height - (game.computer.height / 5)) <= this.y)) { // top fifth or bottom fifth
    //       this.vx = this.vx * 1.3; // limit to 20
    //       if (this.vx >= 20) {
    //         this.vx = 20;
    //       }
    //     } else if (((game.computer.y + (game.computer.height / 5) * 2) >= this.y) || (game.computer.y + (game.computer.height - (game.computer.height / 5) * 2) <= this.y)) { // 2nd top fifth or 2nd bottom fifth
    //       this.vx = this.vx * 1.1; // limit to 20
    //       if (this.vx >= 20) {
    //         this.vx = 20;
    //       }
    //     } else { // middle fifth
    //       this.vx = this.vx * 0.8; // limit to 10
    //       if (this.vx <= 10) {
    //         this.vx = 10;
    //       }
    //     }
    //
    //     // add/remove spin based on paddle direction (FUTURE CONCEPT)
    //     // if (game.player.oldY > game.player.y || game.computer.oldY > game.computer.y) {
    //     //   this.vy = this.vy * (this.vy < 0 ? 0.5 : 1.5);
    //     // } else if (game.player.oldY > game.player.y || game.computer.oldY > game.computer.y) {
    //     //   this.vy = this.vy * (this.vy > 0 ? 0.5 : 1.5);
    //     // }
    //     this.vx = -this.vx;
    //   }
    // }

    // (FUTURE CONCEPT) To add functionality to predict where the ball will hit the paddle for excessive speed balls that would "skip" collision
    if (this.vx > 0) {
      if (game.player.x <= this.x + this.width && game.player.x > this.x - this.vx + this.width) {
        let collisionDiff = this.x + this.width - game.player.x;
        let k = collisionDiff / this.vx;
        let y = this.vy * k + (this.y - this.vy);
        console.log(y >= game.player.y && y + this.height <= game.player.y + game.player.height);
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

    // Check for Top and bottom collision
    if ((this.vy < 0 && this.y < 0) || (this.vy > 0 && this.y + this.height > game.canvas.height)) {
      this.vy = -this.vy;
    }

    // Determine scoring play
    if (this.x >= game.canvas.width || isNaN(this.x)) {
      game.score(game.computer);
    } else if (this.x <= 0 || isNaN(this.x)) {
      game.score(game.player);
    }
  }
}

/**
* @class Display
* @desc Defines a Game object
* @method constructor
* @method render
* @method update
* @method setupCanvas
* @method score
* @method startMenu
* @method computerMenu
* @method endMenu
*/
class Game {
  constructor () {
    this.canvas = document.getElementById('myCanvas');
    this.ctx = this.canvas.getContext('2d');

    this.player = new Player(this.canvas.width - 20 - 15, this.canvas.height/2);
    this.computer = new Computer(15, this.canvas.height/2);
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

    this.ball.ballSpeed();
    if (player == 1)
      this.ball.vx *= -1;
  }
  startMenu () {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.displayMessage = new Display(this.canvas.width/2 - (this.ctx.measureText(this.displayMessage).width), this.canvas.height/2 - 140, 'Welcome to Pong!');
    this.displayInputChoice = new Display(this.canvas.width/2 - (this.ctx.measureText(this.displayInputChoice).width), this.canvas.height/2 - 40, 'Choose your control type:');
    this.displayInputChoice1 = new Display(this.canvas.width/2 - (this.ctx.measureText(this.displayInputChoice1).width), this.canvas.height/2 + 40, '* Mouse');
    this.displayInputChoice2 = new Display(this.canvas.width/2 - (this.ctx.measureText(this.displayInputChoice2).width), this.canvas.height/2 + 80, '* Keyboard');

    this.setupCanvas();
    this.displayMessage.render(this.ctx);
    this.displayInputChoice.render(this.ctx);
    this.displayInputChoice1.render(this.ctx);
    this.displayInputChoice2.render(this.ctx);
    this.ctx.beginPath();
    this.ctx.rect(game.displayInputChoice1.x, game.displayInputChoice1.y, game.ctx.measureText(game.displayInputChoice1.value).width, 40);
    this.ctx.fillStyle = "white";
    this.ctx.fill();

    this.pause = true;
  }
  computerMenu () {
    this.displayInputChoice = null;
    this.displayInputChoice1 = null;
    this.displayInputChoice2 = null;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.displayInputChoiceTitle = new Display(this.canvas.width/2 - (this.ctx.measureText(this.displayInputChoiceTitle).width), this.canvas.height/2 - 40, 'Choose your difficulty:');
    this.displayInputChoiceA = new Display(this.canvas.width/2 - (this.ctx.measureText(this.displayInputChoiceA).width), this.canvas.height/2 + 40, '* Beginner');
    this.displayInputChoiceB = new Display(this.canvas.width/2 - (this.ctx.measureText(this.displayInputChoiceB).width), this.canvas.height/2 + 80, '* Intermediate');
    this.displayInputChoiceC = new Display(this.canvas.width/2 - (this.ctx.measureText(this.displayInputChoiceC).width), this.canvas.height/2 + 120, '* Expert');

    this.setupCanvas();
    this.displayMessage.render(this.ctx);
    this.displayInputChoiceTitle.render(this.ctx);
    this.displayInputChoiceA.render(this.ctx);
    this.displayInputChoiceB.render(this.ctx);
    this.displayInputChoiceC.render(this.ctx);
  }
  endMenu () {
    if (this.player.score === 11 || this.computer.score === 11) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.displayEndMessage = new Display(this.canvas.width/2-(this.ctx.measureText(this.displayEndMessage).width), this.canvas.height/2, '');
      this.displayRestartGame = new Display(this.canvas.width/2-(this.ctx.measureText(this.displayRestartGame).width), this.canvas.height/2 + 40, 'Click to play again.');

      if (this.player.score === 11) {
        this.displayEndMessage.value = 'Game Over. You win!';
      }
      if (this.computer.score === 11) {
        this.displayEndMessage.value = 'Game Over. You lose!';
      }

      this.setupCanvas();
      this.pause = true;

      this.displayEndMessage.render(this.ctx);
      this.displayRestartGame.render(this.ctx);
      document.addEventListener("click", handleEndMenu, false);
    }
  }
}

/**
 * @desc upPressed variable used to determine if keyboard 'up' was pressed
 * @type {Boolean}
 */
let upPressed = false;
/**
* @desc downPressed variable used to determine if keyboard 'down' was pressed
* @type {Boolean}
**/
let downPressed = false;
/**
 * @desc oldMouseY variable to represent the old 'y' coordinate of the mouse
 * @type {Number}
 */
let oldMouseY = 0;
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

/**
 * @function handleStartMenu
 * @desc function that controls the opening menu to the game and choosing the control input type
 * @param  {object} e
 */
function handleStartMenu(e) {
  // get mouse position relative to the canvas
  let x = parseInt(e.clientX - game.canvas.offsetLeft);
  let y = parseInt(e.clientY - game.canvas.offsetTop);
console.log('x = ' + x);
console.log('y = ' + y);

  // check displayInputChoice1 for hits
  if (x >= game.displayInputChoice1.x && x <= game.displayInputChoice1.x + game.ctx.measureText(game.displayInputChoice1.value).width && y >= game.displayInputChoice1.y && y <= game.displayInputChoice1.y + 40) {
    // add in mouse behavior
    document.addEventListener('mousemove', mouseMoveHandler, false);
    game.player.speed = 10;
    game.player.keyboard = false;
  }
  // check displayInputChoice2 for hits
  if (x >= game.displayInputChoice2.x && x <= game.displayInputChoice2.x + game.ctx.measureText(game.displayInputChoice2.value).width && y >= game.displayInputChoice2.y && y <= game.displayInputChoice2.y + 40) {
    // delete this after everything works
  }
  document.removeEventListener("click", handleStartMenu, false);
  document.addEventListener("click", handleComputerMenu, false);
  game.computerMenu();
}
/**
 * @function handleComputerMenu
 * @desc function that controls the 2nd menu to the game for choosing the comuter skill
 * @param  {object} e
 */
function handleComputerMenu(e) {
  // get mouse position relative to the canvas
  let x = parseInt(e.clientX - game.canvas.offsetLeft);
  let y = parseInt(e.clientY - game.canvas.offsetTop);

  // check displayInputChoice1 for hits
  if (x >= game.displayInputChoiceA.x && x <= game.displayInputChoiceA.x + game.ctx.measureText(game.displayInputChoiceA.value).width && y >= game.displayInputChoiceA.y && y <= game.displayInputChoiceA.y + 40) {
    game.computer.speed = 2;
  }
  // check displayInputChoice2 for hits
  if (x >= game.displayInputChoiceB.x && x <= game.displayInputChoiceB.x + game.ctx.measureText(game.displayInputChoiceB.value).width && y >= game.displayInputChoiceB.y && y <= game.displayInputChoiceB.y + 40) {
    game.computer.speed = 4;
  }
  // check displayInputChoice3 for hits
  if (x >= game.displayInputChoiceC.x && x <= game.displayInputChoiceC.x + game.ctx.measureText(game.displayInputChoiceC.value).width && y >= game.displayInputChoiceC.y && y <= game.displayInputChoiceC.y + 40) {
    game.computer.speed = 8;
  }
  document.removeEventListener("click", handleComputerMenu, false);
  game.pause = false;
  animate(step);
}
/**
 * @function handleEndMenu
 * @desc function that controls the ending menu to the game and whether to let the player restart the game
 * @param  {object} e
 */
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
/**
 * @function keyDownHandler
 * @desc function that determines whether the corrct keyboard keys were pressed down
 * @param  {object} e
 */
function keyDownHandler(e) {
  if (e.keyCode == 38) {
    upPressed = true;
    game.player.keyboardMove();
  } else if (e.keyCode == 40) {
    downPressed = true;
    game.player.keyboardMove();
  }
}
/**
 * @function keyUpHandler
 * @desc function that determines whether the correct keyboad keys were depressed
 * @param  {object} e
 */
function keyUpHandler(e) {
  if (e.keyCode == 38) {
    upPressed = false;
  } else if (e.keyCode == 40) {
    downPressed = false;
  }
}
/**
 * @function mouseMoveHandler
 * @desc function that determines whether the mouse moved up or down
 * @param  {object} e
 */
function mouseMoveHandler(e) {
  if (oldMouseY > e.pageY) {
    game.player.mouseMove(1);

  } else if (oldMouseY < e.pageY) {
    game.player.mouseMove(2);
  }
  oldMouseY = e.pageY;
}
/**
 * @function randomVelocity
 * @desc function that returns a random number between 10 and 20
 * @returns {number} v
 */
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
/**
 * @function step
 * @desc function that controls the game behavior during each "animation frame"
 */
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
/**
 * @function MainFunction
 * @desc function that controls the running of the game
 */
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
