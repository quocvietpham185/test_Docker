CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE
  );

INSERT INTO users (name, email) VALUES
('Nguyễn Văn A', 'nguyenvana@example.com'),
('Trần Thị B', 'tranthib@example.com'),
('Lê Văn C', 'levanc@example.com'),
('Phạm Thị D', 'phamthid@example.com'),
('Hoàng Văn E', 'hoangvane@example.com'),
('Đặng Thị F', 'dangthif@example.com'),
('Bùi Văn G', 'buivang@example.com'),
('Võ Thị H', 'vothih@example.com'),
('Dương Văn I', 'duongvani@example.com'),
('Lý Thị J', 'lythij@example.com');

