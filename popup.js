class VideoSpeedController {
    constructor() {
        this.currentSpeed = 1.0;
        this.init();
    }

    init() {
        this.bindEvents();
        this.getCurrentSpeed();
    }

    bindEvents() {
        // Preset speed buttons
        const speedButtons = document.querySelectorAll('.speed-btn');
        speedButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const speed = parseFloat(e.target.dataset.speed);
                this.setSpeed(speed);
            });
        });

        // Fine control buttons
        document.getElementById('decreaseSpeed').addEventListener('click', () => {
            this.adjustSpeed(-0.25);
        });

        document.getElementById('increaseSpeed').addEventListener('click', () => {
            this.adjustSpeed(0.25);
        });

        document.getElementById('resetSpeed').addEventListener('click', () => {
            this.setSpeed(1.0);
        });

        // Custom speed input
        document.getElementById('applyCustomSpeed').addEventListener('click', () => {
            this.applyCustomSpeed();
        });

        document.getElementById('customSpeedInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.applyCustomSpeed();
            }
        });

        // Update custom input when speed changes
        document.getElementById('customSpeedInput').addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            if (value >= 0.1 && value <= 16) {
                e.target.style.borderColor = '#4285f4';
            } else {
                e.target.style.borderColor = '#ea4335';
            }
        });
    }

    async getCurrentSpeed() {
        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            
            const response = await chrome.tabs.sendMessage(tab.id, {
                action: 'getCurrentSpeed'
            });

            if (response && response.speed !== undefined) {
                this.updateUI(response.speed);
                this.showStatus('Đã kết nối với video', 'success');
            } else {
                this.showStatus('Không tìm thấy video trên trang này', 'error');
            }
        } catch (error) {
            this.showStatus('Không thể kết nối với trang web', 'error');
            console.error('Error getting current speed:', error);
        }
    }

    async setSpeed(speed) {
        if (speed < 0.1 || speed > 16) {
            this.showStatus('Tốc độ phải từ 0.1x đến 16x', 'error');
            return;
        }

        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            
            const response = await chrome.tabs.sendMessage(tab.id, {
                action: 'setSpeed',
                speed: speed
            });

            if (response && response.success) {
                this.updateUI(speed);
                this.showStatus(`Đã đặt tốc độ ${speed}x`, 'success');
            } else {
                this.showStatus(response?.error || 'Không thể thay đổi tốc độ video', 'error');
            }
        } catch (error) {
            this.showStatus('Lỗi khi thay đổi tốc độ video', 'error');
            console.error('Error setting speed:', error);
        }
    }

    adjustSpeed(delta) {
        const newSpeed = Math.round((this.currentSpeed + delta) * 100) / 100;
        this.setSpeed(Math.max(0.1, Math.min(16, newSpeed)));
    }

    applyCustomSpeed() {
        const input = document.getElementById('customSpeedInput');
        const speed = parseFloat(input.value);
        
        if (isNaN(speed)) {
            this.showStatus('Vui lòng nhập số hợp lệ', 'error');
            return;
        }

        this.setSpeed(speed);
    }

    updateUI(speed) {
        this.currentSpeed = speed;
        
        // Update current speed display
        document.getElementById('currentSpeed').textContent = `${speed}x`;
        
        // Update custom input
        document.getElementById('customSpeedInput').value = speed;
        
        // Update active button
        const speedButtons = document.querySelectorAll('.speed-btn');
        speedButtons.forEach(btn => {
            btn.classList.remove('active');
            if (parseFloat(btn.dataset.speed) === speed) {
                btn.classList.add('active');
            }
        });
    }

    showStatus(message, type = 'info') {
        const statusElement = document.getElementById('statusMessage');
        const statusContainer = document.querySelector('.status');
        
        statusElement.textContent = message;
        
        // Remove existing status classes
        statusContainer.classList.remove('success', 'error');
        
        // Add new status class
        if (type !== 'info') {
            statusContainer.classList.add(type);
        }

        // Auto-hide success messages after 3 seconds
        if (type === 'success') {
            setTimeout(() => {
                if (statusContainer.classList.contains('success')) {
                    statusContainer.classList.remove('success');
                    statusElement.textContent = 'Sẵn sàng điều khiển video';
                }
            }, 3000);
        }
    }
}

// Initialize the controller when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new VideoSpeedController();
});

// Handle keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT') return;
    
    const controller = window.videoSpeedController;
    if (!controller) return;

    switch (e.key) {
        case '-':
        case '_':
            e.preventDefault();
            controller.adjustSpeed(-0.25);
            break;
        case '+':
        case '=':
            e.preventDefault();
            controller.adjustSpeed(0.25);
            break;
        case '0':
            e.preventDefault();
            controller.setSpeed(1.0);
            break;
        case '1':
            e.preventDefault();
            controller.setSpeed(1.0);
            break;
        case '2':
            e.preventDefault();
            controller.setSpeed(2.0);
            break;
    }
});

// Store controller instance globally for keyboard shortcuts
document.addEventListener('DOMContentLoaded', () => {
    window.videoSpeedController = new VideoSpeedController();
});