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
    // Для краси малюємо маленьку точку (4px), хоча зона кліку більша (10px)
    ctx.arc(point.x, point.y, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillText(point.title, point.x - 20, point.y - 10);
  });

  // 3. Рахуємо кути та бісектрису
  const angleAB = Math.atan2(points[0].y - points[1].y, points[0].x - points[1].x);
  const angleBC = Math.atan2(points[2].y - points[1].y, points[2].x - points[1].x);
  
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
