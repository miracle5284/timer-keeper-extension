document.addEventListener("DOMContentLoaded", () => {
  // Get references to the form elements
  const doNotDisturbCheckbox = document.getElementById("doNotDisturb");
  const enableHighPerformanceCheckbox = document.getElementById("enableHighPerformance");
  const enableWakeLockCheckbox = document.getElementById("enableWakeLock");
  const statusMessage = document.getElementById("status");
  const form = document.getElementById("options-form");

  // Load current settings from chrome.storage.sync
  chrome.storage.sync.get(
    {
      doNotDisturb: false,
      enableHighPerformance: false,
      enableWakeLock: false,
    },
    (items) => {
      doNotDisturbCheckbox.checked = items.doNotDisturb;
      enableHighPerformanceCheckbox.checked = items.enableHighPerformance;
      enableWakeLockCheckbox.checked = items.enableWakeLock;
    }
  );

  // Handle form submission
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const doNotDisturb = doNotDisturbCheckbox.checked;
    const enableHighPerformance = enableHighPerformanceCheckbox.checked;
    const enableWakeLock = enableWakeLockCheckbox.checked;

    // Save settings to chrome.storage.sync
    chrome.storage.sync.set(
      { doNotDisturb, enableHighPerformance, enableWakeLock },
      () => {
        // Show a brief status message
        statusMessage.textContent = "Options saved!";
        setTimeout(() => {
          statusMessage.textContent = "";
        }, 2000);
      }
    );
  });
});
