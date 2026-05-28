const QUOTES = [
  "You showed up for yourself today. That's love.",
  "The present moment is always enough.",
  "Rest is not a reward — it's part of the work.",
  "You are already whole, even mid-sentence.",
  "Attention is the rarest and purest form of generosity.",
  "Something in you knew exactly what it was doing.",
  "The world got quieter, and you stayed.",
  "Every act of focus is a small act of devotion.",
  "You gave your best hours to something real.",
  "There is beauty in the things you finish.",
  "A little more patient. A little more yourself.",
  "Today you chose depth over distraction.",
  "You are doing better than you feel.",
  "Time spent with intention is never wasted.",
  "What you protect with your attention becomes yours.",
  "Stillness is its own kind of courage.",
  "You returned, again and again. That counts.",
  "Progress doesn't always look like progress until later.",
  "The quiet version of you built something today.",
  "You stayed when it would have been easy to leave.",
  "Each session is a letter to your future self.",
  "Presence is the gift you gave yourself.",
  "The effort matters, even when the outcome is uncertain.",
  "You are more capable than your busiest hour suggests.",
  "Small, consistent devotion changes everything.",
  "Being here, fully, is already the point.",
];

let tickInterval = null;
let notebookOpen = false;

const screenHome = document.getElementById("screen-home");
const screenSession = document.getElementById("screen-session");
const screenQuote = document.getElementById("screen-quote");
const minutesInput = document.getElementById("minutes-input");
const btnStart = document.getElementById("btn-start");
const timerDisplay = document.getElementById("timer-display");
const btnCancel = document.getElementById("btn-cancel");
const quoteText = document.getElementById("quote-text");
const btnDone = document.getElementById("btn-done");
const notebook = document.getElementById("notebook");
const notebookList = document.getElementById("notebook-list");
const notebookEmpty = document.getElementById("notebook-empty");
const btnNotebook = document.getElementById("btn-notebook");

function formatTime(ms) {
  const totalSec = Math.max(0, Math.ceil(ms / 1000));
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function showScreen(name) {
  screenHome.classList.add("hidden");
  screenSession.classList.add("hidden");
  screenQuote.classList.add("hidden");
  if (name === "home") screenHome.classList.remove("hidden");
  if (name === "session") screenSession.classList.remove("hidden");
  if (name === "quote") screenQuote.classList.remove("hidden");
}

function startTick(endTime) {
  clearInterval(tickInterval);
  function tick() {
    const remaining = endTime - Date.now();
    if (remaining <= 0) {
      clearInterval(tickInterval);
      completeSession();
      return;
    }
    timerDisplay.textContent = formatTime(remaining);
  }
  tick();
  tickInterval = setInterval(tick, 500);
}

function completeSession() {
  chrome.storage.local.get(["letters"], (res) => {
    const letters = res.letters || [];
    const quote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
    const entry = { quote, date: Date.now() };
    letters.unshift(entry);
    chrome.storage.local.set({
      letters,
      session: { active: false, endTime: null },
    }, () => {
      // Reset quote element so animation re-triggers
      quoteText.style.animation = "none";
      quoteText.textContent = quote;
      void quoteText.offsetWidth;
      quoteText.style.animation = "";
      showScreen("quote");
    });
  });
}

function renderNotebook(letters) {
  notebookList.innerHTML = "";
  if (letters.length === 0) {
    notebookEmpty.classList.remove("hidden");
    return;
  }
  notebookEmpty.classList.add("hidden");
  letters.forEach((entry) => {
    const div = document.createElement("div");
    div.className = "notebook-entry";
    const d = new Date(entry.date);
    const dateStr = d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
    div.innerHTML = `<p class="entry-quote">"${entry.quote}"</p><p class="entry-meta">${dateStr}</p>`;
    notebookList.appendChild(div);
  });
}

// ── Events ──

btnStart.addEventListener("click", () => {
  const minutes = Math.max(1, parseInt(minutesInput.value, 10) || 60);
  const endTime = Date.now() + minutes * 60 * 1000;
  chrome.storage.local.set({ session: { active: true, endTime } }, () => {
    chrome.runtime.sendMessage({ type: "START_SESSION", minutes });
    showScreen("session");
    startTick(endTime);
  });
});

btnCancel.addEventListener("click", () => {
  clearInterval(tickInterval);
  chrome.runtime.sendMessage({ type: "CANCEL_SESSION" });
  chrome.storage.local.set({ session: { active: false, endTime: null } });
  showScreen("home");
});

btnDone.addEventListener("click", () => {
  showScreen("home");
});

btnNotebook.addEventListener("click", () => {
  notebookOpen = !notebookOpen;
  if (notebookOpen) {
    chrome.storage.local.get(["letters"], (res) => {
      renderNotebook(res.letters || []);
      notebook.classList.remove("hidden");
      btnNotebook.textContent = "✕";
    });
  } else {
    notebook.classList.add("hidden");
    btnNotebook.textContent = "📖";
  }
});

// ── Init ──

chrome.storage.local.get(["session"], (data) => {
  const session = data.session;
  if (session && session.active && session.endTime > Date.now()) {
    showScreen("session");
    startTick(session.endTime);
  } else if (session && session.active && session.endTime <= Date.now()) {
    // Timer finished while popup was closed — complete it now
    chrome.storage.local.set({ session: { active: false, endTime: null } });
    completeSession();
  } else {
    showScreen("home");
  }
});
