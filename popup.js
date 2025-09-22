class VideoSpeedController {
    constructor() {
        this.currentSpeed = 1.0;
    }

    init() {
        this.bindEvents();
        this.getCurrentSpeed();
        this.setupShortcutsToggle();
        this.setupShortcutSettings();
        this.loadShortcutSettings();
    }

    bindEvents() {
        // Thanh trượt tốc độ
        const speedSlider = document.getElementById('speedSlider');
        if (speedSlider) {
            speedSlider.addEventListener('input', (e) => {
                let speed = parseFloat(e.target.value);
                
                // Snap to marks logic - dính vào các vạch khi gần
                const snapMarks = [0.1, 0.25, 0.5, 0.75, 1, 1.5, 1.75, 2, 3, 5];
                const snapThreshold = 0.1; // Khoảng cách để snap
                
                for (const mark of snapMarks) {
                    if (Math.abs(speed - mark) <= snapThreshold) {
                        speed = mark;
                        e.target.value = speed; // Cập nhật giá trị slider
                        break;
                    }
                }
                
                this.setSpeed(speed);
                this.updateSpeedDisplay(speed);
            });

            // Thêm visual feedback khi hover vào marks
            speedSlider.addEventListener('change', (e) => {
                const speed = parseFloat(e.target.value);
                this.highlightNearestMark(speed);
            });
        }

        // Nút tăng tốc độ
        const increaseBtn = document.getElementById('increaseSpeed');
        if (increaseBtn) {
            increaseBtn.addEventListener('click', () => {
                const currentSpeed = this.getCurrentSpeedValue();
                const newSpeed = Math.min(5, currentSpeed + 0.25);
                this.setSpeed(newSpeed);
                this.updateSpeedDisplay(newSpeed);
                this.updateSlider(newSpeed);
                this.highlightNearestMark(newSpeed);
            });
        }

        // Nút giảm tốc độ
        const decreaseBtn = document.getElementById('decreaseSpeed');
        if (decreaseBtn) {
            decreaseBtn.addEventListener('click', () => {
                const currentSpeed = this.getCurrentSpeedValue();
                const newSpeed = Math.max(0.1, currentSpeed - 0.25);
                this.setSpeed(newSpeed);
                this.updateSpeedDisplay(newSpeed);
                this.updateSlider(newSpeed);
                this.highlightNearestMark(newSpeed);
            });
        }

        // Nút Reset
        const resetBtn = document.getElementById('resetSpeed');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.setSpeed(1.0);
                this.updateSpeedDisplay(1.0);
                this.updateSlider(1.0);
                this.highlightNearestMark(1.0);
            });
        }

        // Click vào marks để jump đến giá trị đó
        const marks = document.querySelectorAll('.mark');
        marks.forEach(mark => {
            mark.addEventListener('click', () => {
                const value = parseFloat(mark.dataset.value);
                this.setSpeed(value);
                this.updateSpeedDisplay(value);
                this.updateSlider(value);
                this.highlightNearestMark(value);
            });
        });
    }

    setupShortcutsToggle() {
        const toggle = document.getElementById('shortcutsToggle');
        const section = document.getElementById('shortcutsSection');
        
        if (toggle && section) {
            // Mặc định ẩn shortcuts
            section.classList.add('collapsed');
            
            toggle.addEventListener('click', () => {
                section.classList.toggle('collapsed');
            });
        }
    }

    setupShortcutSettings() {
        const shortcutType = document.getElementById('shortcutType');
        const customShortcut = document.getElementById('customShortcut');
        const customDecrease = document.getElementById('customDecrease');
        const customIncrease = document.getElementById('customIncrease');
        const saveCustom = document.getElementById('saveCustom');

        // Handle shortcut type change
        if (shortcutType) {
            shortcutType.addEventListener('change', (e) => {
                const value = e.target.value;
                if (value === 'custom') {
                    customShortcut.style.display = 'flex';
                } else {
                    customShortcut.style.display = 'none';
                    this.saveShortcutSettings(value);
                    this.updateShortcutDisplay(value);
                }
            });
        }

        // Handle custom key capture
        let capturingKey = null;
        
        if (customDecrease) {
            customDecrease.addEventListener('focus', () => {
                capturingKey = 'decrease';
                customDecrease.placeholder = 'Nhấn tổ hợp phím...';
            });
        }

        if (customIncrease) {
            customIncrease.addEventListener('focus', () => {
                capturingKey = 'increase';
                customIncrease.placeholder = 'Nhấn tổ hợp phím...';
            });
        }

        // Capture key combinations
        document.addEventListener('keydown', (e) => {
            if (capturingKey && (document.activeElement === customDecrease || document.activeElement === customIncrease)) {
                e.preventDefault();
                
                const keys = [];
                if (e.ctrlKey) keys.push('Ctrl');
                if (e.altKey) keys.push('Alt');
                if (e.shiftKey) keys.push('Shift');
                if (e.metaKey) keys.push('Cmd');
                
                if (e.key && !['Control', 'Alt', 'Shift', 'Meta'].includes(e.key)) {
                    keys.push(e.key);
                }
                
                const keyCombo = keys.join('+');
                if (capturingKey === 'decrease') {
                    customDecrease.value = keyCombo;
                } else if (capturingKey === 'increase') {
                    customIncrease.value = keyCombo;
                }
                
                document.activeElement.blur();
                capturingKey = null;
            }
        });

        // Save custom shortcuts
        if (saveCustom) {
            saveCustom.addEventListener('click', () => {
                const decreaseKey = customDecrease.value;
                const increaseKey = customIncrease.value;
                
                if (decreaseKey && increaseKey) {
                    const customSettings = {
                        type: 'custom',
                        decrease: decreaseKey,
                        increase: increaseKey
                    };
                    this.saveShortcutSettings(customSettings);
                    this.updateShortcutDisplay('custom', customSettings);
                    this.showStatus('Đã lưu phím tắt tùy chỉnh!', 'success');
                } else {
                    this.showStatus('Vui lòng thiết lập cả hai phím tắt!', 'error');
                }
            });
        }
    }

    async loadShortcutSettings() {
        try {
            // Check if chrome.storage is available
            if (!chrome || !chrome.storage || !chrome.storage.sync) {
                console.warn('Chrome storage API not available');
                this.setDefaultShortcutSettings();
                return;
            }

            const result = await chrome.storage.sync.get(['shortcutSettings']);
            const settings = result.shortcutSettings || { type: 'ctrl+shift' };
            
            const shortcutType = document.getElementById('shortcutType');
            const customShortcut = document.getElementById('customShortcut');
            
            if (shortcutType) {
                shortcutType.value = settings.type;
                
                if (settings.type === 'custom') {
                    customShortcut.style.display = 'flex';
                    if (settings.decrease) document.getElementById('customDecrease').value = settings.decrease;
                    if (settings.increase) document.getElementById('customIncrease').value = settings.increase;
                }
            }
            
            this.updateShortcutDisplay(settings.type, settings);
        } catch (error) {
            console.error('Error loading shortcut settings:', error);
            this.setDefaultShortcutSettings();
        }
    }

    setDefaultShortcutSettings() {
        const settings = { type: 'ctrl+shift' };
        const shortcutType = document.getElementById('shortcutType');
        const customShortcut = document.getElementById('customShortcut');
        
        if (shortcutType) {
            shortcutType.value = settings.type;
            customShortcut.style.display = 'none';
        }
        
        this.updateShortcutDisplay(settings.type, settings);
    }

    async saveShortcutSettings(settings) {
        try {
            // Check if chrome.storage is available
            if (!chrome || !chrome.storage || !chrome.storage.sync) {
                console.warn('Chrome storage API not available - settings not saved');
                this.showStatus('Không thể lưu cài đặt (Chrome API không khả dụng)', 'error');
                return;
            }

            const settingsToSave = typeof settings === 'string' ? { type: settings } : settings;
            await chrome.storage.sync.set({ shortcutSettings: settingsToSave });
            
            // Send message to content script to update shortcuts
            if (chrome.tabs && chrome.tabs.query) {
                try {
                    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
                    if (tabs[0] && chrome.tabs.sendMessage) {
                        chrome.tabs.sendMessage(tabs[0].id, {
                            action: 'updateShortcuts',
                            settings: settingsToSave
                        }).catch(err => {
                            console.warn('Could not send message to content script:', err);
                        });
                    }
                } catch (tabError) {
                    console.warn('Could not access tabs API:', tabError);
                }
            }
        } catch (error) {
            console.error('Error saving shortcut settings:', error);
            this.showStatus('Lỗi khi lưu cài đặt phím tắt', 'error');
        }
    }

    updateShortcutDisplay(type, customSettings = null) {
        const display = document.getElementById('shortcutDisplay');
        if (!display) return;

        let text = '';
        switch (type) {
            case 'ctrl+shift':
                text = 'Ctrl+Shift+← / → để điều chỉnh tốc độ';
                break;
            case 'ctrl+alt':
                text = 'Ctrl+Alt+← / → để điều chỉnh tốc độ';
                break;
            case 'custom':
                if (customSettings && customSettings.decrease && customSettings.increase) {
                    text = `${customSettings.decrease} / ${customSettings.increase} để điều chỉnh tốc độ`;
                } else {
                    text = 'Phím tắt tùy chỉnh chưa được thiết lập';
                }
                break;
            default:
                text = 'Ctrl+Shift+← / → để điều chỉnh tốc độ';
        }
        
        display.textContent = text;
    }

    async getCurrentSpeed() {
        try {
            // Check if chrome.tabs is available
            if (!chrome || !chrome.tabs || !chrome.tabs.query) {
                console.warn('Chrome tabs API not available');
                this.showStatus('Chrome API không khả dụng', 'warning');
                return;
            }

            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            
            let response;
            try {
                response = await chrome.tabs.sendMessage(tab.id, {
                    action: 'getCurrentSpeed'
                });
            } catch (connectionError) {
                console.log('Content script not found, injecting...');
                await this.injectContentScript(tab.id);
                
                await new Promise(resolve => setTimeout(resolve, 100));
                
                try {
                    response = await chrome.tabs.sendMessage(tab.id, {
                        action: 'getCurrentSpeed'
                    });
                } catch (retryError) {
                    this.showStatus('Không tìm thấy video trên trang này', 'warning');
                    return;
                }
            }

            if (response && response.speed !== undefined) {
                this.updateSpeedDisplay(response.speed);
                this.updateSlider(response.speed);
                this.showStatus('Đã kết nối với video', 'success');
            } else {
                this.showStatus('Không tìm thấy video trên trang này', 'warning');
            }
        } catch (error) {
            this.showStatus('Lỗi khi lấy thông tin tốc độ video', 'error');
            console.error('Error getting current speed:', error);
        }
    }

    async injectContentScript(tabId) {
        try {
            await chrome.scripting.executeScript({
                target: { tabId: tabId },
                files: ['content.js']
            });
        } catch (error) {
            console.error('Failed to inject content script:', error);
            throw error;
        }
    }

    async setSpeed(speed) {
        if (speed < 0.1 || speed > 16) {
            this.showStatus('Tốc độ phải từ 0.1x đến 16x', 'error');
            return;
        }

        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            
            let response;
            try {
                response = await chrome.tabs.sendMessage(tab.id, {
                    action: 'setSpeed',
                    speed: speed
                });
            } catch (connectionError) {
                console.log('Content script not found, injecting...');
                await this.injectContentScript(tab.id);
                
                await new Promise(resolve => setTimeout(resolve, 100));
                
                response = await chrome.tabs.sendMessage(tab.id, {
                    action: 'setSpeed',
                    speed: speed
                });
            }

            if (response && response.success) {
                this.currentSpeed = speed;
                this.showStatus(`Đã đặt tốc độ ${speed.toFixed(2)}x`, 'success');
            } else {
                this.showStatus(response?.error || 'Không thể thay đổi tốc độ video', 'error');
            }
        } catch (error) {
            this.showStatus('Lỗi khi thay đổi tốc độ video', 'error');
            console.error('Error setting speed:', error);
        }
    }

    updateSpeedDisplay(speed) {
        const speedDisplay = document.getElementById('currentSpeed');
        if (speedDisplay) {
            speedDisplay.textContent = `${speed.toFixed(2)}x`;
        }
        this.currentSpeed = speed;
    }

    updateSlider(speed) {
        const slider = document.getElementById('speedSlider');
        if (slider) {
            slider.value = speed;
        }
    }

    getCurrentSpeedValue() {
        const speedDisplay = document.getElementById('currentSpeed');
        if (speedDisplay) {
            const speedText = speedDisplay.textContent;
            return parseFloat(speedText.replace('x', ''));
        }
        return 1.0; // Default fallback
    }

    highlightNearestMark(currentSpeed) {
        const marks = document.querySelectorAll('.mark');
        const snapMarks = [0.1, 0.25, 0.5, 0.75, 1, 1.5, 1.75, 2, 3, 5];
        
        // Xóa highlight cũ
        marks.forEach(mark => mark.classList.remove('active'));
        
        // Tìm mark gần nhất
        let nearestMark = null;
        let minDistance = Infinity;
        
        snapMarks.forEach((markValue, index) => {
            const distance = Math.abs(currentSpeed - markValue);
            if (distance < minDistance) {
                minDistance = distance;
                nearestMark = marks[index];
            }
        });
        
        // Highlight mark gần nhất nếu đủ gần
        if (nearestMark && minDistance <= 0.1) {
            nearestMark.classList.add('active');
        }
    }

    showStatus(message, type = 'info') {
        const statusElement = document.getElementById('statusMessage');
        const statusContainer = document.querySelector('.status');
        
        statusElement.textContent = message;
        
        statusContainer.classList.remove('success', 'error', 'warning');
        
        if (type !== 'info') {
            statusContainer.classList.add(type);
        }

        if (type === 'success' || type === 'warning') {
            setTimeout(() => {
                if (statusContainer.classList.contains(type)) {
                    statusContainer.classList.remove(type);
                    statusElement.textContent = 'Sẵn sàng điều khiển video';
                }
            }, 3000);
        }
    }
}

// Initialize controller when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const controller = new VideoSpeedController();
    controller.init();
});

// Keyboard shortcuts - Updated to new key combinations
document.addEventListener('keydown', (e) => {
    // Check for Ctrl+Shift+Arrow (Windows/Linux) or Cmd+Shift+Arrow (Mac)
    const isCtrlOrCmd = e.ctrlKey || e.metaKey;
    
    if (isCtrlOrCmd && e.shiftKey) {
        if (e.key === 'ArrowRight') {
            e.preventDefault();
            // Increase speed by 0.25
            const currentSlider = document.getElementById('speedSlider');
            if (currentSlider) {
                const newSpeed = Math.min(16, parseFloat(currentSlider.value) + 0.25);
                currentSlider.value = newSpeed;
                currentSlider.dispatchEvent(new Event('input'));
            }
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            // Decrease speed by 0.25
            const currentSlider = document.getElementById('speedSlider');
            if (currentSlider) {
                const newSpeed = Math.max(0.1, parseFloat(currentSlider.value) - 0.25);
                currentSlider.value = newSpeed;
                currentSlider.dispatchEvent(new Event('input'));
            }
        }
    }
});