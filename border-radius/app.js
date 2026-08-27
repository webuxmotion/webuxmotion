const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

ctx.beginPath();
ctx.fillRect(10, 10, 20, 20);

const mouse = {
  x: 0,
  y: 0,
  event: null,
};

const A = {
  x: getRandomCoord(),
  y: getRandomCoord(),
  title: "A"
};

const B = {
  x: getRandomCoord(),
  y: getRandomCoord(),
  title: "B"
};

const C = {
  x: getRandomCoord(),
  y: getRandomCoord(),
  title: "C"
};

const points = [A, B, C];
const pointRadius = 8;
let draggedPoint = null;

canvas.addEventListener("mousedown", (event) => {
  points.forEach((point, index) => {
    const dist = Math.hypot(point.x - mouse.x, point.y - mouse.y);
    if (dist < pointRadius) {
      draggedPoint = point;
    }
  });
});

canvas.addEventListener("mouseup", (event) => {
  draggedPoint = null;
});

canvas.addEventListener("mousemove", (event) => {
  const rect = canvas.getBoundingClientRect();
  mouse.x = event.clientX - rect.left;
  mouse.y = event.clientY - rect.top;
  mouse.event = event;

  if (draggedPoint) {
    draggedPoint.x = mouse.x;
    draggedPoint.y = mouse.y;
  }
});

function drawPoint(point, radius) {
  ctx.beginPath();
  ctx.arc(point.x, point.y, radius, 0, Math.PI * 2, 1);
  ctx.fill();
}

function showPointTitle(point) {
  ctx.font = "30px sans-serif";
  ctx.fillText(point.title, point.x - 20, point.y - 10);
}

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * max + min);
}

function getRandomCoord() {
  return getRandomNumber((canvas.width - 400) / 2, 400);
}

function drawLines(points) {
  ctx.beginPath();

  points.forEach((point, index) => {
    if (index == 0) {
      ctx.moveTo(point.x, point.y);
    } else {
      ctx.lineTo(point.x, point.y);
    }
  });

  ctx.stroke();
}

function calculateAngle() {
  const angleABH = Math.atan2(A.y - B.y, A.x - B.x);
  const angleHBC = Math.atan2(C.y - B.y, C.x - B.x);
  let diff = angleABH - angleHBC;

  if (diff < 0) diff += Math.PI * 2;

  if (diff > Math.PI) {
    diff = Math.PI * 2 - diff;
  }

  console.log(180 / Math.PI * diff);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  points.forEach((point) => {
    drawPoint(point, pointRadius);
    showPointTitle(point);
  });

  drawLines(points);
  calculateAngle();
 
  requestAnimationFrame(draw);
}

requestAnimationFrame(draw);
