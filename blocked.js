const timerEl = document.getElementById("timer");
let tickInterval = null;

function formatTime(ms) {
  const totalSec = Math.max(0, Math.ceil(ms / 1000));
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

chrome.storage.local.get(["session"], (data) => {
  const session = data.session;
  if (!session || !session.active || session.endTime <= Date.now()) return;

  function tick() {
    const remaining = session.endTime - Date.now();
    if (remaining <= 0) {
      timerEl.textContent = "";
      clearInterval(tickInterval);
      return;
    }
    timerEl.textContent = formatTime(remaining) + " left";
  }

  tick();
  tickInterval = setInterval(tick, 500);
});

document.getElementById("btn-back").addEventListener("click", () => {
  history.back();
});
