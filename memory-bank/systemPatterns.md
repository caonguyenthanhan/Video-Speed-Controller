# System Patterns: Video Speed Controller

## Kiến trúc tổng thể
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   popup.html    │    │   content.js    │    │   Web Page      │
│   popup.css     │◄──►│                 │◄──►│   (Videos)      │
│   popup.js      │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
        ▲                        ▲
        │                        │
        ▼                        ▼
┌─────────────────┐    ┌─────────────────┐
│  manifest.json  │    │   Background    │
│                 │    │   (Messages)    │
└─────────────────┘    └─────────────────┘
```

## Mẫu thiết kế chính

### 1. Message Passing Pattern
- **popup.js → content.js**: Gửi lệnh thay đổi tốc độ
- **content.js → popup.js**: Trả về trạng thái hiện tại
- Sử dụng `chrome.tabs.sendMessage()` và `chrome.runtime.onMessage`

### 2. Observer Pattern
- **MutationObserver**: Theo dõi DOM changes để phát hiện video mới
- **Event Listeners**: Lắng nghe video events (play, pause, ratechange)
- **Interval Checking**: Kiểm tra video mới mỗi 2 giây

### 3. State Management Pattern
- **Centralized State**: VideoSpeedManager class quản lý trạng thái
- **Sync Pattern**: Đồng bộ tốc độ cho tất cả video trên trang
- **Persistence**: Duy trì tốc độ khi chuyển video

### 4. UI Component Pattern
- **Modular CSS**: Tách biệt styles cho từng component
- **Event Delegation**: Xử lý events hiệu quả
- **State Reflection**: UI phản ánh trạng thái thực tế

## Mối quan hệ thành phần

### Core Classes
1. **VideoSpeedController** (popup.js): Quản lý UI và user interactions
2. **VideoSpeedManager** (content.js): Quản lý video elements và playback

### Key Methods
- `setSpeed(speed)`: Thay đổi tốc độ video
- `findVideos()`: Tìm và theo dõi video elements
- `updateUI(speed)`: Cập nhật giao diện người dùng
- `syncAllVideos()`: Đồng bộ tốc độ cho tất cả video

### Communication Flow
1. User clicks button → popup.js
2. popup.js sends message → content.js
3. content.js updates video.playbackRate
4. content.js sends response → popup.js
5. popup.js updates UI

## Error Handling Patterns
- **Graceful Degradation**: Hoạt động ngay cả khi không có video
- **User Feedback**: Hiển thị status messages rõ ràng
- **Retry Logic**: Tự động retry khi message fails
- **Validation**: Kiểm tra input ranges (0.1-16x)