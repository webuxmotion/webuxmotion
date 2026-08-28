window.onload = function () {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  ctx.strokeStyle = "#E6E1E3";
  ctx.lineWidth = 5;
  let previousTime = 0;

  const colors = [
    "#FF0055", // Яскраво-рожевий / Маджента
    "#00FF66", // Неоновий зелений
    "#00E5FF", // Електрик блю / Циан
    "#FFCC00", // Сонячно-жовтий
    "#9900FF", // Насичений фіолетовий
    "#FF5500", // Вогняно-помаранчевий
    "#FF00AA", // Яскрава фуксія
    "#00FFCC", // М'ятний неоновий
    "#7FFF00", // Лаймовий
    "#4D4DFF", // Яскраво-синій
  ];

  // other params
  const centerY = canvas.height / 2;
  const xSpeed = 500;
  const ySpeed = Math.PI * 2 * 2;
  const range = 50;
  let angle = 0;
  let xPos = 0;
  let yPos = centerY;
  let clearRectWidth = 0;

  function draw(currentTime) {
    requestAnimationFrame(draw);
    if (previousTime === null) {
      previousTime = currentTime;
      return;
    }
    let delta = (currentTime - previousTime) / 1000;
    if (delta > 0.1) delta = 0.1;
    previousTime = currentTime;

    if (xPos > canvas.width) {
      clearRectWidth += xSpeed * delta;
      ctx.clearRect(0, 0, clearRectWidth, canvas.height);

      if (clearRectWidth > canvas.width) {
        xPos = 0;
        clearRectWidth = 0;

        ctx.strokeStyle = colors[Math.floor(Math.random() * colors.length)];
      }
    } else {
      // some math
      ctx.beginPath();
      ctx.moveTo(xPos, yPos);

      angle += ySpeed * delta;
      xPos += xSpeed * delta;
      yPos = centerY + Math.sin(angle) * range;

      ctx.lineTo(xPos, yPos);
      ctx.stroke();
    }
  }

  requestAnimationFrame(draw);
};
