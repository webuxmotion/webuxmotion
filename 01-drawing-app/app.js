import utils from "../shared/utils.js";

window.onload = function () {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const mouse = utils.captureMouse(canvas);
  ctx.strokeStyle = "#E6E1E3";
  ctx.fillStyle = "#E6E1E3";
  let previousTime = 0;

  let P0 = {
    x: canvas.width / 2,
    y: 0,
  };
  let P2 = {
    x: canvas.width / 2,
    y: canvas.height,
  };

  function onMouseMove() {
    ctx.beginPath();
    ctx.lineTo(mouse.x, mouse.y);
    ctx.stroke();

    let P1 = {
      x: mouse.x * 2 - (P0.x + P2.x) / 2,
      y: mouse.y * 2 - (P0.y + P2.y) / 2
    };
    ctx.beginPath();
    ctx.moveTo(P0.x, P0.y);
    ctx.quadraticCurveTo(P1.x, P1.y, P2.x, P2.y);
    ctx.stroke();
  }
  canvas.addEventListener(
    "mousedown",
    function () {
      ctx.moveTo(mouse.x, mouse.y);
      canvas.addEventListener("mousemove", onMouseMove, false);
    },
    false,
  );
  canvas.addEventListener(
    "mouseup",
    function () {
      canvas.removeEventListener("mousemove", onMouseMove, false);
    },
    false,
  );

  canvas.addEventListener("mousemove", function () {}, false);
};
