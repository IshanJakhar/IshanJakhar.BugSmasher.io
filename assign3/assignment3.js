console.log("from script file");
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

class Bug {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.dx = Math.random() * 4 - 2;
    this.dy = Math.random() * 4 - 2;
    this.hoppingInterval = 1000;
    this.hoppingIntervalDecrement = 50;
  }
  
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }
  
  move() {
    this.x += this.dx;
    this.y += this.dy;
    if (this.x < this.radius || this.x > canvas.width - this.radius) {
      this.dx = -this.dx;
    }
    if (this.y < this.radius || this.y > canvas.height - this.radius) {
      this.dy = -this.dy;
    }
  }
  
  update() {
    this.move();
    if (this.hoppingInterval > 100) {
      this.hoppingInterval -= this.hoppingIntervalDecrement;
      document.getElementById('hoppingInterval').textContent = this.hoppingInterval;
    }
    if (this.checkCollision()) {
      this.hoppingInterval = 1000;
      document.getElementById('hoppingInterval').textContent = this.hoppingInterval;
      increaseScore();
      decreaseHoppingInterval();
      this.resetPosition();
    }
  }
  
  checkCollision() {
    const distance = Math.sqrt((this.x - mouseX) ** 2 + (this.y - mouseY) ** 2);
    return distance < this.radius;
  }
  
  resetPosition() {
    this.x = Math.random() * (canvas.width - 2 * this.radius) + this.radius;
    this.y = Math.random() * (canvas.height - 2 * this.radius) + this.radius;
    this.dx = Math.random() * 4 - 2;
    this.dy = Math.random() * 4 - 2;
  }
}

let bugs = [];
let score = 0;
let mouseX = 0;
let mouseY = 0;
let gameIsRunning = true;

function startGame() {
  for (let i = 0; i < 10; i++) {
    const bug = new Bug(
      Math.random() * (canvas.width - 50) + 25,
      Math.random() * (canvas.height - 50) + 25,
      25,
      'green'
    );
    bugs.push(bug);
  }
  canvas.addEventListener('mousedown', handleClick);
  canvas.addEventListener('mousemove', handleMouseMove);
  setInterval(update, 16);
}

function stopGame() {
  canvas.removeEventListener('mousedown', handleClick);
  canvas.removeEventListener('mousemove', handleMouseMove);
  gameIsRunning = false;
}

function resetGame() {
  stopGame();
  bugs = [];
  score = 0;
  document.getElementById('score').textContent = score;
  gameIsRunning = true;
  startGame();
}

function increaseScore() {
  score += 1;
  document.getElementById('score').textContent = score;
}

function decreaseHoppingInterval() {
  for (let bug of bugs) {
    bug.hoppingInterval -= 50;
  }
}

function handleClick(event) {
  for (let bug of bugs) {
    if (bug.checkCollision()) {
      increaseScore();
      decreaseHoppingInterval();
        bug.resetPosition();
}
}
}

function handleMouseMove(event) {
const canvasRect = canvas.getBoundingClientRect();
mouseX = event.clientX - canvasRect.left;
mouseY = event.clientY - canvasRect.top;
}

function update() {
ctx.clearRect(0, 0, canvas.width, canvas.height);
for (let bug of bugs) {
bug.update();
bug.draw();
}
if (!gameIsRunning) {
showGameOverScreen();
}
}

function showGameOverScreen() {
ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.font = '48px Arial';
ctx.fillStyle = 'white';
ctx.textAlign = 'center';
ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2 - 24);
ctx.font = '24px Arial';
ctx.fillText('Final Score: ' + score, canvas.width / 2, canvas.height / 2 + 24);
ctx.fillText('Click to play again', canvas.width / 2, canvas.height / 2 + 72);
canvas.addEventListener('mousedown', handleGameOverClick);
}

function handleGameOverClick(event) {
resetGame();
canvas.removeEventListener('mousedown', handleGameOverClick);
}

startGame();