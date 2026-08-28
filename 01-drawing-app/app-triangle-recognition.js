import utils from "../shared/utils.js";

window.onload = function () {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const mouse = utils.captureMouse(canvas);
  
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  let points = []; 

  function onMouseMove() {
    ctx.strokeStyle = "#E6E1E3";
    ctx.lineTo(mouse.x, mouse.y);
    ctx.stroke();
    points.push({ x: mouse.x, y: mouse.y }); 
  }

  canvas.addEventListener("mousedown", function () {
      points = []; 
      ctx.beginPath();
      ctx.moveTo(mouse.x, mouse.y);
      points.push({ x: mouse.x, y: mouse.y });
      canvas.addEventListener("mousemove", onMouseMove, false);
    }, false
  );

  canvas.addEventListener("mouseup", function () {
      canvas.removeEventListener("mousemove", onMouseMove, false);
      if (points.length > 15) { 
        recognizeAndDrawTriangle(points);
      }
    }, false
  );

  function recognizeAndDrawTriangle(pts) {
    const startPoint = pts[0]; 
    const endPoint = pts[pts.length - 1];
    
    let vertexA = {
      x: (startPoint.x + endPoint.x) / 2,
      y: (startPoint.y + endPoint.y) / 2
    };

    let maxDistB = -1;
    let indexB = 0;
    for (let i = 0; i < pts.length; i++) {
      let d = getPerpendicularDistance(pts[i], startPoint, endPoint);
      if (d > maxDistB) { maxDistB = d; indexB = i; }
    }
    let vertexB = pts[indexB];

    let maxDistC = -1;
    let vertexC = pts[0];
    for (let i = 0; i < indexB; i++) {
      let d = getPerpendicularDistance(pts[i], vertexA, vertexB);
      if (d > maxDistC) { maxDistC = d; vertexC = pts[i]; }
    }
    for (let i = indexB; i < pts.length; i++) {
      let d = getPerpendicularDistance(pts[i], vertexB, vertexA);
      if (d > maxDistC) { maxDistC = d; vertexC = pts[i]; }
    }

    let vertices = [vertexA, vertexB, vertexC];

    // --- КРОК 1: СПОЧАТКУ РОБИМО КУТ 90 ГРАДУСІВ ---
    let rightAngleIndex = -1;
    for (let i = 0; i < 3; i++) {
      let p1 = vertices[i];
      let p2 = vertices[(i + 1) % 3];
      let p3 = vertices[(i + 2) % 3];

      let angle = calculateAngle(p1, p2, p3);
      
      if (angle >= 70 && angle <= 110) { // Трохи розширили діапазон захоплення кута
        rightAngleIndex = i;
        
        let midX = (p2.x + p3.x) / 2;
        let midY = (p2.y + p3.y) / 2;
        let r = Math.hypot(p2.x - midX, p2.y - midY);
        let angleToP1 = Math.atan2(p1.y - midY, p1.x - midX);
        
        p1.x = midX + r * Math.cos(angleToP1);
        p1.y = midY + r * Math.sin(angleToP1);
        break; 
      }
    }

    // --- КРОК 2: ТЕПЕР ПОВЕРТАЄМО ВЕСЬ ТРИКУТНИК ДО ГОРИЗОНТАЛІ ---
    const HORIZONTAL_THRESHOLD_DEG = 20; // Збільшено поріг для легшого спрацьовування
    const thresholdRad = HORIZONTAL_THRESHOLD_DEG * (Math.PI / 180);

    for (let i = 0; i < 3; i++) {
      let p1 = vertices[i];
      let p2 = vertices[(i + 1) % 3];

      let currentAngle = Math.atan2(p2.y - p1.y, p2.x - p1.x); 
      let deltaAngle = 0;
      let shouldRotate = false;

      if (Math.abs(currentAngle) <= thresholdRad) {
        deltaAngle = -currentAngle;
        shouldRotate = true;
      } else if (Math.abs(currentAngle - Math.PI) <= thresholdRad) {
        deltaAngle = Math.PI - currentAngle;
        shouldRotate = true;
      } else if (Math.abs(currentAngle + Math.PI) <= thresholdRad) {
        deltaAngle = -Math.PI - currentAngle;
        shouldRotate = true;
      }

      if (shouldRotate) {
        // Рахуємо геометричний центр трикутника для красивого повороту на місці
        let centerX = (vertices[0].x + vertices[1].x + vertices[2].x) / 3;
        let centerY = (vertices[0].y + vertices[1].y + vertices[2].y) / 3;

        vertices.forEach(v => {
          let dx = v.x - centerX;
          let dy = v.y - centerY;
          v.x = centerX + dx * Math.cos(deltaAngle) - dy * Math.sin(deltaAngle);
          v.y = centerY + dx * Math.sin(deltaAngle) + dy * Math.cos(deltaAngle);
        });
        break; 
      }
    }

    // Очищення та фінальне перемальовування
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 1. Малювання сторін різними кольорами (Червоний, Зелений, Синій)
    const colors = ["#FF5733", "#33FF57", "#3357FF"]; 
    for (let i = 0; i < 3; i++) {
      ctx.strokeStyle = colors[i];
      ctx.beginPath();
      ctx.moveTo(vertices[i].x, vertices[i].y);
      ctx.lineTo(vertices[(i + 1) % 3].x, vertices[(i + 1) % 3].y);
      ctx.stroke();
    }

    // 2. Квадратний маркер прямого кута
    if (rightAngleIndex !== -1) {
      drawRightAngleMarker(vertices[rightAngleIndex], vertices[(rightAngleIndex + 1) % 3], vertices[(rightAngleIndex + 2) % 3]);
    }

    // 3. Точки на вершинах
    ctx.fillStyle = "#E6E1E3";
    vertices.forEach(v => {
      ctx.beginPath();
      ctx.arc(v.x, v.y, 6, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function calculateAngle(p1, p2, p3) {
    let d12 = Math.hypot(p2.x - p1.x, p2.y - p1.y);
    let d13 = Math.hypot(p3.x - p1.x, p3.y - p1.y);
    let d23 = Math.hypot(p3.x - p2.x, p3.y - p2.y);
    let cosA = (d12*d12 + d13*d13 - d23*d23) / (2 * d12 * d13);
    return Math.acos(Math.max(-1, Math.min(1, cosA))) * (180 / Math.PI);
  }

  function drawRightAngleMarker(p1, p2, p3) {
    const size = 15;
    let len12 = Math.hypot(p2.x - p1.x, p2.y - p1.y);
    let len13 = Math.hypot(p3.x - p1.x, p3.y - p1.y);
    
    let u12 = { x: (p2.x - p1.x) / len12, y: (p2.y - p1.y) / len12 };
    let u13 = { x: (p3.x - p1.x) / len13, y: (p3.y - p1.y) / len13 };

    let ptA = { x: p1.x + u12.x * size, y: p1.y + u12.y * size };
    let ptB = { x: p1.x + u12.x * size + u13.x * size, y: p1.y + u12.y * size + u13.y * size };
    let ptC = { x: p1.x + u13.x * size, y: p1.y + u13.y * size };

    ctx.strokeStyle = "#E6E1E3";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(ptA.x, ptA.y);
    ctx.lineTo(ptB.x, ptB.y);
    ctx.lineTo(ptC.x, ptC.y);
    ctx.stroke();
    ctx.lineWidth = 3; 
  }

  function getPerpendicularDistance(p, p1, p2) {
    let num = Math.abs((p2.y - p1.y) * p.x - (p2.x - p1.x) * p.y + p2.x * p1.y - p2.y * p1.x);
    let den = Math.hypot(p2.y - p1.y, p2.x - p1.x);
    return den === 0 ? 0 : num / den;
  }
};
