import utils from "../shared/utils.js";

window.onload = function () {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  ctx.strokeStyle = "#E6E1E3";
  ctx.lineWidth = 1;
  let previousTime = 0;

  // Задаємо кількість кривих, яку хочемо отримати (наприклад, 4 криві)
  const numCurves = 4;
  // Рахуємо скільки для цього треба точок: 1 (старт) + 2 * кількість кривих
  const numPoints = 1 + numCurves * 2; // Для 4 кривих це буде 9 точок

  const points = [];

  // for (let i = 0; i < numPoints; i++) {
  //   points.push({
  //     // Math.random() генерує випадкове число від 0 до 1
  //     x: Math.random() * canvas.width,
  //     y: Math.random() * canvas.height,
  //   });
  // }

  for (let i = 0; i < numPoints; i++) {
    points.push({
      // Кожна наступна точка гарантовано буде правіше попередньої
      x: i * (canvas.width / (numPoints - 1)) + (Math.random() * 20 - 10),
      // Висота залишається повністю випадковою, але з відступами від країв canvas
      y: 50 + Math.random() * (canvas.height - 100),
    });
  }

  // const startPoint = { x: 50, y: 300 };
  // const controlPoint = { x: 150, y: 50 };
  // const endPoint = { x: 250, y: 300 };
  // const controlPoint2 = { x: 350, y: 200 };
  // const endPoint2 = { x: 550, y: 300 };

  // const points = [startPoint, controlPoint, endPoint, controlPoint2, endPoint2];

  const smoothPoints = [];
  points.forEach((point, index) => {
    if (
      index === 0 ||
      index === points.length - 2 ||
      index === points.length - 1
    ) {
      smoothPoints.push(point);
    } else {
      smoothPoints.push(point);
      smoothPoints.push(utils.getMidpoint(point, points[index + 1]));
    }
  });

  smoothPoints.forEach((point, index) => {
    smoothPoints[index].range = Math.random() * 100 - 50;
    smoothPoints[index].angle = 0;
    smoothPoints[index].speed = Math.random() * Math.PI * 2;
  });

  function render(delta) {
    for (let i = 1; i < smoothPoints.length - 1; i += 2) {
      const curvePoints = utils.generateQuadraticCurvePoints(
        smoothPoints[i - 1],
        {
          x: smoothPoints[i].x,
          y: smoothPoints[i].y + Math.sin(smoothPoints[i].angle) * smoothPoints[i].range,
        },
        smoothPoints[i + 1],
        80,
      );
      smoothPoints[i].angle += smoothPoints[i].speed * delta;
      utils.drawLineFromPoints(ctx, curvePoints);
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

    render(delta);
  }

  requestAnimationFrame(draw);
};
