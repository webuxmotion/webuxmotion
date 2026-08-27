import Ball from "./classes/Ball.js";

window.onload = function () {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const ball = new Ball();
  let angle = 0;

  let canvasCenterPoint = {
    x: canvas.width / 2,
    y: canvas.height / 2,
  };

  ball.x = canvasCenterPoint.x;
  ball.y = canvasCenterPoint.y;
  let radius = 100;

  let previousTime = 0;
  let speed = Math.PI * 2;

  ctx.strokeStyle = "#E6E1E3";
  ctx.fillStyle = "#E6E1E3";

  function drawing() {
    const circle = {
      x: canvasCenterPoint.x - 200,
      y: canvasCenterPoint.y,
    };

    ctx.save();
    ctx.beginPath();
    ctx.arc(circle.x, circle.y, radius, 0, Math.PI * 2, 0);
    ctx.stroke();
    ctx.restore();

    const point = {
      x: circle.x + Math.cos(angle) * radius,
      y: circle.y + Math.sin(angle) * radius,
    };

    ctx.beginPath();
    ctx.arc(point.x, point.y, 6, 0, Math.PI * 2, 0);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(point.x, point.y);
    ctx.lineTo(ball.x, ball.y);
    ctx.stroke();
  }

  function draw(currentTime) {
    requestAnimationFrame(draw);
    if (previousTime === null) {
      previousTime = currentTime;
      return;
    }
    let delta = (currentTime - previousTime) / 1000;
    if (delta > 0.1) delta = 0.1;
    previousTime = currentTime;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ball.y = canvas.height / 2 + Math.sin(angle) * radius;
    angle += speed * delta;
    ball.draw(ctx);

    //drawing();
  }

  requestAnimationFrame(draw);
};
