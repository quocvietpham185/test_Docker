# Chọn Node.js image làm base image
FROM node:18-alpine

# Thiết lập thư mục làm việc trong container
WORKDIR /NODEJS

# Copy package.json và yarn.lock (hoặc package-lock.json) vào container
COPY package.json ./
COPY package-lock.json ./   
# Nếu bạn dùng Yarn, còn npm thì không cần copy yarn.lock

# Cài đặt dependencies trong container
RUN npm install ts-node typescript --save-dev

# Copy toàn bộ mã nguồn vào container
COPY . .

# Build TypeScript code
RUN npx tsc

# Mở cổng 3000 để server có thể truy cập từ ngoài
EXPOSE 3000

# Lệnh để chạy ứng dụng
CMD ["npm", "start"]
