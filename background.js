const BLOCKED_SITES = [
  "instagram.com",
  "twitter.com",
  "x.com",
  "reddit.com",
  "youtube.com",
  "tiktok.com",
  "facebook.com"
];

function isBlocked(url) {
  try {
    const host = new URL(url).hostname.replace("www.", "");
    return BLOCKED_SITES.some(site => host === site || host.endsWith("." + site));
  } catch { return false; }
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status !== "loading") return;
  if (!tab.url || !isBlocked(tab.url)) return;

  const key = "site_" + new URL(tab.url).hostname.replace("www.", "");

  chrome.storage.local.get([key, key + "_unlockedUntil"], (data) => {
    const now = Date.now();
    const unlockedUntil = data[key + "_unlockedUntil"] || 0;

    if (now < unlockedUntil) return; // still in grace period

    const visits = (data[key] || 0) + 1;
    chrome.storage.local.set({ [key]: visits });

    const encoded = encodeURIComponent(tab.url);
    const blockedUrl = chrome.runtime.getURL("blocked.html") +
      "?dest=" + encoded + "&visits=" + visits + "&key=" + encodeURIComponent(key);

    chrome.tabs.update(tabId, { url: blockedUrl });
  });
});