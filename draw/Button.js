export default class Button {
  constructor() {
    this.width = 50;
    this.height = 50;
    this.x = 0;
    this.y = 0;
  }

  draw({ ctx, drawLegacyRoundRect, spacing }) {
    this.x = spacing;
    this.y = 30;
    drawLegacyRoundRect(ctx, this.x, this.y, this.width, this.height, 10);
  }

  handleMousemove({ canvasMouse: mouse, canvas }) {
    if (
      mouse.x > this.x &&
      mouse.x < this.x + this.width &&
      mouse.y > this.y &&
      mouse.y < this.y + this.height
    ) {
      canvas.style.cursor = "pointer";
    } else {
      canvas.style.cursor = "default";
    }
  }
}
