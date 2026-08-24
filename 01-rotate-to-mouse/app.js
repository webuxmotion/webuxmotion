import Arrow from "../shared/arrow.js";
import utils from "../shared/utils.js";

window.onload = function () {
  let canvas = document.getElementById("canvas"),
    context = canvas.getContext("2d"),
    mouse = utils.captureMouse(canvas),
    arrow = new Arrow();
  arrow.x = canvas.width / 2;
  arrow.y = canvas.height / 2;

  (function drawFrame() {
    window.requestAnimationFrame(drawFrame, canvas);
    context.clearRect(0, 0, canvas.width, canvas.height);
    let dx = mouse.x - arrow.x,
      dy = mouse.y - arrow.y;
    arrow.rotation = Math.atan2(dy, dx); //radians
    arrow.draw(context);

    context.font = "20px Arial";
    context.fillStyle = "#ffffff";
    context.lineWidth = 1;

    context.fillText(
      "dx (mouse.x - arrow.x): " + Math.trunc(dx) + "px",
      20,
      40,
    );

    drawLine(
      {
        x: arrow.x,
        y: arrow.y,
      },
      {
        x: mouse.x,
        y: mouse.y,
      },
    );

    drawLine(
      {
        x: mouse.x,
        y: mouse.y,
      },
      {
        x: mouse.x,
        y: arrow.y,
      },
    );

    drawLine(
      {
        x: arrow.x,
        y: arrow.y,
      },
      {
        x: mouse.x,
        y: arrow.y,
      },
    );
  })();

  function drawLine(a, b) {
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(a.x, a.y);
    context.lineTo(b.x, b.y);
    context.closePath();
    context.strokeStyle = "#ffffff";
    context.stroke();
  }
};
