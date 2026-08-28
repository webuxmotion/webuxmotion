import Ball from "./classes/Ball.js";

window.onload = function () {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  ctx.strokeStyle = "#E6E1E3";
  ctx.fillStyle = "#E6E1E3";
  let previousTime = 0;

  // ball
  const ball = new Ball();
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  
  // other params
  const centerScale = 1;
  const range = 0.5;
  const speed = Math.PI * 2;
  let angle = 0;

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
    ball.scaleX = ball.scaleY = centerScale + Math.sin(angle) * range;
    angle += speed * delta;

    // draw
    ball.draw(ctx);
  }

  requestAnimationFrame(draw);
};
