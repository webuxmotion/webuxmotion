export default class Arrow {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.strokeStyle = "#ffffff";
    this.rotation = 0;
    
    // Новий параметр для налаштування скруглення кутів
    this.cornerRadius = 50; 

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

  // Оновлений метод для створення округлих фасок за допомогою arcTo
  setPathByPoints(ctx, points) {
    const len = points.length;
    if (len < 3) return; // Для скруглення потрібно мінімум 3 точки

    ctx.beginPath();

    // Знаходимо середину між останньою і першою точкою, щоб почати малювання на прямій ділянці
    const startX = (points[len - 1].x + points[0].x) / 2;
    const startY = (points[len - 1].y + points[0].y) / 2;
    ctx.moveTo(startX, startY);

    // Проходимо по всіх точках і заокруглюємо кожен кут
    for (let i = 0; i < len; i++) {
      const current = points[i];
      const next = points[(i + 1) % len]; // Наступна точка (з поверненням до 0 в кінці)

      // Малюємо лінію до початку заокруглення і саму дугу кута
      ctx.arcTo(current.x, current.y, next.x, next.y, this.cornerRadius);
    }

    ctx.closePath();
  }

  draw(ctx) {
    ctx.save();
    
    // Налаштування стилю лінії
    ctx.setLineDash([10, 3]); // Ваша початкова пунктирна лінія
    ctx.lineWidth = 2;
    ctx.strokeStyle = this.strokeStyle;
    ctx.lineJoin = "round"; // Додатково згладжує стики ліній
    
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    
    this.setPathByPoints(ctx, this.points);
    ctx.stroke();
    
    ctx.restore();
  }
}
