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

  ball.x = 0;
  ball.y = canvasCenterPoint.y;
  let range = 70;
  let yspeed = Math.PI * 2;
  let xspeed = 500;

  ctx.strokeStyle = "#E6E1E3";
  ctx.fillStyle = "#E6E1E3";

  let previousTime = 0;

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

    ball.y = canvas.height / 2 + Math.sin(angle) * range;
    ball.x += xspeed * delta;
    if (ball.x > canvas.width + ball.radius) ball.x = -ball.radius;
    angle += yspeed * delta;
    ball.draw(ctx);
  }

  requestAnimationFrame(draw);
};
