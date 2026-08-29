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

  const qPoints = [
    new Point({ point: {}, color: colors[4], radius: 6 }),
    new Point({ point: {}, color: colors[4], radius: 6 }),
  ];

  const m0points = [
    new Point({ point: {}, color: colors[5], radius: 10, steps: 3 }),
  ];

  const m1points = [
    new Point({ point: {}, color: colors[5], radius: 10, steps: 3 }),
    new Point({ point: {}, color: colors[5], radius: 10, steps: 3 }),
  ];

  const q0points = [
    new Point({ point: {}, color: colors[6], radius: 6 }),
    new Point({ point: {}, color: colors[6], radius: 6 }),
  ];

  const q1points = [
    new Point({ point: {}, color: colors[6], radius: 6 }),
    new Point({ point: {}, color: colors[6], radius: 6 }),
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

    qPoints.forEach((point, index) => {
      point.index = index;

      if (index === 0) {
        point.x = (points[0].x + points[1].x) / 2;
        point.y = (points[0].y + points[1].y) / 2;
      } else if (index === 1) {
        point.x = (points[1].x + points[2].x) / 2;
        point.y = (points[1].y + points[2].y) / 2;
      }

      point.update(delta);
    });

    m0points.forEach((point, index) => {
      point.x = (qPoints[0].x + qPoints[1].x) / 2;
      point.y = (qPoints[0].y + qPoints[1].y) / 2;
      point.index = index;
      point.update(delta);
    });

    q0points.forEach((point, index) => {
      point.index = index;

      if (index === 0) {
        point.x = (points[0].x + qPoints[0].x) / 2;
        point.y = (points[0].y + qPoints[0].y) / 2;
      } else if (index === 1) {
        point.x = (qPoints[0].x + m0points[0].x) / 2;
        point.y = (qPoints[0].y + m0points[0].y) / 2;
      }

      point.update(delta);
    });

    q1points.forEach((point, index) => {
      point.index = index;

      if (index === 0) {
        point.x = (points[2].x + qPoints[1].x) / 2;
        point.y = (points[2].y + qPoints[1].y) / 2;
      } else if (index === 1) {
        point.x = (qPoints[1].x + m0points[0].x) / 2;
        point.y = (qPoints[1].y + m0points[0].y) / 2;
      }

      point.update(delta);
    });

    m1points.forEach((point, index) => {
      point.index = index;

      if (index === 0) {
        point.x = (q0points[0].x + q0points[1].x) / 2;
        point.y = (q0points[0].y + q0points[1].y) / 2;
      } else if (index === 1) {
        point.x = (q1points[0].x + q1points[1].x) / 2;
        point.y = (q1points[0].y + q1points[1].y) / 2;
      }

      point.update(delta);
    });

    bezierCurvePoints.push(points[0]);
    bezierCurvePoints.push(m1points[0]);
    bezierCurvePoints.push(m0points[0]);
    bezierCurvePoints.push(m1points[1]);
    bezierCurvePoints.push(points[2]);
  }

  function drawPoints() {
    points.forEach((point) => {
      point.draw(ctx);
    });

    qPoints.forEach((point) => {
      point.draw(ctx);
    });

    m0points.forEach((point) => {
      point.draw(ctx);
    });

    q0points.forEach((point) => {
      point.draw(ctx);
    });

    q1points.forEach((point) => {
      point.draw(ctx);
    });

    m1points.forEach((point) => {
      point.draw(ctx);
    });

    ctx.beginPath();
    bezierCurvePoints.forEach((point, index) => {
      if (index === 0) {
        ctx.moveTo(point.x, point.y);
      } else {
        ctx.lineTo(point.x, point.y);
      }
    });
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

    updatePoints(delta);
    drawPoints();
  }

  requestAnimationFrame(draw);
};
