document.addEventListener("DOMContentLoaded", () => {
  const skills = [
    "Desarrollo web",
    "Bases de datos",
    "APIs REST",
    "Git & GitHub",
    "Laravel",
    "JavaScript",
    "CSS Animations",
    "FullCalendar",
    "DataTables",
    "SEO con Laravel",
    "Optimización de consultas SQL",
    "Integración de APIs externas",
  ];

  const btn = document.getElementById("generateBtn");
  const result = document.getElementById("result");

  btn.addEventListener("click", () => {
    const randomSkill = skills[Math.floor(Math.random() * skills.length)];
    result.textContent = `✨ ${randomSkill} ✨`;
  });
});
