// Background script for Video Speed Controller

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'openPopup') {
        // Open popup by opening the extension action
        chrome.action.openPopup().catch((error) => {
            console.warn('Could not open popup:', error);
            // Fallback: try to open popup in a new tab (for testing)
            chrome.tabs.create({
                url: chrome.runtime.getURL('popup.html'),
                active: true
            });
        });
    }
});