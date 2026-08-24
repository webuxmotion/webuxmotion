export default function keysEvents(hero) {
  window.addEventListener('keydown', (event) => {
    const el = document.createElement('p');
    el.textContent = event.key;
    el.style.position = 'absolute';
    el.style.fontSize = '40px';
    el.style.margin = 0;
    el.style.color = '#2D2E2A';

    el.style.top = Math.floor(Math.random() * document.body.clientHeight) + 'px';
    el.style.left = Math.floor(Math.random() * document.body.clientWidth) + 'px';

    hero.prepend(el);
  }, false);

  const randNums = {};
}