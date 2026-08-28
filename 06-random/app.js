import Ball from "./classes/Ball.js";

window.onload = function () {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  ctx.strokeStyle = "#E6E1E3";
  ctx.fillStyle = "#E6E1E3";
  let previousTime = 0;

  // ball
  const ball = new Ball();

  // other params
  const range = 50;
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const xSpeed = Math.PI * 2;
  const ySpeed = Math.PI * 2 - 0.5;
  let angleX = 0;
  let angleY = 0;

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

    // some math
    ball.x = centerX + Math.sin(angleX) * range;
    ball.y = centerY + Math.sin(angleY) * range;
    angleX += xSpeed * delta;
    angleY += ySpeed * delta;

    // draw
    ball.draw(ctx);
  }

  requestAnimationFrame(draw);
};
