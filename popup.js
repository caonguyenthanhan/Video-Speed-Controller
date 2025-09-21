class VideoSpeedController {
    constructor() {
        this.currentSpeed = 1.0;
    }

    init() {
        this.bindEvents();
        this.getCurrentSpeed();
        this.setupShortcutsToggle();
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

    async getCurrentSpeed() {
        try {
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