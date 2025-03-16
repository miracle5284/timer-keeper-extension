// Default settings
const defaultTargetDomains = [
    "https://timer.blueprime.app",
    "https://dev-timer-app-slim.azurewebsites.net",
    "https://staging-timer-app-slim.azurewebsites.net",
];
let targetDomains = [...defaultTargetDomains];
let doNotDisturb = false;
let enableHighPerformance = true;
let enableWakeLock = true;

// Load stored settings from chrome.storage.sync
chrome.storage.sync.get([
  "targetDomains", "doNotDisturb", "enableHighPerformance", "enableWakeLock"
], (data) => {
  targetDomains = Array.isArray(data.targetDomains) ? data.targetDomains : targetDomains;
  doNotDisturb = data.doNotDisturb ?? doNotDisturb;
  enableHighPerformance = data.enableHighPerformance ?? enableHighPerformance;
  enableWakeLock = data.enableWakeLock ?? enableWakeLock;
});

// Check if a given URL belongs to one of the target domains
function isTargetTab(url) {
  try {
    const tabOrigin = new URL(url).origin;
    return targetDomains.includes(tabOrigin);
  } catch {
    return false;
  }
}

// Function injected into pages
async function injectedKeepActive(highPerf, wakeLock) {
  if (highPerf && navigator.scheduling?.setPriority) {
    navigator.scheduling.setPriority("high");
  }
  document.wasDiscarded ??= false;
  if (wakeLock && navigator.wakeLock) {
    try {
      await navigator.wakeLock.request("screen");
    } catch (e) {
      console.error("Wake lock request failed:", e);
    }
  }
}

// Inject script into a tab if it matches target domains
async function keepTabActive(tabId) {
  if (doNotDisturb) return;
  try {
    await chrome.scripting.executeScript({
      target: { tabId },
      function: injectedKeepActive,
      args: [enableHighPerformance, enableWakeLock],
    });
    chrome.storage.local.get("managedTabs", ({ managedTabs = [] }) => {
      if (!managedTabs.includes(tabId)) {
        chrome.storage.local.set({ managedTabs: [...managedTabs, tabId] });
      }
    });
  } catch (error) {
    console.error("Error injecting script:", error);
  }
}

// Event Listeners
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && isTargetTab(tab.url)) {
    chrome.tabs.update(tabId, { autoDiscardable: false });
    keepTabActive(tabId);
  }
});

chrome.tabs.onActivated.addListener(({ tabId }) => {
  chrome.tabs.get(tabId, (tab) => {
    if (isTargetTab(tab.url)) {
      chrome.tabs.update(tabId, { autoDiscardable: false });
      keepTabActive(tabId);
    }
  });
});

chrome.idle.onStateChanged.addListener((newState) => {
  if (newState === "active") {
    chrome.tabs.query({}, (tabs) => {
      tabs.filter(tab => isTargetTab(tab.url)).forEach(tab => {
        chrome.tabs.update(tab.id, { autoDiscardable: false });
        keepTabActive(tab.id);
      });
    });
  }
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "sync") {
    Object.assign(
      { doNotDisturb, enableHighPerformance, enableWakeLock, targetDomains },
      changes
    );
  }
});

chrome.tabs.onRemoved.addListener((tabId) => {
  chrome.storage.local.get("managedTabs", ({ managedTabs = [] }) => {
    const newTabs = managedTabs.filter(id => id !== tabId);
    chrome.storage.local.set({ managedTabs: newTabs });
  });
});

chrome.runtime.onMessageExternal.addListener((request, sender, sendResponse) => {
  if (request.type === "PING_FROM_PAGE") {
    sendResponse({ type: "PONG_FROM_EXTENSION" });
  }
});

// Set a cookie on install/startup
chrome.runtime.onInstalled.addListener(setExtensionCookie);
chrome.runtime.onStartup.addListener(setExtensionCookie);

function setExtensionCookie() {
  const details = {
    installed: true,
    extensionName: chrome.runtime.getManifest().name,
    version: chrome.runtime.getManifest().version,
    extensionId: chrome.runtime.id,
  };
  targetDomains.forEach(domain => {
    try {
      chrome.cookies.set({ url: domain, name: "timer-keeper", value: JSON.stringify(details) });
    } catch (error) {
      console.error(`Failed to set cookie for ${domain}:`, error);
    }
  });
}

// Inject content script into existing tabs
chrome.tabs.query({ url: targetDomains.map(domain => `${domain}/*`) }, (tabs) => {
  tabs.forEach(tab => {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['content.js']
    }).catch(console.error);
  });
});
