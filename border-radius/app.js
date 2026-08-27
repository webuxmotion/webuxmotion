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

let F,
  P,
  G = {};
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
  // 1. Створюємо вектори напрямку BA та BC
  const vAx = A.x - B.x;
  const vAy = A.y - B.y;
  const vCx = C.x - B.x;
  const vCy = C.y - B.y;

  // 2. Рахуємо довжини цих векторів
  const lenA = Math.hypot(vAx, vAy);
  const lenC = Math.hypot(vCx, vCy);

  if (lenA === 0 || lenC === 0) return; // Захист від ділення на нуль

  // 3. Нормалізуємо вектори (робимо їх довжину рівною 1)
  const nAx = vAx / lenA;
  const nAy = vAy / lenA;
  const nCx = vCx / lenC;
  const nCy = vCy / lenC;

  // 4. Знаходимо вектор бісектриси (просто додаємо два одиничні вектори!)
  // Він ЗАВЖДИ дивиться всередину кута, куди б не крутилися точки
  let bisX = nAx + nCx;
  let bisY = nAy + nCy;
  let lenBis = Math.hypot(bisX, bisY);

  // Колінеарний випадок (якщо кут рівно 180 градусів, вектори взаємознищуються)
  if (lenBis === 0) {
    bisX = -nAy;
    bisY = nAx;
    lenBis = 1;
  }

  // Нормалізований напрямок бісектриси
  const nBisX = bisX / lenBis;
  const nBisY = bisY / lenBis;

  // 5. Рахуємо косинус і синус внутрішнього кута через скалярний і векторний добуток
  const dot = nAx * nCx + nAy * nCy; // Скалярний добуток (cos)
  const cross = nAx * nCy - nAy * nCx; // Векторний добуток (sin)

  const halfAngleCos = Math.sqrt((1 + dot) / 2); // Тригонометрична тотожність для половинного кута
  const halfAngleSin = Math.sqrt((1 - dot) / 2);
  const halfAngleTan = halfAngleSin / halfAngleCos;

  // 6. Знаходимо геометричні відстані від вершини B
  const BF = borderRadius / halfAngleTan; // Відстань до точок дотику F та G
  const BP = borderRadius / halfAngleSin; // Відстань до центру кола P

  // 7. Отримуємо координати точок F, G та P (Просте множення вектора на відстань)
  F = { x: B.x + nAx * BF, y: B.y + nAy * BF, title: "F" };
  G = { x: B.x + nCx * BF, y: B.y + nCy * BF, title: "G" };
  P = { x: B.x + nBisX * BP, y: B.y + nBisY * BP, title: "P" };

  // --- Малювання дуги та пошук точок ---
  // Для генерації точок по дузі один розрахунок кутів все ж знадобиться,
  // але тепер він чистий і стосується ТІЛЬКИ кола навколо P.
  const anglePG = Math.atan2(G.y - P.y, G.x - P.x);
  const anglePF = Math.atan2(F.y - P.y, F.x - P.x);

  let arcDiff = anglePF - anglePG;
  if (arcDiff < -Math.PI) arcDiff += Math.PI * 2;
  if (arcDiff > Math.PI) arcDiff -= Math.PI * 2;

  ctx.beginPath();
  ctx.arc(P.x, P.y, borderRadius, anglePG, anglePF, arcDiff < 0);
  ctx.stroke();

  // find arc points
  const segmentsCount = 10;
  const stepAngle = arcDiff / segmentsCount;
  arcPoints = [];

  for (let i = 0; i <= segmentsCount; i++) {
    const currentAngle = anglePG + stepAngle * i;
    const x = P.x + Math.cos(currentAngle) * borderRadius;
    const y = P.y + Math.sin(currentAngle) * borderRadius;

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
  arcPoints.forEach((point) => {
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
