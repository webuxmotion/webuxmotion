const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const points = [
  { title: "A", x: 200, y: 50 },
  { title: "B", x: 50, y: 300 },
  { title: "C", x: 400, y: 350 },
];

const pointRadius = 10; // Збільшимо радіус кліку, щоб по точках було легше влучати мишкою
let draggedPoint = null;

// Головна функція малювання
function draw() {
  // Очищаємо канвас перед кожним новим кадром
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.font = "30px sans-serif";
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
    // Для краси малюємо маленьку точку (4px), хоча зона кліку більша (10px)
    ctx.arc(point.x, point.y, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillText(point.title, point.x - 20, point.y - 10);
  });

  // 3. Рахуємо кути та бісектрису
  const angleAB = Math.atan2(
    points[0].y - points[1].y,
    points[0].x - points[1].x,
  );
  const angleBC = Math.atan2(
    points[2].y - points[1].y,
    points[2].x - points[1].x,
  );

  let diff = angleBC - angleAB;
  let normalized = Math.atan2(Math.sin(diff), Math.cos(diff));

  // Динамічна бісектриса, яка працює при будь-якому обертанні трикутника
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

  // --- 5. НОВИЙ БЛОК: Розрахунок та малювання вписаного кола пунктиром ---
  const circleRadius = 40; // Задаємо бажаний радіус кола

  // Рахуємо половину внутрішнього кута
  const halfAngle = Math.abs(normalized / 2);

  // Знаходимо гіпотенузу — відстань від точки B до центру кола
  // Використовуємо Math.max, щоб уникнути ділення на нуль, якщо кут стане рівним 0°
  const distanceToCenter = circleRadius / Math.sin(Math.max(halfAngle, 0.001));

  // Обчислюємо точні координати центру кола на бісектрисі
  const circleX = points[1].x + Math.cos(bisectorAngle) * distanceToCenter;
  const circleY = points[1].y + Math.sin(bisectorAngle) * distanceToCenter;

  ctx.beginPath();
  ctx.arc(circleX, circleY, 4, 0, Math.PI * 2);
  ctx.fill();

  // Малюємо коло пунктиром
  ctx.beginPath();
  ctx.arc(circleX, circleY, circleRadius, 0, Math.PI * 2);
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 4]); // Пунктир
  ctx.stroke();
  ctx.setLineDash([]); // Скидаємо пунктир

  // --- ДОДАТКОВО: Розрахунок та малювання точок дотику ---

  // Відстань від точки B до точок дотику вздовж сторін кута
  const distanceToTangent = circleRadius / Math.tan(Math.max(halfAngle, 0.001));

  // Точка дотику на лінії BA
  const tangentAX = points[1].x + Math.cos(angleAB) * distanceToTangent;
  const tangentAY = points[1].y + Math.sin(angleAB) * distanceToTangent;

  // Точка дотику на лінії BC
  const tangentCX = points[1].x + Math.cos(angleBC) * distanceToTangent;
  const tangentCY = points[1].y + Math.sin(angleBC) * distanceToTangent;

  // Малюємо першу точку дотику (наприклад, червону або синю)
  ctx.beginPath();
  ctx.arc(tangentAX, tangentAY, 5, 0, Math.PI * 2);
  ctx.fill();

  // Малюємо другу точку дотику
  ctx.beginPath();
  ctx.arc(tangentCX, tangentCY, 5, 0, Math.PI * 2);
  ctx.fill();

  // --- ДОДАТКОВО: Малювання радіусів до точок дотику ---
  ctx.beginPath();
  // Лінія до першої точки дотику (на стороні BA)
  ctx.moveTo(circleX, circleY);
  ctx.lineTo(tangentAX, tangentAY);

  // Лінія до другої точки дотику (на стороні BC)
  ctx.moveTo(circleX, circleY);
  ctx.lineTo(tangentCX, tangentCY);

  ctx.lineWidth = 1;
  ctx.setLineDash([2, 3]); // Дрібний пунктир для радіусів, щоб відрізнявся від бісектриси
  ctx.stroke();
  ctx.setLineDash([]); // Скидаємо пунктир

    // --- ДОДАТКОВО: Побудова закруглення з 5 лінійних сегментів (БЕЗ БАГІВ) ---
  
  const startAngle = Math.atan2(tangentAY - circleY, tangentAX - circleX);
  const endAngle = Math.atan2(tangentCY - circleY, tangentCX - circleX);

  let angleDiff = endAngle - startAngle;
  angleDiff = Math.atan2(Math.sin(angleDiff), Math.cos(angleDiff));

  const segmentsCount = 5; 
  const pointsCount = segmentsCount + 1; 

  // Створюємо масив для збереження точок, щоб не ламати шлях під час циклу
  const arcPoints = [];

  for (let i = 0; i < pointsCount; i++) {
    const currentAngle = startAngle + angleDiff * (i / segmentsCount);
    const x = circleX + Math.cos(currentAngle) * circleRadius;
    const y = circleY + Math.sin(currentAngle) * circleRadius;
    arcPoints.push({ x, y });
  }

  // 1. Спочатку малюємо ТІЛЬКИ ЖИРНУ ЛІНІЮ
  ctx.beginPath();
  arcPoints.forEach((p, i) => {
    if (i === 0) {
      ctx.moveTo(p.x, p.y);
    } else {
      ctx.lineTo(p.x, p.y);
    }
  });

  ctx.lineWidth = 4;         // Робимо лінію жирною
  ctx.strokeStyle = "blue";   // Задаємо синій (або будь-який яскравий) колір
  ctx.lineCap = "round";      // Згладжуємо кути з'єднань відрізків
  ctx.stroke();

  // 2. І тільки тепер малюємо КРАПКИ ПОВЕРХ лінії
  ctx.fillStyle = "black";    // Колір для крапок
  arcPoints.forEach((p) => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
    ctx.fill();
  });

  // Скидаємо стилі назад до стандартних чорних
  ctx.lineWidth = 1;
  ctx.strokeStyle = "black";
  ctx.fillStyle = "black";
}

// --- ОБРОБКА ПОДІЙ МИШІ ---

// Початок перетягування
canvas.addEventListener("mousedown", (e) => {
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  // Перевіряємо, чи клікнув користувач у радіусі якоїсь із точок
  draggedPoint = points.find((point) => {
    const distance = Math.hypot(point.x - mouseX, point.y - mouseY);
    return distance <= pointRadius;
  });
});

// Процес перетягування
canvas.addEventListener("mousemove", (e) => {
  if (!draggedPoint) return; // Якщо нічого не захоплено — ігноруємо рух

  const rect = canvas.getBoundingClientRect();
  draggedPoint.x = e.clientX - rect.left;
  draggedPoint.y = e.clientY - rect.top;

  draw(); // Перемальовуємо сцену з новими координатами
});

// Кінець перетягування
window.addEventListener("mouseup", () => {
  draggedPoint = null;
});

// Перший запуск малювання при завантаженні сторінки
draw();
