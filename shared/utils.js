const utils = {
  captureMouse: function (element) {
    const mouse = { x: 0, y: 0, event: null };

    element.addEventListener("pointermove", (event) => {
      const rect = element.getBoundingClientRect();
      
      mouse.x = event.clientX - rect.left;
      mouse.y = event.clientY - rect.top;
      mouse.event = event;
    });

    return mouse;
  }
};

export default utils;
