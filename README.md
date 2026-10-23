# KOC Nguyễn Hoa — Website Tiếp Thị Liên Kết

Website bio link cá nhân dành cho nhà sáng tạo nội dung trên TikTok, giúp người theo dõi khám phá sản phẩm, tìm kiếm theo danh mục và truy cập liên kết mua hàng. Tích hợp trang quản trị để quản lý nội dung và theo dõi lượt nhấp sản phẩm.

**🌐 Website:** https://koc-nguyenhoa.vercel.app/  
**💻 Mã nguồn:** https://github.com/HIEUVic/webcuahoa


## ✨ Tính năng chính

| **Người dùng** | **Admin** |
|---|---|
| Xem thông tin admin | Quản lý hồ sơ |
| Tìm kiếm sản phẩm | Quản trị sản phẩm |
| Xem sản phẩm theo danh mục | Quản lý danh mục |
| Truy cập nền tảng MXH của admin | Thống kê lượt nhấp |
| Truy cập sản phẩm qua link | Đăng nhập quản trị |


## 🛠️ Công nghệ sử dụng

| **Công nghệ** | **Mục đích** |
|---|---|
| React | Xây dựng giao diện người dùng |
| TypeScript | Kiểm soát kiểu dữ liệu |
| Vite | Phát triển và đóng gói ứng dụng |
| Tailwind CSS | Thiết kế giao diện |
| React Router | Điều hướng giữa các trang |
| Supabase | Cơ sở dữ liệu, xác thực và lưu trữ hình ảnh |
| Vercel | Triển khai website |

## 🚀 Cài đặt và chạy dự án

**Yêu cầu:** Node.js, npm và một dự án Supabase đã được cấu hình.

**1. Tải mã nguồn**

```bash
git clone https://github.com/HIEUVic/webcuahoa.git
cd webcuahoa
```

**2. Cài đặt thư viện**

```bash
npm install
```

**3. Cấu hình biến môi trường**

Tạo file `.env` tại thư mục gốc:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Thay giá trị mẫu bằng thông tin dự án Supabase của bạn.

**4. Khởi chạy ứng dụng**

```bash
npm run dev
```

**5. Tạo bản build**

```bash
npm run build
```

**Lưu ý:** Cơ sở dữ liệu, hàm RPC, kho lưu trữ hình ảnh và chính sách truy cập cần được cấu hình phù hợp trên Supabase. Không đưa khóa bí mật vào biến môi trường `VITE_*` phía trình duyệt.

## 📌 Trạng thái dự án

Website đã được triển khai và đang tiếp tục được cải tiến.

---
👨‍💻 Tác giả: **HIEUVic**

GitHub: [https://github.com/HIEUVic](https://github.com/HIEUVic)

Repository: [https://github.com/HIEUVic/webcuahoa](https://github.com/HIEUVic/webcuahoa)
