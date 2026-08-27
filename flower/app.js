const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// 1. Малюємо пелюстку за допомогою кривих Безьє
ctx.beginPath();
ctx.moveTo(300, 200); // Початок (основа пелюстки)
ctx.bezierCurveTo(250, 100, 350, 50, 400, 100); // Ліва сторона та кінчик
ctx.bezierCurveTo(450, 150, 350, 250, 300, 200); // Права сторона назад до основи
ctx.closePath();

// 2. Створюємо градієнт (від бірюзового до білого)
const gradient = ctx.createLinearGradient(300, 200, 400, 100);
gradient.addColorStop(0, '#5eead4'); // Бірюзовий
gradient.addColorStop(0.6, '#e2f8f5'); // Світло-блакитний
gradient.addColorStop(1, '#ffffff'); // Білий

ctx.fillStyle = gradient;
ctx.fill();

// 3. Накладання ефекту зернистості (Шум)
// Отримуємо пікселі намальованої області
const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
const data = imageData.data;

// Проходимо по кожному пікселю
for (let i = 0; i < data.length; i += 4) {
    // Пропускаємо повністю прозорі пікселі (де немає пелюстки)
    if (data[i + 3] === 0) continue;

    // Генеруємо випадковий шум (-25 до +25 до яскравості пікселя)
    const noise = (Math.random() - 0.5) * 50;

    data[i]     = Math.min(255, Math.max(0, data[i] + noise));     // Червоний
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise)); // Зелений
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise)); // Синій
}

// Повертаємо змінені пікселі з шумом назад на полотно
ctx.putImageData(imageData, 0, 0);
