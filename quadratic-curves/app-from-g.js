import utils from "../shared/utils.js";

window.onload = function () {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  ctx.strokeStyle = "#E6E1E3";
  ctx.lineWidth = 5;
  let previousTime = 0;

  // Опорні точки
  const startPoint   = { x: 50,  y: 300 };
  const control1     = { x: 150, y: 50  };
  const control2     = { x: 250, y: 300 };
  const control3     = { x: 350, y: 200 };
  const endPoint     = { x: 550, y: 300 };

  // Масив, де перша й остання точки — кінцеві, а всі між ними — контрольні "магніти"
  const points = [startPoint, control1, control2, control3, endPoint];

  // Виносимо малювання в окрему функцію, щоб викликати її в анімації
  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Очищаємо екран перед кожним кадром

    let i = 1;
    // Цикл іде по контрольних точках, зупиняючись за дві точки до кінця
    for (i = 1; i < points.length - 2; i++) {
      const currentCtrl = points[i];
      const nextCtrl = points[i + 1];
      
      // Знаходимо точку стику (середину між контрольними)
      const midpoint = utils.getMidpoint(currentCtrl, nextCtrl);

      // Визначаємо початкову точку для цієї ділянки
      // Якщо це перша крива — стартуємо з points[0], інакше — з попередньої середини
      const start = (i === 1) ? points[0] : utils.getMidpoint(points[i - 1], currentCtrl);

      const curvePoints = utils.generateQuadraticCurvePoints(
        start,
        currentCtrl,
        midpoint,
        20 // 20 кроків дадуть кращу плавність, ніж 10
      );
      utils.drawLineFromPoints(ctx, curvePoints);
    }

    // З'єднуємо останню ділянку: від передостанньої середини до фінальної точки
    const lastStart = utils.getMidpoint(points[i - 1], points[i]);
    const lastCurve = utils.generateQuadraticCurvePoints(
      lastStart,
      points[i], // передостання точка як контрольна
      points[i + 1], // остання точка як фінал
      20
    );
    utils.drawLineFromPoints(ctx, lastCurve);
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

    // Викликаємо рендер кожного кадру (це знадобиться, коли точки почнуть рухатися)
    render();
  }

  requestAnimationFrame(draw);
};
