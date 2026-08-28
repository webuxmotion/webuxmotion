window.onload = function () {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  ctx.strokeStyle = "#E6E1E3";
  ctx.fillStyle = "#E6E1E3";
  let previousTime = 0;

  // other params
  let points = [];
  const numPoints = 9;

  const ctrlPoint = {};

  generatePointsAndDraw();

  function draw(currentTime) {
    requestAnimationFrame(draw);
    if (previousTime === null) {
      previousTime = currentTime;
      return;
    }
    let delta = (currentTime - previousTime) / 1000;
    if (delta > 0.1) delta = 0.1;
    previousTime = currentTime;
    //ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  function generatePointsAndDraw() {
    points = [];

    for (var i = 0; i < numPoints; i++) {
      points.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
      });
    }

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[1].y);

    for (i = 1; i < numPoints; i += 2) {
      ctx.quadraticCurveTo(
        points[i].x,
        points[i].y,
        points[i + 1].x,
        points[i + 1].y,
      );
    }
    ctx.stroke();

    ctx.save();
    ctx.strokeStyle = "red";

    //move to the first point
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[1].y);

    for (i = 1; i < numPoints - 2; i++) {
      ctrlPoint.x = (points[i].x + points[i + 1].x) / 2;
      ctrlPoint.y = (points[i].y + points[i + 1].y) / 2;
      ctx.quadraticCurveTo(
        points[i].x,
        points[i].y,
        ctrlPoint.x,
        ctrlPoint.y,
      );
    }
    //curve through the last two points
    ctx.quadraticCurveTo(
      points[i].x,
      points[i].y,
      points[i + 1].x,
      points[i + 1].y,
    );
    ctx.stroke();
    ctx.restore();
  }

  setInterval(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    generatePointsAndDraw();
  }, 100);

  canvas.addEventListener("mousedown", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    generatePointsAndDraw();
  });

  requestAnimationFrame(draw);
};
