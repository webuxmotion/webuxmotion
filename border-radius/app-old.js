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
  x: 323,
  y: 75,
  title: "A",
};

const B = {
  x: 83,
  y: 328,
  title: "B",
};

const C = {
  x: 452,
  y: 403,
  title: "C",
};

const points = [A, B, C];
const pointRadius = 8;
let draggedPoint = null;
let borderRadius = 40;

let F, P, G = {};
let arcPoints = [];

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

function doMath() {
  const angleABH = Math.atan2(A.y - B.y, A.x - B.x);
  const angleHBC = Math.atan2(C.y - B.y, C.x - B.x);
  let diff = angleABH - angleHBC;

  if (diff < 0) diff += Math.PI * 2;

  if (diff > Math.PI) {
    diff = Math.PI * 2 - diff;
  }

  const halfAngle = diff / 2;

  let sumAngles = angleABH + angleHBC;
  if (Math.abs(angleABH - angleHBC) > Math.PI) {
    sumAngles += Math.PI * 2;
  }
  const angleMBH = sumAngles / 2;

  const BP = borderRadius / Math.sin(halfAngle);
  const BF = Math.cos(halfAngle) * BP;

  F = {
    x: B.x + Math.cos(angleABH) * BF,
    y: B.y + Math.sin(angleABH) * BF,
    title: "F",
  };

  P = {
    x: B.x + Math.cos(angleMBH) * BP,
    y: B.y + Math.sin(angleMBH) * BP,
    title: "P",
  };

  G = {
    x: B.x + Math.cos(angleHBC) * BF,
    y: B.y + Math.sin(angleHBC) * BF,
    title: "G",
  };

  const anglePG = Math.atan2(G.y - P.y, G.x - P.x);
  const anglePF = Math.atan2(F.y - P.y, F.x - P.x);

  let arcDiff = anglePF - anglePG;
  if (arcDiff < -Math.PI) arcDiff += Math.PI * 2;
  if (arcDiff > Math.PI) arcDiff -= Math.PI * 2;
  const anticlockwise = arcDiff < 0;
  ctx.beginPath();
  ctx.arc(P.x, P.y, borderRadius, anglePG, anglePF, anticlockwise);
  ctx.stroke();

  // find arc points
  const segmentsCount = 10;
  const stepAngle = arcDiff / segmentsCount;
  arcPoints = [];
  for (let i = 0; i <= segmentsCount; i++) {
    const x = Math.cos(stepAngle * i + anglePG) * borderRadius + P.x;
    const y = Math.sin(stepAngle * i + anglePG) * borderRadius + P.y;

    arcPoints.push({ x, y });
    drawPoint({ x, y }, 4);
  }
}

function drawMainLine() {
  ctx.save();
  ctx.beginPath();
  ctx.strokeStyle = "red";
  ctx.lineWidth = 3;
  ctx.moveTo(C.x, C.y);
  arcPoints.forEach(point => {
    ctx.lineTo(point.x, point.y);
  });
  ctx.lineTo(A.x, A.y);
  ctx.stroke();
  ctx.restore();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  doMath();

  points.forEach((point) => {
    drawPoint(point, pointRadius);
    showPointTitle(point);
  });

  drawLines(points);

  drawPoint(F, pointRadius - pointRadius / 2);
  drawPoint(P, pointRadius - pointRadius / 2);
  drawPoint(G, pointRadius - pointRadius / 2);

  ctx.setLineDash([2, 6]);
  ctx.beginPath();
  ctx.arc(P.x, P.y, borderRadius, 0, Math.PI * 2, 1);
  ctx.stroke();
  ctx.setLineDash([]);

  drawMainLine();

  requestAnimationFrame(draw);
}

requestAnimationFrame(draw);
