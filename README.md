# KOC Nguyễn Hoa — Affiliate Product Hub

**A Personal Bio Link & Affiliate Product Platform for Content Creators**  
*Nền tảng bio link và giới thiệu sản phẩm tiếp thị liên kết dành cho nhà sáng tạo nội dung.*

<p align="center">
  <a href="https://koc-nguyenhoa.vercel.app/">Live Demo</a> •
  <a href="https://github.com/HIEUVic/webcuahoa">GitHub Repository</a>
</p>

---

## 🇻🇳 Giới thiệu

**KOC Nguyễn Hoa** là website giới thiệu sản phẩm và tiếp thị liên kết được xây dựng dành riêng cho một nhà sáng tạo nội dung trên TikTok.

Website đóng vai trò như một trang bio link cá nhân, giúp người theo dõi khám phá sản phẩm được giới thiệu, tìm kiếm theo danh mục và truy cập liên kết mua hàng trên các nền tảng thương mại điện tử. Đi kèm là trang quản trị riêng để cập nhật sản phẩm, danh mục và thông tin hồ sơ mà không cần chỉnh sửa nội dung trực tiếp trong mã nguồn.

Dự án hướng đến một sản phẩm thực tế, kết hợp trải nghiệm người dùng, quản lý nội dung và tích hợp dịch vụ backend.

## 🇬🇧 About the Project

**KOC Nguyễn Hoa** is an affiliate product showcase website built for a TikTok content creator.

The website serves as a personal bio link hub where followers can discover recommended products, browse or search by category, and visit affiliate links on e-commerce platforms. A dedicated admin dashboard allows the manager to maintain products, categories, and profile information without editing the application source code directly.

The project focuses on a practical product that combines user experience, content management, and backend service integration.

---

## ✨ Tính năng chính | Key Features

### 🌐 Trang dành cho người truy cập | Public Website

- **Personal Profile:** Hiển thị thông tin cá nhân và hồ sơ của nhà sáng tạo nội dung.
- **Product Discovery:** Duyệt và tìm kiếm sản phẩm theo danh mục.
- **Product Showcase:** Hiển thị tên sản phẩm, hình ảnh, đánh giá sao và nền tảng bán hàng.
- **Affiliate Links:** Điều hướng người dùng đến liên kết sản phẩm được cung cấp.
- **Social Media Integration:** Liên kết đến các kênh Facebook, Instagram, YouTube và TikTok.

### 🔐 Trang quản trị | Admin Dashboard

- **Authentication:** Đăng nhập bằng email và mật khẩu thông qua Supabase Auth.
- **Product Management:** Thêm, sửa, xóa sản phẩm và bật/tắt trạng thái hiển thị.
- **Category Management:** Quản lý danh mục và thứ tự hiển thị.
- **Profile Management:** Cập nhật thông tin hồ sơ, lượng người theo dõi và liên kết mạng xã hội.
- **Image Upload & Cropping:** Tải lên và cắt ảnh đại diện hoặc ảnh sản phẩm.
- **Click Statistics:** Theo dõi và sắp xếp sản phẩm theo lượt nhấp được ghi nhận.

---

## 🛠️ Công nghệ sử dụng | Tech Stack

| Công nghệ | Vai trò |
|---|---|
| React 19 | Xây dựng giao diện người dùng |
| TypeScript | Kiểu dữ liệu và hỗ trợ phát triển |
| Vite | Development server và công cụ build |
| Tailwind CSS 4 | Thiết kế giao diện |
| React Router 7 | Điều hướng giữa các trang |
| Supabase | Backend services, database, authentication và storage |
| `@supabase/supabase-js` | Kết nối ứng dụng với Supabase |
| `react-easy-crop` | Cắt và căn chỉnh hình ảnh |
| Vercel | Triển khai website |

---

## 🚀 Cài đặt và chạy dự án | Getting Started

### 1. Yêu cầu | Prerequisites

- Node.js và npm.
- Git.
- Một dự án Supabase đã được cấu hình.
- Quyền truy cập vào repository.

### 2. Clone repository

```bash
git clone https://github.com/HIEUVic/webcuahoa.git
cd webcuahoa
```

### 3. Cài đặt dependencies | Install dependencies

```bash
npm install
```

### 4. Cấu hình biến môi trường | Configure environment variables

Tạo file `.env` tại thư mục gốc của dự án:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Thay các giá trị mẫu bằng thông tin của dự án Supabase của bạn.

**Lưu ý:** Dự án hiện sử dụng tên biến `VITE_SUPABASE_ANON_KEY`. Khi cấu hình, hãy giữ nguyên tên biến này trừ khi bạn cập nhật đồng bộ trong mã nguồn.

Do các biến có tiền tố `VITE_` được đưa vào mã nguồn phía trình duyệt, không đặt secret key hoặc thông tin quản trị nhạy cảm trong những biến này.

### 5. Khởi chạy môi trường phát triển | Start the development server

```bash
npm run dev
```

Mở URL được hiển thị trong terminal để truy cập website trên máy tính của bạn.

### 6. Build và kiểm tra bản production | Build for production

```bash
npm run build
npm run preview
```

Lệnh `npm run build` tạo bản build production. Lệnh `npm run preview` cho phép xem trước bản build trên máy local.

---

## 🗄️ Cấu hình Supabase | Supabase Configuration

Dự án sử dụng Supabase cho các chức năng sau:

- **Database:** Lưu thông tin hồ sơ, danh mục và sản phẩm.
- **Authentication:** Xác thực tài khoản quản trị.
- **Storage:** Lưu ảnh đại diện và ảnh sản phẩm.
- **RPC:** Ghi nhận lượt nhấp sản phẩm thông qua hàm `increment_click`.

### Lưu ý khi thiết lập | Setup Notes

Cấu trúc database hiện được tạo trực tiếp trên Supabase Dashboard. Repository chưa có file SQL khởi tạo database được xác nhận, vì vậy không thể giả định rằng chỉ cần chạy ứng dụng là các bảng và hàm RPC sẽ tự động được tạo.

Để triển khai trên một dự án Supabase mới, cần chuẩn bị đúng schema, hàm RPC, storage buckets và các chính sách truy cập phù hợp với mã nguồn.

**Security reminder:** Cần kiểm tra Row Level Security (RLS), quyền đọc/ghi dữ liệu và quyền truy cập storage trước khi triển khai trên một dự án mới. README này không xác nhận rằng các chính sách bảo mật hiện tại đã được kiểm toán.

---

## 🌍 Triển khai | Deployment

Website hiện được triển khai trên Vercel.

- **Live Website:** https://koc-nguyenhoa.vercel.app/
- **Source Code:** https://github.com/HIEUVic/webcuahoa

Khi triển khai một bản mới, hãy cấu hình các biến môi trường cần thiết trong phần Environment Variables của dự án Vercel, sau đó chạy build và kiểm tra website sau khi deployment hoàn tất.

---

## 📌 Trạng thái dự án | Project Status

Website đã được triển khai và đang trong giai đoạn cải tiến, mở rộng và hoàn thiện.

The website has been deployed and is currently undergoing iterative improvements and enhancements.

---

## 👨‍💻 Tác giả | Author

**HIEUVic**

GitHub: https://github.com/HIEUVic

---

*Built with React, TypeScript, Vite, and Supabase.*

*Được xây dựng với mục tiêu tạo ra một sản phẩm thực tế phục vụ hoạt động giới thiệu sản phẩm và tiếp thị liên kết.*
