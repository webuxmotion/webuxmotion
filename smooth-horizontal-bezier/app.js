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

  const linesNumber = 9;

  let points = [];
  let newPoints = [];

  generatePoints();

  let selectedPoint = null;
  const offset = { x: 0, y: 0 };

  function generatePoints() {
    points = [];
    newPoints = [];

    for (let i = 0; i <= linesNumber - 1; i++) {
      const stepWidth = canvas.width / (linesNumber - 1);

      const p = {
        x: i * stepWidth,
        y: Math.random() * canvas.height,
      };

      points.push(
        new Point({
          point: p,
          color: colors[1],
        }),
      );
    }

    points.forEach((point, index) => {
      newPoints.push(
        new Point({
          point: point,
          color: colors[1],
          radius: 20,
        }),
      );

      // push mid point
      if (index !== points.length - 1) {
        newPoints.push(
          new Point({
            point: {},
            color: colors[2],
            radius: 6,
          }),
        );
      }
    });
  }

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

    let count = 1;

    for (let i = 2; i < newPoints.length - 2; i += 2) {
      if (count == 1) {
        newPoints[i - 2].color = "red";
        newPoints[i - 2].x = points[count - 1].x;
        newPoints[i - 2].y = points[count - 1].y;
      }

      if (count == points.length - 2) {
        newPoints[i + 2].color = "red";
        newPoints[i + 2].x = points[points.length - 1].x;
        newPoints[i + 2].y = points[points.length - 1].y;
      }

      newPoints[i].color = "blue";
      newPoints[i].x = points[count].x;
      newPoints[i].y = points[count].y;

      const prevMidPoint = utils.getMidpoint(newPoints[i], newPoints[i - 2]);
      const nextMidPoint = utils.getMidpoint(newPoints[i], newPoints[i + 2]);
      newPoints[i - 1].x = prevMidPoint.x;
      newPoints[i - 1].y = prevMidPoint.y;
      newPoints[i + 1].x = nextMidPoint.x;
      newPoints[i + 1].y = nextMidPoint.y;


      count++;
    }

    newPoints.forEach((point, index) => {
      point.update(delta);
    });

    for (let i = 2; i < newPoints.length - 2; i += 2) {
      const bezierPoints = utils.getAdaptiveBezierPath(
        newPoints[i - 1],
        newPoints[i],
        newPoints[i + 1],
      );
      bezierCurvePoints.push(...bezierPoints);
    }
  }

  function drawPoints() {
    ctx.save();
    ctx.strokeStyle = colors[7];
    utils.drawLineFromPoints(ctx, points);
    ctx.restore();

    newPoints.forEach((point) => {
      point.draw(ctx);
    });

    drawVerticalLines(linesNumber);

    utils.drawLineFromPoints(ctx, bezierCurvePoints);
  }

  function drawVerticalLines(linesNumber) {
    const stepWidth = canvas.width / (linesNumber - 1);
    const height = canvas.height;

    ctx.save();
    ctx.strokeStyle = colors[6];
    ctx.setLineDash([10, 20]);
    for (let i = 0; i <= linesNumber - 1; i++) {
      ctx.beginPath();
      ctx.moveTo(stepWidth * i, 0);
      ctx.lineTo(stepWidth * i, height);
      ctx.stroke();
    }
    ctx.restore();
  }

  canvas.addEventListener("dblclick", () => {
    generatePoints();
  });

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
