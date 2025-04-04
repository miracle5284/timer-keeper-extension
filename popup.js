// Update the status display in the popup
async function updateStatus() {
  const statusDiv = document.getElementById("status");

  try {
    // Get the current active tab
    const [currentTab] = await chrome.tabs.query({ active: true, currentWindow: true });
    console.log("Current Tab:", currentTab);
    if (!currentTab) {
      statusDiv.textContent = "No active tab";
      statusDiv.className = "status inactive";
      return;
    }

    // Define the list of available websites (domains) for timer pages.
    const availableWebsites = [
      "https://dev-timer-app-slim.azurewebsites.net/",
      "https://staging-timer-app-slim.azurewebsites.net/",
      "https://timer.blueprime.app/",
      "https://chrona.blueprime.app/"
    ];

    // Support PR environments like chrona-frontend-pr-45.azurewebsites.net
    const isTimerPage = availableWebsites.some(site =>
        currentTab.url && currentTab.url.startsWith(site)
    ) || (currentTab.url && currentTab.url.startsWith("https://pr-") && currentTab.url.endsWith("chrona-frontend.azurewebsites.net/"));

    // Retrieve managed tabs from storage
    const { managedTabs = [] } = await chrome.storage.local.get("managedTabs");

    if (isTimerPage && managedTabs.includes(currentTab.id)) {
      statusDiv.textContent = "Timer is being kept active";
      statusDiv.className = "status active";
    } else if (isTimerPage) {
      statusDiv.textContent = "Timer detected - Activating...";
      statusDiv.className = "status active";
      // Trigger activation for the current tab
      chrome.runtime.sendMessage({ action: "activateTab", tabId: currentTab.id });
    } else {
      statusDiv.textContent = "Not a timer page";
      statusDiv.className = "status inactive";
    }
  } catch (error) {
    console.error("Error updating status:", error);
    statusDiv.textContent = "Error loading status";
    statusDiv.className = "status inactive";
  }
}

// Update status when popup opens
document.addEventListener("DOMContentLoaded", () => {
  // Retrieve the version from the manifest.
  const manifest = chrome.runtime.getManifest();
  const version = manifest.version;

  // Find the footer element's <small> tag.
  const footerSmall = document.querySelector("footer small");

  // Update the footer text with the version.
  if (footerSmall) {
    footerSmall.textContent = `Version: ${version} | Powered by Timer Keeper Active`;
  }
  updateStatus();
});

// Listen for messages from background script to update status.
chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "statusUpdate") {
    updateStatus();
  }
});
