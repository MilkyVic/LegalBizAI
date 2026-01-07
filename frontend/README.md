# LegalBizAI_UI

## Giới thiệu
AI Tool là một ứng dụng React cho phép người dùng tương tác với chatbot hỏi đáp về luật doanh nghiệp.

## Cấu hình và chạy ứng dụng bằng Docker Compose

### Yêu cầu hệ thống
- Docker: Đảm bảo rằng Docker đã được cài đặt trên hệ thống của bạn. [Tải và cài đặt Docker](https://www.docker.com/products/docker-desktop)
- Docker Compose: Đảm bảo rằng Docker Compose đã được cài đặt. [Hướng dẫn cài đặt Docker Compose](https://docs.docker.com/compose/install/)

### Bước 1: Mở Terminal và điều hướng đến thư mục gốc của dự án

Trước tiên, mở Terminal và điều hướng đến thư mục gốc của dự án, nơi bạn đã tạo file `Dockerfile` và `docker-compose.yml`.

```bash
cd /path/to/your/project
```
### Bước 2: Build Docker image và khởi chạy container
Để build Docker image và khởi chạy container, chạy lệnh sau trong Terminal:
```bash
docker-compose up --build
```
### Bước 3: Truy cập vào ứng dụng
Sau khi container đã chạy, bạn có thể truy cập vào ứng dụng frontend của mình từ trình duyệt với địa chỉ:
```bash
http://localhost:5173
```
