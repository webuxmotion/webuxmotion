const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const radiusSlider = document.getElementById("radius-slider");
const radiusValue = document.getElementById("radius-value");

const points = [
  { title: "A", x: 200, y: 50 },
  { title: "B", x: 50, y: 300 },
  { title: "C", x: 400, y: 350 },
];

const pointRadius = 10; 
let draggedPoint = null;

// Головна функція малювання
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.font = "30px sans-serif";
  ctx.strokeStyle = "black";
  ctx.fillStyle = "black";
  ctx.lineWidth = 1;

  // 1. Малюємо трикутник (лінії)
  ctx.beginPath();
  points.forEach((point, index) => {
    if (index === 0) {
      ctx.moveTo(point.x, point.y);
    } else {
      ctx.lineTo(point.x, point.y);
    }
  });
  ctx.stroke();

  // 2. Малюємо точки та підписи
  points.forEach((point) => {
    ctx.beginPath();
    ctx.arc(point.x, point.y, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillText(point.title, point.x - 20, point.y - 10);
  });

  // 3. Рахуємо кути та бісектрису
  const angleAB = Math.atan2(points[0].y - points[1].y, points[0].x - points[1].x);
  const angleBC = Math.atan2(points[2].y - points[1].y, points[2].x - points[1].x);
  
  let diff = angleBC - angleAB;
  let normalized = Math.atan2(Math.sin(diff), Math.cos(diff));

  let bisectorAngle = angleAB + normalized / 2;
  bisectorAngle = Math.atan2(Math.sin(bisectorAngle), Math.cos(bisectorAngle));

  // 4. Малюємо бісектрису
  const length = 300; 
  const bisectorX = points[1].x + Math.cos(bisectorAngle) * length;
  const bisectorY = points[1].y + Math.sin(bisectorAngle) * length;

  ctx.beginPath();
  ctx.moveTo(points[1].x, points[1].y);
  ctx.lineTo(bisectorX, bisectorY);
  ctx.setLineDash([5, 5]); 
  ctx.stroke();
  ctx.setLineDash([]); 

  // --- 5. ДИНАМІЧНИЙ РАДІУС: Зчитуємо значення з повзунка ---
  const circleRadius = parseInt(radiusSlider.value, 10);

  const halfAngle = Math.abs(normalized / 2);
  const distanceToCenter = circleRadius / Math.sin(Math.max(halfAngle, 0.001));

  const circleX = points[1].x + Math.cos(bisectorAngle) * distanceToCenter;
  const circleY = points[1].y + Math.sin(bisectorAngle) * distanceToCenter;

  // Малюємо центр кола
  ctx.beginPath();
  ctx.arc(circleX, circleY, 4, 0, Math.PI * 2);
  ctx.fill();

  // Малюємо коло пунктиром
  ctx.beginPath();
  ctx.arc(circleX, circleY, circleRadius, 0, Math.PI * 2);
  ctx.setLineDash([4, 4]); 
  ctx.stroke();
  ctx.setLineDash([]);    

  // Розрахунок точок дотику
  const distanceToTangent = circleRadius / Math.tan(Math.max(halfAngle, 0.001));
  const tangentAX = points[1].x + Math.cos(angleAB) * distanceToTangent;
  const tangentAY = points[1].y + Math.sin(angleAB) * distanceToTangent;
  const tangentCX = points[1].x + Math.cos(angleBC) * distanceToTangent;
  const tangentCY = points[1].y + Math.sin(angleBC) * distanceToTangent;

  // Малюємо точки дотику
  ctx.beginPath(); ctx.arc(tangentAX, tangentAY, 5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(tangentCX, tangentCY, 5, 0, Math.PI * 2); ctx.fill();

  // Малювання радіусів
  ctx.beginPath();
  ctx.moveTo(circleX, circleY); ctx.lineTo(tangentAX, tangentAY);
  ctx.moveTo(circleX, circleY); ctx.lineTo(tangentCX, tangentCY);
  ctx.setLineDash([2, 3]); 
  ctx.stroke();
  ctx.setLineDash([]);    

  // --- 6. Побудова закруглення з 5 лінійних сегментів ---
  const startAngle = Math.atan2(tangentAY - circleY, tangentAX - circleX);
  const endAngle = Math.atan2(tangentCY - circleY, tangentCX - circleX);

  let angleDiff = endAngle - startAngle;
  angleDiff = Math.atan2(Math.sin(angleDiff), Math.cos(angleDiff));

  const segmentsCount = 5; 
  const pointsCount = segmentsCount + 1; 
  const arcPoints = [];

  for (let i = 0; i < pointsCount; i++) {
    const currentAngle = startAngle + angleDiff * (i / segmentsCount);
    const x = circleX + Math.cos(currentAngle) * circleRadius;
    const y = circleY + Math.sin(currentAngle) * circleRadius;
    arcPoints.push({ x, y });
  }

  // Малюємо жирну лінію закруглення
  ctx.beginPath();
  arcPoints.forEach((p, i) => {
    if (i === 0) ctx.moveTo(p.x, p.y);
    else ctx.lineTo(p.x, p.y);
  });
  ctx.lineWidth = 4;
  ctx.strokeStyle = "blue"; // Робимо дугу синьою
  ctx.stroke();

  // Малюємо крапки поверх лінії
  ctx.fillStyle = "black";
  arcPoints.forEach((p) => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.lineWidth = 1;
  ctx.strokeStyle = "black";
}

// --- ОБРОБКА ПОДІЙ ---

// Слідкуємо за повзунком радіуса
radiusSlider.addEventListener("input", () => {
  radiusValue.textContent = radiusSlider.value + "px"; // Оновлюємо текст поруч
  draw(); // Перемальовуємо
});

// Мишка: початок перетягування
canvas.addEventListener("mousedown", (e) => {
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  draggedPoint = points.find((point) => {
    return Math.hypot(point.x - mouseX, point.y - mouseY) <= pointRadius;
  });
});

// Мишка: рух
canvas.addEventListener("mousemove", (e) => {
  if (!draggedPoint) return;
  const rect = canvas.getBoundingClientRect();
  draggedPoint.x = e.clientX - rect.left;
  draggedPoint.y = e.clientY - rect.top;
  draw(); 
});

window.addEventListener("mouseup", () => { draggedPoint = null; });

draw();
