export default class Arrow {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.strokeStyle = "#ffffff";
    this.rotation = 0;
    this.cornerRadius = 15; // Радіус фаски (кола скруглення)

    this.params = {
      radius: 200,
      bigAngle: 137,
      oppositePointAngle: 180,
      rotationAngle: 0,
      smallRadius: null
    };
    this.params.smallRadius = this.params.radius / 2.2;
    this.points = [];
  }

  setPoints() {
    const angles = [
      this.params.rotationAngle,
      this.params.rotationAngle + this.params.bigAngle,
      this.params.rotationAngle - this.params.bigAngle,
    ];

    this.points = [];

    angles.forEach((angle) => {
      const angleInRad = this.degToRad(angle);
      const point = {
        x: Math.cos(angleInRad) * this.params.radius,
        y: Math.sin(angleInRad) * this.params.radius,
      };
      this.points.push(point);
    });

    const backPointAngleInRad = this.degToRad(this.params.rotationAngle + this.params.oppositePointAngle);
    const backPoint = {
      x: Math.cos(backPointAngleInRad) * this.params.smallRadius,
      y: Math.sin(backPointAngleInRad) * this.params.smallRadius,
    };

    // Вставляємо внутрішній кут стрілки строго між її крилами
    this.points.splice(2, 0, backPoint);
  }

  degToRad(deg) {
    return (Math.PI / 180) * deg;
  }

  // Метод для розрахунку параметрів скруглення окремого кута
  getCornerArcDetails(pStart, pCorner, pNext, r) {
    // Вектори сторін кута: Corner -> Start та Corner -> Next
    const v1 = { x: pStart.x - pCorner.x, y: pStart.y - pCorner.y };
    const v2 = { x: pNext.x - pCorner.x, y: pNext.y - pCorner.y };

    // Довжини векторів
    const d1 = Math.hypot(v1.x, v1.y);
    const d2 = Math.hypot(v2.x, v2.y);

    // Нормалізовані вектори (одиничної довжини)
    const u1 = { x: v1.x / d1, y: v1.y / d1 };
    const u2 = { x: v2.x / d2, y: v2.y / d2 };

    // Кут між двома векторами сторін
    const angle = Math.acos(u1.x * u2.x + u1.y * u2.y);

    // Відстань від вершини кута до точок дотику кола (Тангенс половини кута)
    const tDist = r / Math.tan(angle / 2);

    // Точки дотику (де дуга починається і закінчується)
    const tPoint1 = { x: pCorner.x + u1.x * tDist, y: pCorner.y + u1.y * tDist };
    const tPoint2 = { x: pCorner.x + u2.x * tDist, y: pCorner.y + u2.y * tDist };

    // Бісектриса кута (напрямок до центру кола)
    const bisector = { x: u1.x + u2.x, y: u1.y + u2.y };
    const bLen = Math.hypot(bisector.x, bisector.y);
    const uB = { x: bisector.x / bLen, y: bisector.y / bLen }; // Одиничний вектор бісектриси

    // Відстань від вершини кута до центру уявного кола
    const cDist = r / Math.sin(angle / 2);

    // Центр уявного кола дуги
    const center = { x: pCorner.x + uB.x * cDist, y: pCorner.y + uB.y * cDist };

    // Початковий та кінцевий кути для малювання через ctx.arc
    const startAngle = Math.atan2(tPoint1.y - center.y, tPoint1.x - center.x);
    const endAngle = Math.atan2(tPoint2.y - center.y, tPoint2.x - center.x);

    // Визначаємо правильний напрямок обходу дуги (за чи проти годинникової стрілки)
    const crossProduct = u1.y * u2.x - u1.x * u2.y;
    const counterClockwise = crossProduct < 0;

    return { center, startAngle, endAngle, counterClockwise, tPoint1, tPoint2 };
  }

  setPathByPoints(ctx, points) {
    const len = points.length;
    if (len < 3) return;

    ctx.beginPath();

    // Масив для збереження розрахованих даних для кожного кута
    const arcs = [];

    for (let i = 0; i < len; i++) {
      const pStart = points[(i - 1 + len) % len];
      const pCorner = points[i];
      const pNext = points[(i + 1) % len];

      console.log(pStart, pCorner, pNext);

      const arcDetails = this.getCornerArcDetails(pStart, pCorner, pNext, this.cornerRadius);
      arcs.push(arcDetails);
    }

    // Починаємо контур з першої точки дотику першого кута
    ctx.moveTo(arcs[0].tPoint1.x, arcs[0].tPoint1.y);

    // Послідовно малюємо дуги. Canvas автоматично з'єднає їх лініями між собою
    for (let i = 0; i < len; i++) {
      const arcData = arcs[i];
      ctx.arc(
        arcData.center.x, 
        arcData.center.y, 
        this.cornerRadius, 
        arcData.startAngle, 
        arcData.endAngle, 
        arcData.counterClockwise
      );
    }

    ctx.closePath();
  }

  draw(ctx) {
    ctx.save();
    ctx.setLineDash([10, 3]);
    ctx.lineWidth = 2;
    ctx.strokeStyle = this.strokeStyle;
    
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    
    this.setPathByPoints(ctx, this.points);
    ctx.stroke();
    
    ctx.restore();
  }
}
