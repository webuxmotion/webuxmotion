const texts = [];

export default function mouseMoveTexts(event, hero) {
  if (texts.length < 1000) {
    const item = {
      text: "mousemove",
      x: event.clientX,
      y: event.clientY
    };

    const el = document.createElement("p");
    el.style.position = 'absolute';
    el.style.top = event.clientY + 'px';
    el.style.left = event.clientX + 'px';
    el.textContent = item.text;
    el.style.color = "#ffffff";
    hero.prepend(el);

    texts.push(el);
  } else {
    texts[0].remove();
    texts.shift();
  }
}