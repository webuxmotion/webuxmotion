export default class Point {
  constructor({
    point,
    radius = 20,
    steps = 8,
    style = 1,
    index = null,
    color = "#E6E1E3",
  }) {
    this.x = point.x;
    this.y = point.y;
    this.radius = radius;
    this.steps = steps;
    this.style = 1;
    this.circlePathPoints = [];
    this.index = null;
    this.color = color;
  }

  update(delta) {
    this.circlePathPoints = [];
    const stepAngle = (Math.PI * 2) / this.steps;

    for (let i = 0; i <= this.steps; i++) {
      const p = {
        x: this.x + Math.cos(stepAngle * i + Math.PI / (this.steps)) * this.radius,
        y: this.y + Math.sin(stepAngle * i + Math.PI / (this.steps)) * this.radius,
      };

      this.circlePathPoints.push(p);
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.beginPath();

    ctx.fillStyle = this.color;
    ctx.strokeStyle = this.color;

    this.circlePathPoints.forEach((p, index) => {
      if (index == 0) {
        ctx.moveTo(p.x, p.y);
      } else {
        ctx.lineTo(p.x, p.y);
      }
    });

    ctx.stroke();

    if (this.index !== null) {
      ctx.font = "24px sans-serif";
      ctx.fillText(this.index, this.x + this.radius, this.y - this.radius);
    }

    ctx.restore();
  }
}
