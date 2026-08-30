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

  const pointsNumber = 20;

  let points = [];
  let newPoints = [];

  let radius = 120;

  let pointsAnimation = [];

  let rangeX = 200;
  let rangeY = 20;

  generatePoints();

  let selectedPoint = null;
  const offset = { x: 0, y: 0 };

  // Створюємо HTML5 відео-елемент у пам'яті
  const video = document.createElement("video");
  video.src = "./video.mp4"; // 👈 ЗАМІНІТЬ НА ШЛЯХ ДО ВАШОГО ВІДЕО
  video.muted = true;
  video.loop = true;
  video.playsInline = true;

  // Браузери вимагають взаємодії з користувачем для запуску відео
  window.addEventListener(
    "click",
    () => {
      video
        .play()
        .catch((err) => console.log("Чекаємо на запуск відео...", err));
    },
    { once: true },
  );

  function generatePoints() {
    points = [];
    newPoints = [];
    pointsAnimation = [];

    for (let i = 0; i < pointsNumber; i++) {
      const stepAngle = (Math.PI * 2) / pointsNumber;

      const p = {
        x:
          canvas.width / 2 +
          Math.cos(i * stepAngle + Math.PI / 4) *
            (radius + Math.random() + rangeX),
        y:
          canvas.height / 2 +
          Math.sin(i * stepAngle + Math.PI / 4) *
            (radius + Math.random() + rangeY),
      };

      points.push(
        new Point({
          point: p,
        }),
      );

      pointsAnimation.push({
        range: Math.random() * 20,
        angle: 0,
        speed: Math.random() * Math.PI,
      });
    }

    points.forEach((point) => {
      newPoints.push(
        new Point({
          point: point,
          radius: 10,
          color: "#4d4d4d",
        }),
      );

      // push mid point
      newPoints.push(
        new Point({
          point: {},
          color: "#4d4d4d",
          radius: 6,
          steps: 4,
        }),
      );
    });
  }

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

    // points.forEach((point, index) => {
    //   point.update(delta);
    // });

    let count = 0;

    for (let i = 0; i <= newPoints.length - 2; i += 2) {
      const angle = Math.atan2(
        points[count].y - canvas.height / 2,
        points[count].x - canvas.width / 2,
      );
      newPoints[i].x =
        points[count].x +
        Math.cos(angle) *
          (Math.sin(pointsAnimation[count].angle) *
            pointsAnimation[count].range);
      newPoints[i].y =
        points[count].y +
        Math.sin(angle) *
          (Math.sin(pointsAnimation[count].angle) *
            pointsAnimation[count].range);

      let nextMidPoint = null;

      if (i == newPoints.length - 2) {
        nextMidPoint = utils.getMidpoint(newPoints[i], newPoints[0]);
        newPoints[i + 1].x = nextMidPoint.x;
        newPoints[i + 1].y = nextMidPoint.y;
      } else {
        nextMidPoint = utils.getMidpoint(newPoints[i], newPoints[i + 2]);
        newPoints[i + 1].x = nextMidPoint.x;
        newPoints[i + 1].y = nextMidPoint.y;
      }

      count++;
    }

    newPoints.forEach((point, index) => {
      point.update(delta);
    });

    for (let i = 0; i <= newPoints.length - 2; i += 2) {
      if (i == 0) {
        const bezierPoints = utils.getAdaptiveBezierPath(
          newPoints[newPoints.length - 1],
          newPoints[i],
          newPoints[i + 1],
        );
        bezierCurvePoints.push(...bezierPoints);
      } else {
        const bezierPoints = utils.getAdaptiveBezierPath(
          newPoints[i - 1],
          newPoints[i],
          newPoints[i + 1],
        );
        bezierCurvePoints.push(...bezierPoints);
      }
    }
  }

  function drawPoints() {
    // 1. Спочатку створюємо маску та малюємо відео всередині сплайну
    if (bezierCurvePoints.length > 0) {
      ctx.save(); // Зберігаємо чистий стан контексту

      ctx.beginPath();
      ctx.moveTo(bezierCurvePoints[0].x, bezierCurvePoints[0].y);
      for (let i = 1; i < bezierCurvePoints.length; i++) {
        ctx.lineTo(bezierCurvePoints[i].x, bezierCurvePoints[i].y);
      }
      ctx.closePath();

      ctx.clip(); // Обрізаємо canvas за контуром сплайну

      // Малюємо поточний кадр відео, якщо дані вже завантажились
      if (video.readyState >= video.HAVE_CURRENT_DATA) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      } else {
        // Фоновий колір, поки відео завантажується або чекає на клік
        ctx.fillStyle = "#333333";
        ctx.fill();
      }

      ctx.restore(); // Повертаємо контекст до початкового стану (скасовуємо clip)
    }

    // 2. Малюємо контур лінії сплайну поверх відео
    utils.drawLineFromPoints(ctx, bezierCurvePoints);

    // 3. Малюємо інтерактивні точки керування поверх усього
    newPoints.forEach((point) => {
      point.draw(ctx);
    });
  }

  function drawVerticalLines(pointsNumber) {
    const stepWidth = canvas.width / pointsNumber;
    const height = canvas.height;

    ctx.save();
    ctx.strokeStyle = colors[6];
    ctx.setLineDash([10, 20]);
    for (let i = 0; i <= pointsNumber; i++) {
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

    pointsAnimation.forEach((p) => {
      p.angle += p.speed * delta;
    });
  }

  requestAnimationFrame(draw);
};
