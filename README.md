# Timer Keeper Active Extension

Timer Keeper Active is a Chrome-based extension designed to ensure the consistent accuracy and efficiency of your timer website by preventing background throttling and resource reduction. This extension is particularly beneficial in environments where browser resource management may inadvertently compromise the performance of time-sensitive applications.

## Overview

Modern browsers implement aggressive resource management techniques that throttle background tabs to conserve power and optimize performance. Such measures can adversely affect the accuracy of timers and other real-time applications. Timer Keeper Active mitigates these issues by injecting performance-enhancing scripts into specified websites, thereby ensuring that critical applications maintain optimal operation even when not in the foreground.

## Key Features

- **Background Throttling Prevention:**  
  Timer Keeper Active prevents your timer website from being throttled by disabling the browser’s auto-discard feature and ensuring the tab remains active.

- **High Performance Mode:**  
  The extension can request higher performance from the browser by leveraging experimental APIs that allow for increased processing priority.

- **Wake Lock Integration:**  
  When enabled, the extension requests a wake lock to keep the screen active, further enhancing the performance of your timer in power-saving scenarios.

- **Configurable Options:**  
  Users have access to an intuitive options interface where they can:
  - Enable or disable high performance mode.
  - Activate or deactivate wake lock functionality.
  - Toggle a “Do Not Disturb” mode to temporarily suspend performance injections.
  
- **Cookie Integration for Website Detection:**  
  Upon installation or startup, the extension sets a persistent cookie on the target website. This cookie allows the website to verify the extension’s presence and adjust its behavior accordingly.

- **Automatic Content Script Injection:**  
  The extension is capable of programmatically injecting its content script into open tabs that match predefined domains, ensuring that performance enhancements are applied even if the extension is enabled after the page has loaded.

## Installation

1. **Download and Installation:**  
   The Timer Keeper Active Extension is available in the Chrome Web Store. Visit the [Chrome Web Store](https://chrome.google.com/webstore/detail/llkfgmkfhjlcpioadfmnejoggcbhonhf) and click “Add to Chrome” to install the extension.

2. **Enable the Extension:**  
   After installation, navigate to `chrome://extensions` and verify that Timer Keeper Active is enabled.

3. **Reload Target Websites:**  
   For the extension to inject its performance scripts, any open timer websites must be reloaded following installation.

## How It Works

- **Injection of Performance Enhancements:**  
  The extension employs the `chrome.scripting` API to inject a dedicated script into your timer website. This script requests high performance mode and, if enabled, activates a wake lock to ensure that background processing remains unaffected by the browser’s resource optimization.

- **Cookie Management:**  
  At installation and startup, the extension sets a cookie on the target website containing metadata such as the extension’s name, version, and unique ID. This mechanism enables the website to detect that Timer Keeper Active is or was installed.

- **Dynamic Options:**  
  Through the options page, users can adjust the extension’s behavior. Changes are stored using Chrome’s `chrome.storage` API, and these settings are dynamically applied to maintain the desired performance level.

## Usage

Once installed and enabled, Timer Keeper Active operates transparently in the background. There is no need for ongoing user interaction. However, should you wish to adjust performance settings, simply click the extension’s icon in the Chrome toolbar and select the “Options” menu. From the options page, you can:

- Toggle Do Not Disturb mode.
- Enable or disable high performance mode.
- Activate or deactivate wake lock functionality.

After modifying your settings, click “Save Options” to apply the changes immediately.

## Troubleshooting

- **Timer Inaccuracy:**  
  If your timer experiences discrepancies, please confirm that the extension is enabled. Adjust the performance settings in the options page if necessary.

- **Extension Not Detected:**  
  If your timer website indicates that the extension is not detected, ensure that Timer Keeper Active is installed and enabled via `chrome://extensions`, and reload your timer website.

- **Other Issues:**  
  Verify that your browser is updated to the latest version and that no conflicting extensions are interfering with Timer Keeper Active’s functionality. For persistent issues, consult the Help & FAQ section on our website.

## Frequently Asked Questions

**Q: Why does my timer become inaccurate when the tab is inactive?**  
A: Background throttling reduces processing priority for inactive tabs. Timer Keeper Active prevents this by ensuring your timer website remains active and receives optimal resource allocation.

**Q: Do I need to reload my timer website after installing the extension?**  
A: Yes. Content scripts are injected during page load, so reloading the website is necessary for the extension to function properly.

**Q: What if the extension is installed but disabled?**  
A: If the extension is disabled, its performance enhancements will not be applied. In such cases, your timer website may notify you with instructions on how to enable the extension for optimal performance.

## Support and Contact

For further assistance, inquiries, or feedback, please contact our support team at [blueprime91@gmail.com](mailto:blueprime91@gmail.com). Additional documentation, updates, and FAQs can be found on our [page](https://primeportfolio.azurewebsites.net).

---

Timer Keeper Active is committed to ensuring that your time-sensitive applications run reliably, regardless of background browser optimizations. Thank you for choosing our extension.