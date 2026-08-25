import Arrow from "./Arrow.js";

window.onload = function () {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const arrow = new Arrow();

  arrow.x = canvas.width / 2;
  arrow.y = canvas.height / 2;

  arrow.setPoints();
  arrow.draw(ctx);
};
