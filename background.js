// Normalize a user-entered pattern to a bare hostname (e.g. "https://www.instagram.com/x" → "instagram.com")
function normalizePattern(raw) {
  try {
    const withProto = raw.includes("://") ? raw : "https://" + raw;
    const host = new URL(withProto).hostname.toLowerCase();
    return host.startsWith("www.") ? host.slice(4) : host;
  } catch {
    return raw.trim().toLowerCase();
  }
}

function matchesDomain(hostname, pattern) {
  const h = hostname.toLowerCase();
  const p = normalizePattern(pattern);
  return h === p || h.endsWith("." + p);
}

chrome.webNavigation.onBeforeNavigate.addListener((details) => {
  if (details.frameId !== 0) return; // main frame only

  chrome.storage.local.get(["session", "blocklist", "allowlist"], (data) => {
    const session = data.session;
    if (!session || !session.active || session.endTime <= Date.now()) return;

    let url;
    try { url = new URL(details.url); } catch { return; }
    if (url.protocol !== "https:" && url.protocol !== "http:") return;

    const hostname = url.hostname.toLowerCase();
    const blocklist = data.blocklist || [];
    const allowlist = data.allowlist || [];

    if (allowlist.some((p) => matchesDomain(hostname, p))) return;
    if (blocklist.some((p) => matchesDomain(hostname, p))) {
      chrome.tabs.update(details.tabId, {
        url: chrome.runtime.getURL("blocked.html"),
      });
    }
  });
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name !== "focusTimer") return;

  chrome.storage.local.get(["session"], (data) => {
    if (!data.session || !data.session.active) return;
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
