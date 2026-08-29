import Point from "../shared/Point.js";
import utils from "../shared/utils.js";

window.onload = function () {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const mouse = utils.captureMouse(canvas);
  const colors = utils.colors();
  ctx.fillStyle = "#E6E1E3";
  ctx.strokeStyle = "#E6E1E3";
  ctx.lineWidth = 1;
  let previousTime = 0;

  let bezierCurvePoints = [];

  const points = [
    new Point({
      point: {
        x: 100,
        y: 400,
      },
      color: colors[1],
    }),
    new Point({
      point: {
        x: 350,
        y: 100,
      },
      color: colors[1],
    }),
    new Point({
      point: {
        x: 550,
        y: 400,
      },
      color: colors[1],
    }),
  ];


  let selectedPoint = null;
  const offset = { x: 0, y: 0 };

  function updatePoints(delta) {
    bezierCurvePoints = [];

    if (!mouse.isDown) {
      selectedPoint = null;
    }

    if (!selectedPoint && mouse.isDown) {
      selectedPoint = points.find((point) => {
        const dist = Math.hypot(point.x - mouse.x, point.y - mouse.y);
        return dist < point.radius;
      });

      if (selectedPoint) {
        offset.x = mouse.x - selectedPoint.x;
        offset.y = mouse.y - selectedPoint.y;
      }
    }

    if (selectedPoint && mouse.isDown) {
      selectedPoint.x = mouse.x - offset.x;
      selectedPoint.y = mouse.y - offset.y;
    }

    points.forEach((point, index) => {
      point.index = index;
      point.update(delta);
    });
  }

  function drawPoints() {
    points.forEach((point) => {
      point.draw(ctx);
    });

    utils.drawLineFromPoints(ctx, bezierCurvePoints);
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

    updatePoints(delta);
    drawPoints();
  }

  requestAnimationFrame(draw);
};
