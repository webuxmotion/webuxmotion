import Ball from "./classes/Ball.js";
import utils from "../shared/utils.js";

window.onload = function () {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const mouse = utils.captureMouse(canvas);
  ctx.strokeStyle = "#E6E1E3";
  ctx.fillStyle = "#E6E1E3";
  let previousTime = 0;

  // ball
  const ball = new Ball();
  ball.radius = 12;

  // other params
  const radiusX = 70;
  const radiusY = 70;
  const ovalFactorMaxDist = 80;
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const xSpeed = Math.PI;
  const ySpeed = Math.PI;
  let angleX = 0;
  let angleY = 0;
  let mouseDown = false;
  let boost = 1;
  let ovalFactorX = 0;
  let ovalFactorY = 0;

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

    // 1. Рахуємо кут від центру екрана до мишки
    let globalAngleToMouse = 0;
    if (!mouse.isOutside) {
      globalAngleToMouse = Math.atan2(mouse.y - centerY, mouse.x - centerX);
    }

    // 2. Рахуємо внутрішні координати кульки (відносно центру 0,0)
    const localX = Math.cos(angleX) * (radiusX + ovalFactorX);
    const localY = Math.sin(angleY) * (radiusY + ovalFactorY);

    // some math
    ball.x =
      centerX +
      (localX * Math.cos(globalAngleToMouse) -
        localY * Math.sin(globalAngleToMouse));
    ball.y =
      centerY +
      (localX * Math.sin(globalAngleToMouse) +
        localY * Math.cos(globalAngleToMouse));
    angleX += xSpeed * delta * boost;
    angleY += ySpeed * delta * boost;

    if (!mouse.isOutside) {
      ctx.beginPath();
      ctx.moveTo(mouse.x, mouse.y);
      ctx.lineTo(ball.x, ball.y);
      ctx.stroke();

      const angleToMouse = Math.atan2(ball.y - mouse.y, ball.x - mouse.x);
      let dx = ball.x - mouse.x;
      let dy = ball.y - mouse.y;
      const dist = Math.trunc(Math.sqrt(dx * dx + dy * dy));
      let textDist = 0;
      if (mouseDown) {
        textDist = 40;
        boost = 10;
        ovalFactorX = ovalFactorMaxDist;
      } else {
        textDist = dist / 2;
        boost = 2;
        ovalFactorX = 0;
      }
      const textPosition = {
        x: mouse.x + Math.cos(angleToMouse) * textDist,
        y: mouse.y + Math.sin(angleToMouse) * textDist,
      };
      ctx.font = "50px Arial";
      ctx.textBaseline = "middle";
      ctx.fillText(dist + "px", textPosition.x + 4, textPosition.y);

      ctx.beginPath();
      ctx.arc(textPosition.x, textPosition.y, 2, 0, Math.PI * 2, 0);
      ctx.fill();
    }

    // draw
    ball.draw(ctx);
  }

  canvas.addEventListener("mousedown", () => {
    mouseDown = true;
  });

  canvas.addEventListener("mouseup", () => {
    mouseDown = false;
  });

  requestAnimationFrame(draw);
};
