# Hướng dẫn cài đặt Video Speed Controller Extension

## 🚀 Cài đặt Extension

### Bước 1: Chuẩn bị
1. Đảm bảo bạn đang sử dụng Chrome, Edge, hoặc trình duyệt tương thích Chromium
2. Tải xuống hoặc clone mã nguồn extension về máy

### Bước 2: Cài đặt ở chế độ Developer
1. **Mở trang Extensions:**
   - Chrome: Truy cập `chrome://extensions/`
   - Edge: Truy cập `edge://extensions/`
   - Hoặc vào Menu → More Tools → Extensions

2. **Bật Developer Mode:**
   - Tìm toggle "Developer mode" ở góc trên bên phải
   - Bật nó lên

3. **Load Extension:**
   - Nhấp "Load unpacked" (Tải tiện ích đã giải nén)
   - Chọn thư mục chứa mã nguồn extension
   - Extension sẽ xuất hiện trong danh sách

## 🎮 Cách sử dụng

### Giao diện Popup
1. **Nhấp vào icon extension** trên thanh toolbar
2. **Chọn tốc độ nhanh:** Sử dụng các nút 0.25x, 0.5x, 0.75x, 1x, 1.25x, 1.5x, 1.75x, 2x
3. **Điều chỉnh tinh:** Dùng nút -0.25, Reset, +0.25
4. **Tốc độ tùy chỉnh:** Nhập giá trị từ 0.1 đến 16 và nhấn "Áp dụng"

### Phím tắt (khi có video đang phát)
- `Shift + -`: Giảm tốc độ 0.25x
- `Shift + +`: Tăng tốc độ 0.25x  
- `Shift + 0`: Reset về tốc độ 1x

### Hiển thị trên màn hình
- Khi thay đổi tốc độ, sẽ có thông báo hiển thị ở góc trên bên phải
- Thông báo tự động ẩn sau 2 giây

## ✨ Tính năng

### ✅ Đã hoàn thành
- [x] Điều khiển tốc độ video từ 0.1x đến 16x
- [x] Giao diện popup đẹp và hiện đại
- [x] Các nút tốc độ nhanh (preset speeds)
- [x] Điều chỉnh tinh với bước 0.25x
- [x] Nhập tốc độ tùy chỉnh
- [x] Phím tắt bàn phím
- [x] Hiển thị tốc độ hiện tại trên màn hình
- [x] Tự động phát hiện video mới
- [x] Hỗ trợ nhiều video cùng lúc
- [x] Hoạt động với SPA (Single Page Applications)
- [x] Giao diện responsive

### 🔄 Tương thích
- ✅ YouTube
- ✅ Vimeo  
- ✅ Netflix
- ✅ Twitch
- ✅ Facebook Video
- ✅ Twitter Video
- ✅ Các trang web có video HTML5

## 🛠️ Khắc phục sự cố

### Extension không hoạt động
1. Kiểm tra extension đã được bật trong trang Extensions
2. Refresh trang web có video
3. Kiểm tra console để xem có lỗi không

### Không tìm thấy video
1. Đảm bảo video đã load hoàn toàn
2. Thử refresh trang
3. Một số trang có thể load video muộn, hãy đợi một chút

### Phím tắt không hoạt động
1. Đảm bảo không có input nào đang được focus
2. Phím tắt chỉ hoạt động khi có video đang phát
3. Sử dụng Shift + phím để kích hoạt

## 📝 Ghi chú

- Extension hoạt động với tất cả video HTML5
- Tốc độ được áp dụng cho tất cả video trên trang
- Cài đặt tốc độ được duy trì khi chuyển video
- Extension không lưu cài đặt giữa các phiên (sẽ được thêm trong phiên bản sau)

## 🔧 Development

Để phát triển thêm:
1. Sửa đổi mã nguồn
2. Nhấn "Reload" trong trang Extensions
3. Test trên các trang web khác nhau

---

**Phiên bản:** 1.0.0  
**Tác giả:** Video Speed Controller Team  
**Giấy phép:** MIT