import Arrow from "./Arrow.js";
import utils from "../shared/utils.js";

window.onload = function () {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const arrow = new Arrow();
  const mouse = utils.captureMouse(canvas);

  arrow.x = canvas.width / 2;
  arrow.y = canvas.height / 2;

  // Ви можете змінити радіус фаски тут (0 - гострі кути, більше значення - кругліші)

  const bgImage = new Image();
  bgImage.src = "./image.png";

  // Розраховуємо точки один раз при старті
  arrow.setPoints();

  (function drawFrame() {
    window.requestAnimationFrame(drawFrame);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (bgImage.complete) {
      ctx.save();           
      ctx.globalAlpha = 0.3; 
      ctx.drawImage(bgImage, 180, 165, bgImage.width / 3.7, bgImage.height / 3.7); 
      ctx.restore();        
    }

    const dx = mouse.x - arrow.x;
    const dy = mouse.y - arrow.y;

    if (mouse.event) {
      arrow.rotation = Math.atan2(dy, dx);
    } else {
      arrow.rotation = arrow.degToRad(-30);
    }

    arrow.draw(ctx);
  })();
};
