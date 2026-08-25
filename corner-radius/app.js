window.onload = function () {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  const points = [
    { name: "A", x: 400, y: 20 },
    { name: "B", x: 200, y: 200 },
    { name: "C", x: 40, y: 100 },
  ];

  const arcRadius = 30;
  const len = points.length;
  const arcs = [];

  for (let i = 0; i < len; i++) {
    const pCorner = points[i];
    const pStart = i == 0 ? points[len - 1] : points[i - 1];
    const pEnd = i == len - 1 ? points[0] : points[i + 1];

    const arcInfo = generateArcInfo(pStart, pCorner, pEnd, arcRadius);
    arcs.push(arcInfo);
  }

  function generateArcInfo(pStart, pCorner, pEnd, radius) {
    // 1. Знаходимо абсолютні кути нахилу обох ліній, що виходять з вершини кута
    const angleToStart = Math.atan2(pStart.y - pCorner.y, pStart.x - pCorner.x);
    const angleToEnd = Math.atan2(pEnd.y - pCorner.y, pEnd.x - pCorner.x);

    // 2. Рахуємо чистий внутрішній кут між цими двома лініями
    let innerAngle = angleToEnd - angleToStart;

    // Нормалізуємо кут, щоб він завжди залишався в межах від -ПІ до +ПІ (-180°...180°)
    if (innerAngle > Math.PI) innerAngle -= Math.PI * 2;
    if (innerAngle < -Math.PI) innerAngle += Math.PI * 2;

    // 3. Кут бісектриси (лінії, яка ділить кут навпіл і веде до центру кола)
    const bisectorAngle = angleToStart + innerAngle / 2;

    // 4. За базовою шкільною геометрією знаходимо відстані від вершини кута:
    const tDist = radius / Math.abs(Math.tan(innerAngle / 2));
    const cDist = radius / Math.abs(Math.sin(innerAngle / 2));

    // 5. Знаходимо координати центру кола, просто крокуючи від кута вздовж бісектриси
    const center = {
      x: pCorner.x + Math.cos(bisectorAngle) * cDist,
      y: pCorner.y + Math.sin(bisectorAngle) * cDist,
    };

    // 6. Радіус кола завжди перпендикулярний до сторін кута.
    // Зміщуємо стартовий та кінцевий кути дуги на 90 градусів (PI / 2) відносно НАПРЯМКУ ЛІНІЙ.
    const sweepSign = innerAngle < 0 ? 1 : -1;
    const startAngle = angleToStart + sweepSign * (Math.PI / 2);
    const endAngle = angleToEnd - sweepSign * (Math.PI / 2);

    // 7. Напрямок малювання дуги в системі Canvas Y-down
    const counterClockwise = innerAngle > 0;

    return {
      center: center,
      startAngle: startAngle,
      endAngle: endAngle,
      counterClockwise: counterClockwise,
    };
  }

  // === БЛОК МАЛЮВАННЯ НА CANVAS ===
  ctx.save();
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Очищаємо екран перед рендером

  ctx.lineWidth = 2;
  ctx.strokeStyle = "#ffffff"; // Колір контуру фігури

  ctx.beginPath();

  // Починаємо контур з початкової точки першої дуги найпершого кута
  const firstArc = arcs[0];
  ctx.moveTo(
    firstArc.center.x + Math.cos(firstArc.startAngle) * arcRadius,
    firstArc.center.y + Math.sin(firstArc.startAngle) * arcRadius,
  );

  // Послідовно запускаємо циркуль для кожного кута фігури
  for (let i = 0; i < len; i++) {
    const arcData = arcs[i];

    ctx.arc(
      arcData.center.x,
      arcData.center.y,
      arcRadius,
      arcData.startAngle,
      arcData.endAngle,
      arcData.counterClockwise,
    );
  }

  ctx.closePath(); // Автоматично з'єднує кінець останньої дуги з початком першої
  ctx.stroke(); // Обводимо лінії
  ctx.restore();
};
