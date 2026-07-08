let videoHandles = [];
let currentObjectUrl = null;
let targetSpeed = 1.0;
let isChangingVideo = false; // Cờ chặn trình duyệt tự reset tốc độ

const videoPlayer = document.getElementById('videoPlayer');
const playerWrapper = document.getElementById('playerWrapper');
const floatingControls = document.getElementById('floatingControls');
const fileNameDisplay = document.getElementById('fileName');

const selectFolderBtn = document.getElementById('selectFolderBtn');
const randomBtn = document.getElementById('randomBtn');
const speedControls = document.getElementById('speedControls');
const utilityControls = document.getElementById('utilityControls');
const fullscreenBtn = document.getElementById('fullscreenBtn');

const localSpeedSlider = document.getElementById('localSpeedSlider');
const localSpeedDisplay = document.getElementById('localSpeedDisplay');
const speedDown = document.getElementById('speedDown');
const speedUp = document.getElementById('speedUp');
const speedReset = document.getElementById('speedReset');

// ================= 1. LOGIC ĐIỀU KHIỂN TỐC ĐỘ =================
function updateSpeed(speed) {
    // CHÚ Ý: Chrome giới hạn cứng tốc độ tối đa là 16x. Đặt quá 16x sẽ gây lỗi NotSupportedError.
    targetSpeed = Math.max(0.1, Math.min(16, speed));

    try {
        videoPlayer.playbackRate = targetSpeed;
        localSpeedSlider.value = targetSpeed;
        localSpeedDisplay.textContent = targetSpeed.toFixed(2) + 'x';
    } catch (e) {
        console.error("Lỗi set tốc độ:", e);
    }
}

localSpeedSlider.addEventListener('input', (e) => updateSpeed(parseFloat(e.target.value)));
speedDown.addEventListener('click', () => updateSpeed(targetSpeed - 0.25));
speedUp.addEventListener('click', () => updateSpeed(targetSpeed + 0.25));
speedReset.addEventListener('click', () => updateSpeed(1.0));

// Chống Browser tự reset tốc độ, đồng thời đồng bộ hóa nếu bạn dùng phím tắt của Extension
videoPlayer.addEventListener('ratechange', () => {
    const currentBrowserSpeed = videoPlayer.playbackRate;
    
    if (isChangingVideo) {
        // Nếu sự kiện ratechange xảy ra do ta vừa gắn link video mới -> ép quay lại targetSpeed
        if (currentBrowserSpeed !== targetSpeed) {
            videoPlayer.playbackRate = targetSpeed;
        }
    } else {
        // Nếu người dùng xài phím tắt từ Extension chính của bạn, update lại slider cho đồng bộ
        if (Math.abs(currentBrowserSpeed - targetSpeed) > 0.01) {
            targetSpeed = currentBrowserSpeed;
            localSpeedSlider.value = targetSpeed;
            localSpeedDisplay.textContent = targetSpeed.toFixed(2) + 'x';
        }
    }
});

// ================= 2. LOGIC QUÉT VÀ BỐC VIDEO =================
async function getMp4FilesRecursively(dirHandle) {
    let files = [];
    for await (const entry of dirHandle.values()) {
        if (entry.kind === 'file' && entry.name.toLowerCase().endsWith('.mp4')) {
            files.push(entry);
        } else if (entry.kind === 'directory') {
            const subFiles = await getMp4FilesRecursively(entry);
            files.push(...subFiles);
        }
    }
    return files;
}

selectFolderBtn.addEventListener('click', async () => {
    try {
        const dirHandle = await window.showDirectoryPicker();
        fileNameDisplay.textContent = "Đang quét thư mục, vui lòng đợi...";
        videoHandles = await getMp4FilesRecursively(dirHandle);

        if (videoHandles.length > 0) {
            randomBtn.style.display = 'flex';
            speedControls.style.display = 'flex';
            utilityControls.style.display = 'flex';
            selectFolderBtn.textContent = "📁 Đổi thư mục";
            playRandomVideo();
        } else {
            fileNameDisplay.textContent = "Không tìm thấy tệp .mp4 nào!";
            randomBtn.style.display = 'none';
            speedControls.style.display = 'none';
            utilityControls.style.display = 'none';
        }
    } catch (err) {
        console.error("Lỗi:", err);
        if (videoHandles.length === 0) fileNameDisplay.textContent = "Đã hủy thao tác.";
    }
});

randomBtn.addEventListener('click', playRandomVideo);

async function playRandomVideo() {
    if (videoHandles.length === 0) return;

    isChangingVideo = true; // Bật cờ "Khóa reset" trước khi đổi source

    if (currentObjectUrl) URL.revokeObjectURL(currentObjectUrl);

    const randomHandle = videoHandles[Math.floor(Math.random() * videoHandles.length)];

    try {
        const file = await randomHandle.getFile();
        currentObjectUrl = URL.createObjectURL(file);

        videoPlayer.src = currentObjectUrl;
        fileNameDisplay.textContent = file.name;

        // Ép tốc độ ngay lập tức trước khi nó kịp Play
        videoPlayer.playbackRate = targetSpeed;

        await videoPlayer.play().catch(e => console.log("Autoplay bị chặn:", e));
    } catch (err) {
        console.error("Lỗi file:", err);
        fileNameDisplay.textContent = "Lỗi khi đọc file!";
    }

    // Tắt cờ Khóa sau nửa giây để cho phép Extension chính hoạt động trở lại
    setTimeout(() => { isChangingVideo = false; }, 500);
}

// ================= 3. TOÀN MÀN HÌNH VÀ TỰ ĐỘNG ẨN UI =================
fullscreenBtn.addEventListener('click', () => {
    // Phóng to toàn bộ div bao ngoài, giúp thanh UI không bị che lấp
    if (!document.fullscreenElement) {
        playerWrapper.requestFullscreen().catch(err => console.error(err));
    } else {
        document.exitFullscreen();
    }
});

document.addEventListener('fullscreenchange', () => {
    if (document.fullscreenElement) {
        fullscreenBtn.textContent = "↙️ Thoát Fullscreen";
    } else {
        fullscreenBtn.textContent = "🔲 Toàn màn hình";
    }
});

let hideTimeout;
playerWrapper.addEventListener('mousemove', () => {
    // Hiện UI khi di chuột
    floatingControls.style.opacity = '1';
    fileNameDisplay.style.opacity = '1';
    playerWrapper.style.cursor = 'default';

    clearTimeout(hideTimeout);
    hideTimeout = setTimeout(() => {
        // Chỉ ẩn đi khi video đang chạy (không ẩn khi đang Pause)
        if (!videoPlayer.paused) {
            floatingControls.style.opacity = '0';
            fileNameDisplay.style.opacity = '0';
            playerWrapper.style.cursor = 'none'; // Giấu luôn con trỏ chuột
        }
    }, 2500);
});

videoPlayer.addEventListener('pause', () => {
    floatingControls.style.opacity = '1';
    fileNameDisplay.style.opacity = '1';
    playerWrapper.style.cursor = 'default';
    clearTimeout(hideTimeout);
});

// Tự động phát video ngẫu nhiên tiếp theo khi video hiện tại kết thúc
videoPlayer.addEventListener('ended', playRandomVideo);