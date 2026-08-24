export default function keysEvents(hero) {
  renderKeyboard(hero);

  window.addEventListener(
    "keydown",
    (event) => {
      // Ігноруємо натискання системних клавіш (наприклад, Shift, Enter)
      const pressedKey = event.key.toLowerCase();

      // 2. Створюємо випадкову літеру, що падає/з'являється на екрані
      const el = document.createElement("p");
      el.textContent = event.key;
      el.style.position = "absolute";
      el.style.fontSize = "40px";
      el.style.margin = "0";
      el.style.color = "#2D2E2A";
      el.style.top = Math.floor(Math.random() * document.body.clientHeight) + "px";
      el.style.left = Math.floor(Math.random() * document.body.clientWidth) + "px";
      hero.prepend(el);

      // 3. Підсвічуємо натиснуту клавішу на віртуальній клавіатурі
      highlightKey(pressedKey);
    },
    false,
  );
}

// Функція для одноразового рендерингу клавіатури
function renderKeyboard(hero) {
  const keyWidth = 60;
  const keyPadding = 8;
  const screenWidth = document.body.clientWidth;

  const keys = [
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
    ["z", "x", "c", "v", "b", "n", "m"],
  ];

  keys.forEach((row, rowIndex) => {
    const length = row.length;
    const paddingCount = length - 1;
    const firstLetterPositionX = (screenWidth - (length * keyWidth + paddingCount * keyPadding)) / 2;

    row.forEach((letter, letterIdx) => {
      const el = document.createElement("div");
      
      el.id = `key-${letter}`; 
      
      el.style.position = "absolute";
      el.style.width = keyWidth + "px";
      el.style.height = keyWidth + "px";
      el.style.border = "1px solid white";
      el.style.color = "white";
      el.style.fontSize = '30px';
      el.style.backgroundColor = '#8FD462';
      el.style.transition = 'scale 0.1s';
      el.style.display = 'inline-flex';
      el.style.alignItems = 'center';
      el.style.boxShadow = "0px 0px 70px 0px rgba(0, 0, 0, 0.46)";
      el.style.justifyContent = 'center';
      el.style.bottom = 300 - (rowIndex * 70) + "px";
      el.style.left = firstLetterPositionX + letterIdx * (keyWidth + keyPadding) + 'px';
      el.textContent = letter;

      hero.append(el);
    });
  });
}

// Функція для підсвічування клавіші
function highlightKey(letter) {
  const keyElement = document.getElementById(`key-${letter}`);
  
  if (keyElement) {
    // Змінюємо стиль на активний
    // keyElement.style.backgroundColor = "white";
    // keyElement.style.color = "black";
    keyElement.style.scale = '0.9';
    keyElement.style.boxShadow = "0px 0px 30px 0px rgba(0, 0, 0, 0.6)";

    // Повертаємо початковий стиль через 150мс
    setTimeout(() => {
      keyElement.style.scale = '1';
      keyElement.style.boxShadow = "0px 0px 70px 0px rgba(0, 0, 0, 0.46)";
    }, 150);
  }
}
