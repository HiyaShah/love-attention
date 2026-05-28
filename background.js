chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name !== "focusTimer") return;

  chrome.storage.local.get(["session"], (data) => {
    if (!data.session || !data.session.active) return;
    // Mark session as needing completion — popup will handle the quote on next open
    chrome.storage.local.set({ session: { active: true, endTime: Date.now() - 1 } });
    chrome.notifications.create({
      type: "basic",
      iconUrl: "icons/icon128.png",
      title: "Session complete 💌",
      message: "Open Love Attention to receive your letter.",
    });
  });
});

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.type === "START_SESSION") {
    chrome.alarms.create("focusTimer", { delayInMinutes: msg.minutes });
    sendResponse({ ok: true });
  }
  if (msg.type === "CANCEL_SESSION") {
    chrome.alarms.clear("focusTimer");
    sendResponse({ ok: true });
  }
  return true;
});
