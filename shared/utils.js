const utils = {
  captureMouse: function (element) {
    const mouse = { x: 0, y: 0, event: null, isOutside: true };

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

    return mouse;
  },

  degToRad: (deg) => {
    return Math.PI / 180 * deg;
  }
};

export default utils;
