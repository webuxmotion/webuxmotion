import initHeroTracker from './events.js';
initHeroTracker();

function setCanvasFavicon() {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");

  if (!ctx) return;

  ctx.fillStyle = "#8fd462"; // Синій колір

  ctx.fillRect(0, 0, 10, 64);
  ctx.fillRect(64 - 10, 0, 10, 64);

  ctx.beginPath();
  ctx.arc(32, 32, 12, 0, 2 * Math.PI);
  ctx.fill();

  const faviconUrl = canvas.toDataURL("image/png");

  const faviconLink = document.getElementById("dynamic-favicon");
  if (faviconLink) {
    faviconLink.href = faviconUrl;
  }
}

const titleAnimation = {
  tick: 1,
  text: "WEBUXMOTION",
};

function updateTitle() {
  const frames = [
    ["o", "o"], // tick 0
    ["O", "o"], // tick 1
    ["O", "O"], // tick 2
    ["o", "O"], // tick 3
  ];

  titleAnimation.text =
    titleAnimation.text.slice(0, 6) +
    frames[titleAnimation.tick][0] +
    titleAnimation.text.slice(7, 9) +
    frames[titleAnimation.tick][1] +
    titleAnimation.text.slice(10);

  document.title = titleAnimation.text;

  titleAnimation.tick = (titleAnimation.tick + 1) % 4;
}

setCanvasFavicon();
setInterval(updateTitle, 250);
