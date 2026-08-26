import Button from "./Button.js";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let spacing = 50;
let topSpacing = 100;

const canvasMouse = {
  x: 0,
  y: 0,
};

const button = new Button();

window.addEventListener("mousedown", (event) => {});

window.addEventListener("mousemove", (event) => {
  const canvasRect = canvas.getBoundingClientRect();
  canvasMouse.x = event.clientX - canvasRect.left;
  canvasMouse.y = event.clientY - canvasRect.top;

  if (
    canvasMouse.x > 0 &&
    canvasMouse.x < canvas.width &&
    canvasMouse.y > 0 &&
    canvasMouse.y < canvas.height
  ) {
    button.handleMousemove({ canvasMouse, canvas });
  } else {

  }
});

ctx.save();

drawLegacyRoundRect(
  ctx,
  spacing,
  topSpacing,
  canvas.width - spacing * 2,
  canvas.height - topSpacing - spacing,
  20,
);

ctx.clip();

// draw the user image here

ctx.restore();

button.draw({ ctx, drawLegacyRoundRect, spacing });

function drawLegacyRoundRect(ctx, x, y, width, height, radius) {
  ctx.save();
  ctx.fillStyle = "#121314";
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius); // Top-right
  ctx.arcTo(x + width, y + height, x, y + height, radius); // Bottom-right
  ctx.arcTo(x, y + height, x, y, radius); // Bottom-left
  ctx.arcTo(x, y, x + width, y, radius); // Top-left
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}
