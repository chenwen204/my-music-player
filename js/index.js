const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let WIDTH, HEIGHT;

let stars = [];
let dots = [];
const initStarsPopulation = 80;
const dotsMinDist = 2;
const maxDistFromCursor = 50;

let mouseMoving = false;
let mouseX, mouseY, mouseMoveChecker;

setCanvasSize();
init();

function setCanvasSize() {
  WIDTH = document.documentElement.clientWidth;
  HEIGHT = document.documentElement.clientHeight;
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
}

function Star(id, x, y) {
  this.id = id;
  this.x = x;
  this.y = y;
  this.r = Math.floor(Math.random() * 2) + 1;
  let alpha = (Math.floor(Math.random() * 10) + 1) / 10 / 2;
  this.color = `rgba(255,255,255,${alpha})`;
}

Star.prototype.draw = function () {
  ctx.fillStyle = this.color;
  ctx.shadowBlur = this.r * 2;
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
  ctx.closePath();
  ctx.fill();
};

Star.prototype.move = function () {
  this.y -= 0.15;
  if (this.y <= -10) this.y = HEIGHT + 10;
  this.draw();
};

function Dot(id, x, y) {
  this.id = id;
  this.x = x;
  this.y = y;
  this.r = Math.floor(Math.random() * 5) + 1;
  this.maxLinks = 2;
  this.speed = 0.5;
  this.a = 0.5;
  this.aReduction = 0.005;
  this.color = `rgba(255,255,255,${this.a})`;
  this.linkColor = `rgba(255,255,255,${this.a / 4})`;
  this.dir = Math.floor(Math.random() * 140) + 200;
}

Dot.prototype.draw = function () {
  ctx.fillStyle = this.color;
  ctx.shadowBlur = this.r * 2;
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
  ctx.closePath();
  ctx.fill();
};

Dot.prototype.link = function () {
  if (this.id === 0) return;
  const previousDot1 = getPreviousDot(this.id, 1);
  const previousDot2 = getPreviousDot(this.id, 2);
  const previousDot3 = getPreviousDot(this.id, 3);
  if (!previousDot1) return;

  ctx.strokeStyle = this.linkColor;
  ctx.beginPath();
  ctx.moveTo(previousDot1.x, previousDot1.y);
  ctx.lineTo(this.x, this.y);

  if (previousDot2) ctx.lineTo(previousDot2.x, previousDot2.y);
  if (previousDot3) ctx.lineTo(previousDot3.x, previousDot3.y);

  ctx.stroke();
  ctx.closePath();
};

Dot.prototype.move = function () {
  this.a -= this.aReduction;
  if (this.a <= 0) {
    this.die();
    return;
  }
  this.color = `rgba(255,255,255,${this.a})`;
  this.linkColor = `rgba(255,255,255,${this.a / 4})`;
  this.x += Math.cos(degToRad(this.dir)) * this.speed;
  this.y += Math.sin(degToRad(this.dir)) * this.speed;
  this.draw();
  this.link();
};

Dot.prototype.die = function () {
  dots[this.id] = null;
  delete dots[this.id];
};

function getPreviousDot(id, stepback) {
  if (id === 0 || id - stepback < 0) return false;
  return dots[id - stepback];
}

function degToRad(deg) {
  return deg * (Math.PI / 180);
}

function init() {
  for (let i = 0; i < initStarsPopulation; i++) {
    stars[i] = new Star(i, Math.floor(Math.random() * WIDTH), Math.floor(Math.random() * HEIGHT));
  }
  animate();
}

function animate() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  stars.forEach((star) => {
    if (star && typeof star.move === 'function') {
      star.move();
    }
  });

  dots.forEach((dot) => {
    if (dot && typeof dot.move === 'function') {
      dot.move();
    }
  });

  drawIfMouseMoving();
  requestAnimationFrame(animate);
}

window.onmousemove = function (e) {
  mouseMoving = true;
  mouseX = e.clientX;
  mouseY = e.clientY;

  clearTimeout(mouseMoveChecker);
  mouseMoveChecker = setTimeout(() => {
    mouseMoving = false;
  }, 100);
};

function drawIfMouseMoving() {
  if (!mouseMoving) return;

  if (dots.length === 0) {
    dots[0] = new Dot(0, mouseX, mouseY);
    dots[0].draw();
    return;
  }

  const previousDot = getPreviousDot(dots.length, 1);
  if (!previousDot) return;

  const diffX = Math.abs(previousDot.x - mouseX);
  const diffY = Math.abs(previousDot.y - mouseY);

  if (diffX < dotsMinDist || diffY < dotsMinDist) return;

  const xVariation = (Math.random() > 0.5 ? -1 : 1) * (Math.floor(Math.random() * maxDistFromCursor) + 1);
  const yVariation = (Math.random() > 0.5 ? -1 : 1) * (Math.floor(Math.random() * maxDistFromCursor) + 1);

  dots[dots.length] = new Dot(dots.length, mouseX + xVariation, mouseY + yVariation);
  dots[dots.length - 1].draw();
  dots[dots.length - 1].link();
}
