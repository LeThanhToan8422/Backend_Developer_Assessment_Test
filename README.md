# Ứng Dụng Quản Lý Công Việc

## 1. Mở rộng và tối ưu hoá hiệu suất cho ứng dụng trong tương lai

### a. Mở rộng:

- **Tính năng mới**: Dễ dàng thêm các tính năng như nhắc nhở công việc qua email, quản lý phân quyền, hoặc thêm tag cho các công việc.
- **Caching**: Áp dụng cache (Redis) cho các dữ liệu truy vấn thường xuyên để giảm tải cơ sở dữ liệu.
- **GraphQL**: Thay thế hoặc kết hợp REST API với GraphQL để giảm số lượng request và lượng dữ liệu trả về.

### b. Tối ưu hoá hiệu suất:

- **Database Indexing**: Thêm chỉ mục (indexes) vào các trường truy vấn thường xuyên như `createdAt`, `deadline`, `status` để tối ưu tốc độ truy vấn.
- **Lazy Loading**: Sử dụng lazy loading cho các phần dữ liệu lớn hoặc hình ảnh trong ứng dụng.
- **Static Assets Optimization**: Nén và tối ưu hóa các file tĩnh như CSS, JS, và hình ảnh trước khi deploy, sử dụng CDN để phân phối tài nguyên nhanh hơn.
- **Load Balancer**: Sử dụng load balancer để phân phối lưu lượng truy cập đến nhiều server nếu cần mở rộng hệ thống.

## 2. Đảm bảo an toàn và bảo mật thông tin người dùng

- **Hash mật khẩu**: Sử dụng `bcryptjs` để hash mật khẩu trước khi lưu trữ vào cơ sở dữ liệu.
- **Authentication**: Sử dụng JWT (JSON Web Token) cho xác thực người dùng, có thể kèm refresh token để tăng cường bảo mật.
- **CSRF Protection**: Áp dụng bảo vệ chống Cross-Site Request Forgery (CSRF) trong các API khi người dùng thực hiện hành động.
- **Data Validation**: Kiểm tra và xác thực dữ liệu nhập từ người dùng (input validation) để ngăn chặn các lỗ hổng bảo mật như SQL Injection, XSS.
- **HTTPS**: Đảm bảo ứng dụng được triển khai trên môi trường sử dụng HTTPS để mã hóa dữ liệu giữa máy khách và máy chủ.
- **Rate Limiting & Brute Force Protection**: Áp dụng giới hạn số lượng request cho mỗi IP và bảo vệ trước các cuộc tấn công brute-force bằng cách khóa tài khoản tạm thời sau nhiều lần đăng nhập sai.
- **Audit Logging**: Ghi lại các hành động quan trọng của người dùng để dễ dàng kiểm tra các sự kiện bất thường.

## 3. Triển khai ứng dụng lên AWS

### a. Chuẩn bị môi trường

- **Máy chủ**: Sử dụng dịch vụ máy chủ ảo như AWS EC2, DigitalOcean, hoặc một nhà cung cấp cloud khác.
- **Cài đặt phần mềm cần thiết**: Trên máy chủ cần cài đặt Node.js, cơ sở dữ liệu (MariaDB, MySQL hoặc PostgreSQL), và Nginx/Apache để phục vụ ứng dụng.

### b. Quy trình triển khai trên AWS

1. **Khởi tạo EC2 instance**:

   - Truy cập **AWS Management Console**, chọn dịch vụ **EC2** và tạo một instance mới.
   - Chọn cấu hình phù hợp và thiết lập **Security Groups** để mở cổng cần thiết.

2. **Kết nối tới EC2 instance**:

   - Sử dụng SSH để truy cập vào instance.

3. **Cài đặt Node.js và các phần mềm cần thiết**:

   - Cập nhật hệ thống, cài đặt Node.js, git, nginx, và pm2.

4. **Clone và cài đặt ứng dụng**:

   - Clone dự án từ repository và cài đặt dependencies.

5. **Cấu hình ứng dụng**:

   - Tạo file `.env` với các biến môi trường cần thiết.

6. **Build và chạy ứng dụng**:

   - Build mã nguồn và sử dụng PM2 để quản lý ứng dụng.

### c. Triển khai cơ sở dữ liệu trên AWS

1. **Sử dụng AWS RDS**:

   - Tạo instance RDS và thiết lập kết nối bảo mật với EC2.

2. **Kết nối từ ứng dụng NestJS**:

   - Cập nhật biến môi trường `.env` để sử dụng endpoint RDS.
