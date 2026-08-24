export default function initHeroTracker(mouseMoveTexts) {
  const hero = document.querySelector(".js-hero");
  const mouse = {
    x: 0,
    y: 0,
  };

  if (!hero) return;

  const xPosText = document.createElement("p");
  xPosText.style.position = "absolute";
  xPosText.style.color = "white";
  xPosText.style.fontSize = "70px";
  xPosText.style.margin = "0";
  xPosText.style.opacity = 0.3;
  xPosText.style.border = "1px solid white";
  xPosText.style.transformOrigin = "top left";
  hero.prepend(xPosText);

  const yPosText = document.createElement("p");
  yPosText.style.position = "absolute";
  yPosText.style.color = "white";
  yPosText.style.fontSize = "70px";
  yPosText.style.margin = "0";
  yPosText.style.opacity = 0.3;
  yPosText.style.border = "1px solid white";
  yPosText.style.transformOrigin = "top left";
  hero.prepend(yPosText);

  const xPos = {
    x: 0,
    y: 0,
  };

  const yPos = {
    x: 0,
    y: 0,
  };

  const circleSize = 200;
  const circle = document.createElement("div");
  circle.style.position = "absolute";
  circle.style.width = circleSize + "px";
  circle.style.height = circleSize + "px";
  circle.style.borderRadius = circleSize + "px";
  circle.style.backgroundColor = "#8fd462";
  circle.style.transition = "scale 0.3s ease";
  circle.style.boxShadow = "0px 0px 70px 0px rgba(0, 0, 0, 0.46)";
  hero.prepend(circle);

  const divVertical = document.createElement("div");
  divVertical.style.width = "1px";
  divVertical.style.position = "absolute";
  divVertical.style.top = 0;
  divVertical.style.height = "100%";
  divVertical.style.backgroundColor = "white";
  hero.prepend(divVertical);

  const divHorizontal = document.createElement("div");
  divHorizontal.style.width = "100%";
  divHorizontal.style.position = "absolute";
  divHorizontal.style.left = 0;
  divHorizontal.style.height = "1px";
  divHorizontal.style.backgroundColor = "white";
  hero.prepend(divHorizontal);

  hero.addEventListener(
    "mousemove",
    function (event) {
      mouse.x = event.clientX;
      mouse.y = event.clientY;

      mouseMoveTexts(event, hero);

      divVertical.style.left = event.clientX + "px";
      divHorizontal.style.top = event.clientY + "px";

      circle.style.left = event.clientX - circleSize / 2 + "px";
      circle.style.top = event.clientY - circleSize / 2 + "px";

      xPos.x = event.clientX;
      xPos.y = event.clientY - 300;

      if (xPos.x + xPosText.offsetWidth > document.body.offsetWidth) {
        xPos.x = document.body.offsetWidth - xPosText.offsetWidth;
      }

      if (xPos.y < 0) {
        xPos.y = 0;
      }

      xPosText.textContent = "x: " + event.clientX;
      xPosText.style.left = xPos.x + "px";
      xPosText.style.top = xPos.y + "px";
      xPosText.style.whiteSpace = "nowrap";

      yPos.x = event.clientX + 300;
      yPos.y = event.clientY;

      if (yPos.x + yPosText.offsetHeight > document.body.offsetWidth) {
        yPos.x = document.body.offsetWidth - yPosText.offsetHeight;
      }

      if (yPos.y - xPosText.offsetHeight - yPosText.offsetWidth < 0 && xPos.x + xPosText.offsetWidth > yPos.x) {
        yPos.y = yPosText.offsetWidth + xPosText.offsetHeight;
      } else if (yPos.y - yPosText.offsetWidth < 0) {
        yPos.y = yPosText.offsetWidth;
      }

      yPosText.textContent = "y: " + event.clientY;
      yPosText.style.left = yPos.x + "px";
      yPosText.style.top = yPos.y + "px";
      yPosText.style.whiteSpace = "nowrap";
      yPosText.style.transform = "rotate(-90deg)";
      yPosText.style.textAlign = "left";
    },
    false,
  );

  hero.addEventListener(
    "mousedown",
    function (event) {
      circle.style.scale = "0.5";
    },
    false,
  );

  hero.addEventListener(
    "mouseup",
    function (event) {
      setTimeout(() => {
        circle.style.scale = "1";
      }, 50);
    },
    false,
  );
}
