const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const W = canvas.width;
const H = canvas.height;

// Перемикач стану: true — користувач тягне точку (шум вимкнено), false — статичний стан (шум накладається)
let isDragging = false; 

// ==========================================
// КООРДИНАТИ ТОЧОК ДЛЯ КЕРУВАННЯ
// ==========================================
const points = {
    backLeaf: [
        { x: 100, y: 200 },
        { x: 200, y: -100 }, { x: 700, y: -20 }, { x: 640, y: 350 },
        { x: 600, y: 500 }, { x: 400, y: 550 }, { x: 200, y: 450 }
    ],
    frontLeaf: [
        { x: 0, y: 512 },
        { x: 180, y: 400 }, { x: 450, y: 220 }, { x: 0, y: 150 },
        { x: 150, y: 200 }, { x: 300, y: 320 }, { x: 440, y: 500 }
    ],
    smallLeaf: [
        { x: 600, y: 512 },
        { x: 610, y: 400 }, { x: 680, y: 360 }, { x: 780, y: 420 },
        { x: 740, y: 480 }, { x: 700, y: 512 }, { x: 650, y: 512 }
    ]
};

let selectedPoint = null;
const pointRadius = 8;

// ==========================================
// ГОЛОВНА ФУНКЦІЯ МАЛЮВАННЯ СЦЕНИ
// ==========================================
function drawScene() {
    ctx.clearRect(0, 0, W, H);

    // 1. ФОН
    ctx.fillStyle = '#e2e765';
    ctx.fillRect(0, 0, W, H);

    const bgGrad = ctx.createRadialGradient(0, 0, 50, 200, 100, 500);
    bgGrad.addColorStop(0, '#f1ebd7');
    bgGrad.addColorStop(1, 'rgba(241, 235, 215, 0)');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // 2. ЗАДНЄ КРУГЛЕ ЛИСТЯ
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(points.backLeaf[0].x, points.backLeaf[0].y);
    ctx.bezierCurveTo(points.backLeaf[1].x, points.backLeaf[1].y, points.backLeaf[2].x, points.backLeaf[2].y, points.backLeaf[3].x, points.backLeaf[3].y);
    ctx.bezierCurveTo(points.backLeaf[4].x, points.backLeaf[4].y, points.backLeaf[5].x, points.backLeaf[5].y, points.backLeaf[6].x, points.backLeaf[6].y);
    ctx.closePath();
    const backLeafGrad = ctx.createRadialGradient(450, 180, 50, 400, 250, 400);
    backLeafGrad.addColorStop(0, '#75c43d');
    backLeafGrad.addColorStop(0.6, '#289d62');
    backLeafGrad.addColorStop(1, '#176c4b');
    ctx.fillStyle = backLeafGrad;
    ctx.fill();
    ctx.restore();

    // 3. МАЛЕНЬКЕ ЛИСТЯ ПІД КВІТКОЮ
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(points.smallLeaf[0].x, points.smallLeaf[0].y);
    ctx.bezierCurveTo(points.smallLeaf[1].x, points.smallLeaf[1].y, points.smallLeaf[2].x, points.smallLeaf[2].y, points.smallLeaf[3].x, points.smallLeaf[3].y);
    ctx.bezierCurveTo(points.smallLeaf[4].x, points.smallLeaf[4].y, points.smallLeaf[5].x, points.smallLeaf[5].y, points.smallLeaf[6].x, points.smallLeaf[6].y);
    ctx.closePath();
    const smallLeafGrad = ctx.createLinearGradient(600, 512, 780, 420);
    smallLeafGrad.addColorStop(0, '#1c7849');
    smallLeafGrad.addColorStop(0.6, '#5da835');
    smallLeafGrad.addColorStop(1, '#a6cd39');
    ctx.fillStyle = smallLeafGrad;
    ctx.fill();
    ctx.restore();

    // 4. ВЕЛИКЕ ПЕРЕДНЄ ЛИСТЯ
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(points.frontLeaf[0].x, points.frontLeaf[0].y);
    ctx.bezierCurveTo(points.frontLeaf[1].x, points.frontLeaf[1].y, points.frontLeaf[2].x, points.frontLeaf[2].y, points.frontLeaf[3].x, points.frontLeaf[3].y);
    ctx.closePath();
    const frontLeafGrad = ctx.createRadialGradient(80, 300, 30, 150, 350, 350);
    frontLeafGrad.addColorStop(0, '#b6d137');
    frontLeafGrad.addColorStop(0.4, '#44b478');
    frontLeafGrad.addColorStop(0.8, '#1e8e63');
    frontLeafGrad.addColorStop(1, '#135c3c');
    ctx.fillStyle = frontLeafGrad;
    ctx.fill();

    // Прожилка переднього листя
    ctx.beginPath();
    ctx.moveTo(points.frontLeaf[3].x, points.frontLeaf[3].y);
    ctx.bezierCurveTo(points.frontLeaf[4].x, points.frontLeaf[4].y, points.frontLeaf[5].x, points.frontLeaf[5].y, points.frontLeaf[6].x, points.frontLeaf[6].y);
    ctx.lineWidth = 12;
    ctx.strokeStyle = '#61ca7a';
    ctx.stroke();
    ctx.restore();

    // 5. КВІТКА
    drawStaticFlower();

    // 6. НАКЛАДАННЯ ЗЕРНИСТОСТІ (Тільки коли мишка не рухає об'єкт)
    if (!isDragging) {
        applyGrainEffect(24); // 24 — інтенсивність зерна
    }

    // 7. МАЛЮВАННЯ ВЕКТОРНОГО КАРКАСУ ДЛЯ РЕДАГУВАННЯ
    drawControlPoints();
}

function drawStaticFlower() {
    const flowerX = 880, flowerY = 280, numPetals = 16;
    for (let i = 0; i < numPetals; i++) {
        const angle = (i * 2 * Math.PI) / numPetals;
        ctx.save();
        ctx.translate(flowerX, flowerY);
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-35, -70, -45, -170, 0, -190);
        ctx.bezierCurveTo(45, -170, 35, -70, 0, 0);
        ctx.closePath();
        const petalGrad = ctx.createLinearGradient(0, 0, 0, -190);
        petalGrad.addColorStop(0, '#59d6be');
        petalGrad.addColorStop(1, '#ffffff');
        ctx.fillStyle = petalGrad;
        ctx.fill();
        ctx.restore();
    }
}

// ==========================================
// АЛГОРИТМ ГЕНЕРАЦІЇ ШУМУ (GRAIN EFFECT)
// ==========================================
function applyGrainEffect(intensity) {
    const imageData = ctx.getImageData(0, 0, W, H);
    const pixels = imageData.data;

    for (let i = 0; i < pixels.length; i += 4) {
        // Рандомний шум для кожного пікселя
        const noise = (Math.random() - 0.5) * intensity;
        
        pixels[i]     = Math.min(255, Math.max(0, pixels[i] + noise));     // R
        pixels[i + 1] = Math.min(255, Math.max(0, pixels[i + 1] + noise)); // G
        pixels[i + 2] = Math.min(255, Math.max(0, pixels[i + 2] + noise)); // B
    }
    ctx.putImageData(imageData, 0, 0);
}

// ==========================================
// ВІЗУАЛІЗАЦІЯ ІНТЕРФЕЙСУ ТОЧОК
// ==========================================
function drawControlPoints() {
    ctx.save();
    Object.keys(points).forEach(key => {
        const group = points[key];

        // Червоні лінії зв'язків
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        group.forEach((p, idx) => {
            if (idx === 0) ctx.moveTo(p.x, p.y);
            else ctx.lineTo(p.x, p.y);
        });
        ctx.stroke();

        // Сині маркери
        group.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, pointRadius, 0, Math.PI * 2);
            ctx.fillStyle = '#3b82f6';
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.fill();
            ctx.stroke();
        });
    });
    ctx.restore();
}

// ==========================================
// ОБРОБКА ПОДІЙ МИШІ
// ==========================================
function getMousePos(e) {
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
}

canvas.addEventListener('mousedown', (e) => {
    const pos = getMousePos(e);
    
    Object.keys(points).forEach(key => {
        points[key].forEach(p => {
            const dist = Math.hypot(p.x - pos.x, p.y - pos.y);
            if (dist < pointRadius + 4) {
                selectedPoint = p;
                isDragging = true; // Увімкнено режим перетягування
            }
        });
    });
});

canvas.addEventListener('mousemove', (e) => {
    if (!selectedPoint) return;
    
    const pos = getMousePos(e);
    selectedPoint.x = pos.x;
    selectedPoint.y = pos.y;
    
    drawScene(); // Перемальовується миттєво БЕЗ шуму
});

// Ефект шуму накладається лише в момент, коли ви відпустили мишку
window.addEventListener('mouseup', () => {
    if (isDragging) {
        isDragging = false; 
        drawScene(); // Фінальний рендер З шумом
    }
    selectedPoint = null;
});

// Початковий запуск
drawScene();
