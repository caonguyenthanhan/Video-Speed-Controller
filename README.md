# Video Speed Controller

Một Chrome Extension mạnh mẽ và dễ sử dụng giúp bạn điều khiển tốc độ phát video trên bất kỳ trang web nào.

![Video Speed Controller](icons/icon128.svg)

## ✨ Tính năng chính

- 🎯 **Điều khiển tốc độ linh hoạt**: Từ 0.1x đến 16x
- 🚀 **8 nút tốc độ nhanh**: 0.25x, 0.5x, 0.75x, 1x, 1.25x, 1.5x, 1.75x, 2x
- 🎛️ **Điều chỉnh tinh**: ±0.25x với nút Fine Control
- ⌨️ **Phím tắt**: Shift + (-/+/0) để điều khiển nhanh
- 📺 **Hiển thị trực quan**: Thông báo tốc độ trên màn hình
- 🌐 **Tương thích rộng**: YouTube, Netflix, Vimeo và mọi trang web
- 🔄 **Hỗ trợ đa video**: Điều khiển nhiều video cùng lúc
- ⚡ **Hiệu suất cao**: Không ảnh hưởng đến trải nghiệm duyệt web

## 🚀 Cài đặt

### Cài đặt từ mã nguồn (Developer Mode)

1. **Tải mã nguồn**: Clone hoặc download repository này
2. **Mở Chrome Extensions**: Truy cập `chrome://extensions/`
3. **Bật Developer Mode**: Toggle switch ở góc trên phải
4. **Load Extension**: Click "Load unpacked" và chọn thư mục dự án
5. **Hoàn tất**: Extension sẽ xuất hiện trên thanh công cụ

### Tương thích

- ✅ Google Chrome (Khuyến nghị)
- ✅ Microsoft Edge
- ✅ Brave Browser
- ✅ Các trình duyệt Chromium khác

## 📖 Hướng dẫn sử dụng

### Giao diện Popup

1. **Click vào icon** Video Speed Controller trên thanh công cụ
2. **Chọn tốc độ nhanh**: Click vào các nút 0.25x - 2x
3. **Điều chỉnh tinh**: Sử dụng nút -0.25, Reset, +0.25
4. **Tốc độ tùy chỉnh**: Nhập giá trị từ 0.1 đến 16 và nhấn Enter

### Phím tắt

| Phím tắt | Chức năng |
|----------|-----------|
| `Shift + -` | Giảm tốc độ 0.25x |
| `Shift + +` | Tăng tốc độ 0.25x |
| `Shift + 0` | Reset về tốc độ 1x |
| `Ctrl + Alt + ↑` hoặc `Ctrl + Shift + ↑` | Reset về tốc độ 1x |
| `Ctrl + Alt + ↓` hoặc `Ctrl + Shift + ↓` | Mở màn hình điều khiển |
| `Ctrl + Alt + →` hoặc `Ctrl + Shift + →` | Tăng tốc độ 0.25x |
| `Ctrl + Alt + ←` hoặc `Ctrl + Shift + ←` | Giảm tốc độ 0.25x |

### Hiển thị trên màn hình

- Tốc độ hiện tại được hiển thị ở góc trên trái video
- Tự động ẩn sau 2 giây
- Màu sắc thay đổi theo tốc độ (xanh: bình thường, cam: nhanh, xanh lá: chậm)

## 🎯 Các trường hợp sử dụng

### 📚 Học tập
- **Video giáo dục**: Tăng tốc phần dễ, giảm tốc phần khó
- **Khóa học online**: Điều chỉnh theo tốc độ học của bạn
- **Học ngôn ngữ**: Giảm tốc để nghe rõ phát âm

### 🎬 Giải trí
- **YouTube**: Bỏ qua intro/outro, xem nhanh nội dung
- **Netflix**: Điều chỉnh tốc độ phim/series
- **Twitch**: Xem lại highlight với tốc độ phù hợp

### 💼 Công việc
- **Video hội nghị**: Xem lại meeting nhanh chóng
- **Tutorial**: Phân tích từng bước chi tiết
- **Presentation**: Điều chỉnh theo nhu cầu

## 🔧 Tính năng kỹ thuật

- **Manifest V3**: Tương thích với tiêu chuẩn mới nhất
- **Không phụ thuộc**: Không cần thư viện bên ngoài
- **Hiệu suất cao**: Sử dụng MutationObserver để theo dõi DOM
- **Xử lý lỗi**: Graceful error handling và user feedback
- **SPA Support**: Hoạt động với Single Page Applications

## 🐛 Khắc phục sự cố

### Extension không hoạt động?
1. Refresh trang web
2. Kiểm tra extension đã được bật
3. Thử click vào video trước khi sử dụng

### Phím tắt không hoạt động?
1. Đảm bảo focus vào trang web (không phải address bar)
2. Kiểm tra không có extension khác sử dụng phím tắt tương tự

### Video không thay đổi tốc độ?
1. Một số trang web có thể chặn thay đổi tốc độ
2. Thử refresh trang và sử dụng lại
3. Kiểm tra video đã được load hoàn toàn

## 🤝 Đóng góp

Chúng tôi hoan nghênh mọi đóng góp! Vui lòng:

1. Fork repository
2. Tạo feature branch
3. Commit changes
4. Push và tạo Pull Request

## 📄 Giấy phép

MIT License - Xem file [LICENSE](LICENSE) để biết chi tiết.

## 🔗 Liên kết

- [Hướng dẫn cài đặt chi tiết](INSTALL.md)
- [Báo cáo lỗi](https://github.com/your-repo/issues)
- [Yêu cầu tính năng](https://github.com/your-repo/issues)

---

**Phiên bản**: 1.0.0  
**Tác giả**: Video Speed Controller Team  
**Cập nhật**: 2024

> 💡 **Mẹo**: Sử dụng phím tắt để điều khiển nhanh chóng mà không cần mở popup!

