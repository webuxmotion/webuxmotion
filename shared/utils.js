const utils = {
  captureMouse: function (element) {
    const mouse = { x: 0, y: 0, event: null, isOutside: true, isDown: false };

    element.addEventListener("pointermove", (event) => {
      const rect = element.getBoundingClientRect();

      mouse.x = event.clientX - rect.left;
      mouse.y = event.clientY - rect.top;
      mouse.event = event;
      mouse.isOutside = false;
    });

    element.addEventListener("mouseleave", () => {
      mouse.isOutside = true;
    });

    element.addEventListener("mousedown", () => {
      mouse.isDown = true;
    });

    element.addEventListener("mouseup", () => {
      mouse.isDown = false;
    });

    return mouse;
  },

  degToRad: (deg) => {
    return (Math.PI / 180) * deg;
  },

  generateQuadraticCurvePoints(p0, p1, p2, steps = 20) {
    const points = [];

    // Формула квадратичної кривої Безьє:
    // B(t) = (1-t)²*P₀ + 2*(1-t)*t*P₁ + t²*P₂
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const mt = 1 - t;

      const f0 = mt * mt; // (1-t)²
      const f1 = 2 * mt * t; // 2*(1-t)*t
      const f2 = t * t; // t²

      // Розраховуємо фінальні координати X та Y
      const x = Math.round(f0 * p0.x + f1 * p1.x + f2 * p2.x);
      const y = Math.round(f0 * p0.y + f1 * p1.y + f2 * p2.y);

      points.push({ x, y });
    }

    return points;
  },

  lerp(a, b, t) {
    return a + (b - a) * t;
  },

  getBezierPoint(p0, p1, p2, t) {
    const q0x = lerp(p0.x, p1.x, t);
    const q0y = lerp(p0.y, p1.y, t);

    const q1x = lerp(p1.x, p2.x, t);
    const q1y = lerp(p1.y, p2.y, t);

    const x = lerp(q0x, q1x, t);
    const y = lerp(q0y, q1y, t);

    return { x: x, y: y };
  },

  drawLineFromPoints(ctx, curvePoints) {
    // Якщо точок немає, або вона всього одна — малювати нічого
    if (!curvePoints || curvePoints.length < 2) return;

    ctx.beginPath();

    curvePoints.forEach((point, index) => {
      if (index === 0) {
        ctx.moveTo(point.x, point.y);
      } else {
        ctx.lineTo(point.x, point.y);
      }
    });

    // Малюємо всю лінію один раз після завершення циклу
    ctx.stroke();
  },

  drawCircle(ctx, coords) {
    ctx.beginPath();
    ctx.arc(coords.x, coords.y, 6, 0, Math.PI * 2, 0);
    ctx.stroke();
  },

  getMidpoint(p1, p2) {
    return {
      x: (p1.x + p2.x) / 2,
      y: (p1.y + p2.y) / 2,
    };
  },

  drawPoint({ ctx, point, radius = 8, steps = 6, style = 1 }) {
    let stepAngle = (Math.PI * 2) / steps;

    switch (style) {
      case 1:
        ctx.save();
        ctx.beginPath();

        for (let i = 0; i <= steps; i++) {
          const p = {
            x: point.x + Math.cos(stepAngle * i) * radius,
            y: point.y + Math.sin(stepAngle * i) * radius,
          };

          if (i == 0) {
            ctx.moveTo(p.x, p.y);
          } else {
            ctx.lineTo(p.x, p.y);
          }
        }

        ctx.stroke();
        ctx.restore();
        break;

      default:
        break;
    }
  },

  colors() {
    return [
      "#00f5d4", // 1. Кислотна бірюза (Neon Teal)
      "#00bbf9", // 2. Електричний блакитний (Electric Cyan)
      "#3a86ff", // 3. Яскравий ультрамарин (Vibrant Blue)
      "#8338ec", // 4. Неоновий фіолетовий (Laser Purple)
      "#ff006e", // 5. Гаряча фуксія (Hot Pink)
      "#ff5555", // 6. Інтенсивний кораловий (Bright Coral)
      "#ff9f1c", // 7. Соковитий помаранчевий (Volt Orange)
      "#ffeb3b", // 8. Кібер-жовтий (Cyber Yellow)
      "#52ffb8", // 9. М'ятний неон (Mint Green)
      "#a7ff33", // 10. Кислотно-зелений (Lime Shock)
    ];
  },
};

export default utils;
