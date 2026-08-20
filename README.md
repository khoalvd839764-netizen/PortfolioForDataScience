# Lê Võ Đăng Khoa - Data Science & AI Portfolio

> Website Portfolio cá nhân hiện đại với giao diện Glassmorphism, hiệu ứng Cyber/Neon và tích hợp Trợ lý Trí tuệ Nhân tạo (Khoa's AI Assistant) chạy trên Gemini 1.5/2.0 Flash qua Vercel Serverless/Edge Functions.

---

## 🚀 Hướng dẫn Deploy lên Vercel (Khuyên dùng)

### Cách 1: Deploy qua Vercel Dashboard (Tự động CI/CD khi Git Push)

1. Đẩy mã nguồn lên repository GitHub của bạn:
   ```bash
   git add .
   git commit -m "Optimize for Vercel deployment with AI Chatbot Serverless Function"
   git push origin main
   ```
2. Truy cập [Vercel Dashboard](https://vercel.com/dashboard) và bấm **"Add New..."** ➔ **"Project"**.
3. Chọn GitHub repository của bạn và bấm **"Import"**.
4. Cấu hình Project trên Vercel:
   - **Framework Preset**: `Vite` (Vercel tự động nhận diện từ `vercel.json`).
   - **Build Command**: `vite build` (mặc định).
   - **Output Directory**: `dist` (mặc định).
5. **Thêm biến môi trường (Environment Variables)**:
   - Tên biến: `GEMINI_API_KEY`
   - Giá trị: API Key lấy từ [Google AI Studio](https://aistudio.google.com/app/apikey).
6. Bấm nút **"Deploy"**. Website và API AI Chatbot sẽ sẵn sàng sau vài chục giây!

---

### Cách 2: Deploy trực tiếp bằng Vercel CLI

1. Cài đặt và đăng nhập Vercel CLI (nếu chưa có):
   ```bash
   npx vercel login
   ```
2. Chạy lệnh deploy:
   ```bash
   npx vercel --prod
   ```
3. Thêm biến môi trường trên Vercel:
   ```bash
   npx vercel env add GEMINI_API_KEY
   ```

---

## 💻 Chạy và phát triển ở môi trường Local

1. Cài đặt các gói phụ thuộc:
   ```bash
   npm install
   ```
2. Tạo file `.env` từ file mẫu `.env.example`:
   ```bash
   cp .env.example .env
   ```
   *Điền `GEMINI_API_KEY=...` vào file `.env`.*

3. Chạy dev server:
   ```bash
   npm run dev
   ```
   *Dev server sẽ khởi chạy tại `http://localhost:8443` hoặc cổng được chỉ định.*

4. Build kiểm tra bản phát hành:
   ```bash
   npm run build
   ```
