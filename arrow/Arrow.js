export default class Arrow {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.strokeStyle = "#ffffff";
    this.rotation = 0;
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

    // set back point
    const backPointAngleInRad = this.degToRad(this.params.rotationAngle + this.params.oppositePointAngle);
    const backPoint = {
      x: Math.cos(backPointAngleInRad) * this.params.smallRadius,
      y: Math.sin(backPointAngleInRad) * this.params.smallRadius,
    };

    this.points.splice(2, 0, backPoint);
  }

  degToRad(deg) {
    return (Math.PI / 180) * deg;
  }

  setPathByPoints(ctx, points) {
    ctx.beginPath();

    points.forEach((point, index) => {
      if (index == 0) {
        ctx.moveTo(point.x, point.y);
      } else {
        ctx.lineTo(point.x, point.y);
      }
    });

    ctx.lineTo(points[0].x, points[0].y);
    ctx.closePath();
  }

  draw(ctx) {
    ctx.save();
    ctx.setLineDash([10, 3]);
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.lineWidth = 2;
    this.setPathByPoints(ctx, this.points);
    ctx.strokeStyle = this.strokeStyle;
    ctx.stroke();
    ctx.restore();
  }
}
