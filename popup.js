// Update the status display in the popup
async function updateStatus() {
  const statusDiv = document.getElementById("status");
  const goButton = document.getElementById("goToTimerPage");

  try {
    // Get the current active tab
    const [currentTab] = await chrome.tabs.query({ active: true, currentWindow: true });
    console.log("Current Tab:", currentTab);

    if (!currentTab) {
      statusDiv.textContent = "No active tab";
      statusDiv.className = "status inactive";
      goButton.style.display = "none";
      return;
    }

    // Define the list of available websites (domains) for timer pages.
    const availableWebsites = [
      "https://dev-timer-app-slim.azurewebsites.net/",
      "https://staging-timer-app-slim.azurewebsites.net/",
      "https://timer.blueprime.app/",
      "https://chrona.blueprime.app/"
    ];

    const isTimerPage = availableWebsites.some(site =>
        currentTab.url && currentTab.url.startsWith(site)
    ) || (currentTab.url && currentTab.url.startsWith("https://pr-") && currentTab.url.endsWith("chrona-frontend.azurewebsites.net/"));

    // Retrieve managed tabs from storage
    const { managedTabs = [] } = await chrome.storage.local.get("managedTabs");

    if (isTimerPage && managedTabs.includes(currentTab.id)) {
      statusDiv.textContent = "Timer is being kept active";
      statusDiv.className = "status active";
      goButton.style.display = "none";
    } else if (isTimerPage) {
      statusDiv.textContent = "Timer detected - Activating...";
      statusDiv.className = "status active";
      goButton.style.display = "none";
      chrome.runtime.sendMessage({ action: "activateTab", tabId: currentTab.id });
    } else {
      statusDiv.textContent = "Not on timer page";
      statusDiv.className = "status inactive";
      goButton.style.display = "block";
    }
  } catch (error) {
    console.error("Error updating status:", error);
    statusDiv.textContent = "Error loading status";
    statusDiv.className = "status inactive";
    goButton.style.display = "none";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const manifest = chrome.runtime.getManifest();
  const version = manifest.version;
  const footerSmall = document.querySelector("footer small");

  if (footerSmall) {
    footerSmall.textContent = `Version: ${version} | Powered by BluePrime`;
  }

  updateStatus();
});

// Listen for background script status update
chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "statusUpdate") {
    updateStatus();
  }
});

// Handle Go to Timer Page button click
document.getElementById("goToTimerPage").addEventListener("click", async () => {
  // Get the current window
  const currentWindow = await chrome.windows.getCurrent();

  // Check only tabs in the current window
  const tabs = await chrome.tabs.query({ windowId: currentWindow.id });

  const timerTab = tabs.find(tab =>
      tab.url &&
      (
          tab.url.startsWith("https://dev-timer-app-slim.azurewebsites.net/") ||
          tab.url.startsWith("https://staging-timer-app-slim.azurewebsites.net/") ||
          tab.url.startsWith("https://timer.blueprime.app/") ||
          tab.url.startsWith("https://chrona.blueprime.app/") ||
          (tab.url.startsWith("https://pr-") && tab.url.endsWith("chrona-frontend.azurewebsites.net/"))
      )
  );

  if (timerTab) {
    // Switch to existing timer tab in current window
    await chrome.tabs.update(timerTab.id, { active: true });
  } else {
    // Open new timer page in current window
    await chrome.tabs.create({ url: "https://chrona.blueprime.app/" });
  }
});
