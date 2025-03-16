try{// Mark extension as installed
  Object.defineProperty(window, "__TIMER_KEEPER_ACTIVE_EXTENSION_INSTALLED", {
    value: true,
    writable: false,
    enumerable: false,
    configurable: false
  });

  // Get the data-container element safely
  const pageDataContainer = document.querySelector("#data-container");
  if (pageDataContainer) {
    pageDataContainer.setAttribute("data-timer-extension", "active");
  }

  console.log("Injected", window.__TIMER_KEEPER_ACTIVE_EXTENSION_INSTALLED);
} catch (error) {
  console.error("Error in content.js:", error);
}
