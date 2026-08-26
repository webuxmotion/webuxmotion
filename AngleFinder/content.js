(function() {
  // Перевіряємо, чи інструмент вже запущений, щоб не дублювати його
  if (document.getElementById('angle-measurer-canvas')) return;

  const canvas = document.createElement('canvas');
  canvas.id = 'angle-measurer-canvas';
  
  // Стилі, щоб розтягнути канвас на весь екран поверх усього контенту
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.zIndex = '999999';
  canvas.style.cursor = 'crosshair';
  
  document.body.appendChild(canvas);
  
  const ctx = canvas.getContext('2d');
  
  // Підганяємо внутрішній розмір канвасу під екран
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let points = [];

  // Функція обчислення кута у вершині B (друга точка)
  function calculateAngle(A, B, C) {
    const v1 = { x: A.x - B.x, y: A.y - B.y };
    const v2 = { x: C.x - B.x, y: C.y - B.y };
    
    const dotProduct = v1.x * v2.x + v1.y * v2.y;
    const mag1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y);
    const mag2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y);
    
    if (mag1 === 0 || mag2 === 0) return 0;
    
    const cosTheta = dotProduct / (mag1 * mag2);
    // Обмежуємо значення через похибки округлення JS
    const angleRad = Math.acos(Math.max(-1, Math.min(1, cosTheta))); 
    return (angleRad * 180) / Math.PI;
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. Малюємо лінії між точками (якщо їх хоча б дві)
    if (points.length > 1) {
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.strokeStyle = '#ff0055';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // 2. Малюємо самі точки та їхні назви (A, B, C)
    ctx.fillStyle = '#ff0055';
    ctx.font = 'bold 14px Arial';
    
    points.forEach((point, index) => {
      const labels = ['A', 'B (Вершина)', 'C'];
      ctx.beginPath();
      ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillText(labels[index], point.x + 10, point.y - 10);
    });

    // 3. Якщо поставлено всі 3 точки, виводимо результат
    if (points.length === 3) {
      const angle = calculateAngle(points[0], points[1], points[2]);
      
      ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
      ctx.fillRect(points[1].x + 15, points[1].y + 15, 140, 35);
      
      ctx.fillStyle = '#fff';
      ctx.fillText(`Кут: ${angle.toFixed(1)}°`, points[1].x + 25, points[1].y + 38);

      // Самознищення через 4 секунди після завершення виміру
      setTimeout(() => {
        canvas.remove();
      }, 4000);
    }
  }

  // Обробник кліків
  canvas.addEventListener('click', (e) => {
    if (points.length >= 3) return; // Блокуємо кліки після 3 точок

    points.push({ x: e.clientX, y: e.clientY });
    draw();
  });

  // Закриття інструменту через клавішу Escape
  window.addEventListener('keydown', function escCheck(e) {
    if (e.key === 'Escape') {
      canvas.remove();
      window.removeEventListener('keydown', escCheck);
    }
  });
})();
