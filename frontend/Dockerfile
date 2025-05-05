# Giai đoạn build: Sử dụng Node để build dự án Vite
FROM node:18-alpine AS build

# Thiết lập thư mục làm việc
WORKDIR /app

# Sao chép package.json và package-lock.json
COPY package*.json ./

# Cài đặt dependencies
RUN npm install

# Sao chép toàn bộ mã nguồn
COPY . .

# Build dự án
RUN npm run build

# Giai đoạn production: Sử dụng Nginx để phục vụ các tệp đã build
FROM nginx:alpine

# Xóa cấu hình nginx mặc định
RUN rm -rf /usr/share/nginx/html/*

# Sao chép các tệp đã build từ giai đoạn build vào thư mục html của nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Cấu hình nginx để phục vụ ứng dụng SPA và chạy trên port 1888
RUN echo 'server { \
    listen 1888; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Mở port 1888
EXPOSE 1888

# Khởi động nginx
CMD ["nginx", "-g", "daemon off;"]