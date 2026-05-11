// Lightweight helper for year stamp consistency
const yearNode = document.getElementById('year');
if (yearNode) yearNode.textContent = String(new Date().getFullYear());
