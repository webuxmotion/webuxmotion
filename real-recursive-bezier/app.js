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
  let bezierCurvePoints2 = [];
  let bPoints = [];
  let bPoints2 = [];

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
    bezierCurvePoints2 = [];
    bPoints = [];
    bPoints2 = [];

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

    bezierCurvePoints2 = utils.getAdaptiveBezierPath(
      points[0],
      points[1],
      points[2],
      4,
    );

    bezierCurvePoints = utils.getBezierPath(
      points[0],
      points[1],
      points[2],
      bezierCurvePoints2.length,
    );

    bezierCurvePoints.forEach((point) => {
      bPoints.push(new Point({ point, color: colors[9], steps: 3, radius: 4 }).update(delta));
    });

    bezierCurvePoints2.forEach((point) => {
      bPoints2.push(new Point({ point, color: colors[9], steps: 3, radius: 4 }).update(delta));
    });
  }

  function drawPoints() {
    points.forEach((point) => {
      point.draw(ctx);
    });

    if (mouse.isDown) {
      utils.drawLineFromPoints(ctx, bezierCurvePoints2);
      bPoints2.forEach((point) => {
        point.draw(ctx);
      });
    } else {
      utils.drawLineFromPoints(ctx, bezierCurvePoints);
      bPoints.forEach((point) => {
        point.draw(ctx);
      });
    }
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
