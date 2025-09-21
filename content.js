class VideoSpeedManager {
    constructor() {
        this.videos = [];
        this.currentSpeed = 1.0;
        this.speedDisplay = null;
        this.observer = null;
        this.init();
    }

    init() {
        this.findVideos();
        this.createSpeedDisplay();
        this.setupVideoObserver();
        this.setupMessageListener();
        this.setupKeyboardShortcuts();
        
        // Check for videos periodically
        setInterval(() => {
            this.findVideos();
        }, 2000);
    }

    findVideos() {
        const videoElements = document.querySelectorAll('video');
        const newVideos = Array.from(videoElements).filter(video => 
            !this.videos.includes(video) && video.duration > 0
        );

        newVideos.forEach(video => {
            this.videos.push(video);
            this.setupVideoEvents(video);
            
            // Set current speed for new videos
            if (this.currentSpeed !== 1.0) {
                video.playbackRate = this.currentSpeed;
            }
        });

        // Remove videos that are no longer in DOM
        this.videos = this.videos.filter(video => document.contains(video));
        
        // Update display visibility
        this.updateDisplayVisibility();
    }

    setupVideoEvents(video) {
        video.addEventListener('loadedmetadata', () => {
            video.playbackRate = this.currentSpeed;
            this.updateSpeedDisplay();
        });

        video.addEventListener('ratechange', () => {
            // Only update if the change wasn't made by our extension
            if (Math.abs(video.playbackRate - this.currentSpeed) > 0.01) {
                this.currentSpeed = video.playbackRate;
                this.updateSpeedDisplay();
                this.syncAllVideos();
            }
        });

        video.addEventListener('play', () => {
            this.updateDisplayVisibility();
        });

        video.addEventListener('pause', () => {
            this.updateDisplayVisibility();
        });
    }

    setupVideoObserver() {
        this.observer = new MutationObserver((mutations) => {
            let shouldCheck = false;
            
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            if (node.tagName === 'VIDEO' || node.querySelector('video')) {
                                shouldCheck = true;
                            }
                        }
                    });
                }
            });

            if (shouldCheck) {
                setTimeout(() => this.findVideos(), 100);
            }
        });

        this.observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    setupMessageListener() {
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            switch (request.action) {
                case 'setSpeed':
                    this.setSpeed(request.speed);
                    sendResponse({ success: true, speed: this.currentSpeed });
                    break;
                    
                case 'getCurrentSpeed':
                    sendResponse({ speed: this.currentSpeed, videoCount: this.videos.length });
                    break;
                    
                case 'getVideoInfo':
                    sendResponse({
                        videoCount: this.videos.length,
                        speed: this.currentSpeed,
                        hasActiveVideo: this.hasActiveVideo()
                    });
                    break;
                    
                default:
                    sendResponse({ error: 'Unknown action' });
            }
            
            return true; // Keep message channel open for async response
        });
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Only work when no input is focused
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) {
                return;
            }

            // Check if any video is playing
            if (!this.hasActiveVideo()) {
                return;
            }

            let handled = false;

            switch (e.code) {
                case 'Minus':
                case 'NumpadSubtract':
                    if (e.shiftKey) {
                        this.adjustSpeed(-0.25);
                        handled = true;
                    }
                    break;
                    
                case 'Equal':
                case 'NumpadAdd':
                    if (e.shiftKey) {
                        this.adjustSpeed(0.25);
                        handled = true;
                    }
                    break;
                    
                case 'Digit0':
                case 'Numpad0':
                    if (e.shiftKey) {
                        this.setSpeed(1.0);
                        handled = true;
                    }
                    break;
            }

            if (handled) {
                e.preventDefault();
                e.stopPropagation();
            }
        });
    }

    setSpeed(speed) {
        if (speed < 0.1 || speed > 16) {
            return false;
        }

        this.currentSpeed = speed;
        this.syncAllVideos();
        this.updateSpeedDisplay();
        return true;
    }

    adjustSpeed(delta) {
        const newSpeed = Math.round((this.currentSpeed + delta) * 100) / 100;
        return this.setSpeed(Math.max(0.1, Math.min(16, newSpeed)));
    }

    syncAllVideos() {
        this.videos.forEach(video => {
            if (video.readyState >= 1) { // HAVE_METADATA
                video.playbackRate = this.currentSpeed;
            }
        });
    }

    hasActiveVideo() {
        return this.videos.some(video => !video.paused && video.currentTime > 0);
    }

    createSpeedDisplay() {
        this.speedDisplay = document.createElement('div');
        this.speedDisplay.id = 'video-speed-display';
        this.speedDisplay.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-family: 'Segoe UI', Arial, sans-serif;
            font-size: 14px;
            font-weight: 600;
            z-index: 10000;
            backdrop-filter: blur(10px);
            border: 2px solid rgba(66, 133, 244, 0.3);
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            transition: all 0.3s ease;
            opacity: 0;
            transform: translateY(-10px);
            pointer-events: none;
            user-select: none;
        `;
        
        document.body.appendChild(this.speedDisplay);
        this.updateSpeedDisplay();
    }

    updateSpeedDisplay() {
        if (!this.speedDisplay) return;

        this.speedDisplay.textContent = `Tốc độ: ${this.currentSpeed}x`;
        
        // Show display temporarily
        this.showSpeedDisplay();
    }

    showSpeedDisplay() {
        if (!this.speedDisplay) return;

        // Clear any existing timeout
        if (this.displayTimeout) {
            clearTimeout(this.displayTimeout);
        }

        // Show the display
        this.speedDisplay.style.opacity = '1';
        this.speedDisplay.style.transform = 'translateY(0)';

        // Hide after 2 seconds
        this.displayTimeout = setTimeout(() => {
            if (this.speedDisplay) {
                this.speedDisplay.style.opacity = '0';
                this.speedDisplay.style.transform = 'translateY(-10px)';
            }
        }, 2000);
    }

    updateDisplayVisibility() {
        if (!this.speedDisplay) return;

        const hasVideo = this.videos.length > 0;
        this.speedDisplay.style.display = hasVideo ? 'block' : 'none';
    }

    destroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
        
        if (this.speedDisplay) {
            this.speedDisplay.remove();
        }
        
        if (this.displayTimeout) {
            clearTimeout(this.displayTimeout);
        }
    }
}

// Initialize the video speed manager
let videoSpeedManager = null;

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        videoSpeedManager = new VideoSpeedManager();
    });
} else {
    videoSpeedManager = new VideoSpeedManager();
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (videoSpeedManager) {
        videoSpeedManager.destroy();
    }
});

// Handle page navigation in SPAs
let lastUrl = location.href;
new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
        lastUrl = url;
        // Reinitialize after navigation
        setTimeout(() => {
            if (videoSpeedManager) {
                videoSpeedManager.findVideos();
            }
        }, 1000);
    }
}).observe(document, { subtree: true, childList: true });