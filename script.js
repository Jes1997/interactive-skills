document.addEventListener("DOMContentLoaded", () => {
  const spinBtn = document.getElementById("spinBtn");

  const slots = [
    document.getElementById("frontendSlot"),
    document.getElementById("backendSlot"),
    document.getElementById("toolsSlot"),
  ];

  let indices = [0, 0, 0];
  const slotHeight = 60;

  function spin() {
    slots.forEach((slot, i) => {
      const items = slot.children.length;
      indices[i] = (indices[i] + 1) % items;
      const offset = -indices[i] * slotHeight;
      slot.style.transform = `translateY(${offset}px)`;
    });
  }

  spinBtn.addEventListener("click", spin);
});
