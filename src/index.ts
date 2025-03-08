import express from 'express';
import pool from './database';
import dotenv from 'dotenv';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

dotenv.config();

const app = express();
app.use(express.json());

// Cấu hình Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'User API',
      version: '1.0.0',
      description: 'API endpoints for managing users',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
  },
  apis: ['./src/index.ts'], // đường dẫn đến file này
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *       properties:
 *         id:
 *           type: integer
 *           description: ID của người dùng (tự động sinh)
 *         name:
 *           type: string
 *           description: Tên người dùng
 *         email:
 *           type: string
 *           format: email
 *           description: Email của người dùng
 */

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Lấy danh sách tất cả người dùng
 *     description: Trả về danh sách tất cả người dùng từ cơ sở dữ liệu
 *     responses:
 *       200:
 *         description: Danh sách người dùng
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       400:
 *         description: Lỗi yêu cầu không hợp lệ
 *       403:
 *         description: Không có quyền truy cập
 *       500:
 *         description: Lỗi server
 */
app.get('/user', async(req,res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (err) {
    console.error('Error executing query', err.stack);
    
    // Kiểm tra lỗi và trả về thông báo chi tiết
    if (err.code) {
      // Nếu có mã lỗi (error code), chúng ta có thể làm rõ nguyên nhân
      switch (err.code) {
        case '42P01':  // Lỗi: table không tồn tại
          res.status(400).json({
            error: 'Table "users" does not exist.'
          });
          break;
        case '28000':  // Lỗi: user không có quyền truy cập
          res.status(403).json({
            error: 'Permission denied for the database.'
          });
          break;
        default:
          res.status(500).json({
            error: `Database error: ${err.message}`
          });
          break;
      }
    } else {
      // Nếu không có mã lỗi, chỉ gửi thông báo lỗi chung
      res.status(500).json({
        error: `Unexpected error: ${err.message}`
      });
    }
  }
});

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Tạo người dùng mới
 *     description: Tạo một người dùng mới với thông tin được cung cấp
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Người dùng đã được tạo
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Lỗi server
 */
app.post('/users', async (req, res) => {
  const { name, email } = req.body;
  
  try {
    const result = await pool.query(
      'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
      [name, email]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Cập nhật thông tin người dùng
 *     description: Cập nhật thông tin của người dùng theo ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của người dùng
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Thông tin người dùng đã được cập nhật
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Lỗi server
 */
app.put('/users/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  try {
    const result = await pool.query(
      'UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *',
      [name, email, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Xóa người dùng
 *     description: Xóa người dùng theo ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của người dùng cần xóa
 *     responses:
 *       204:
 *         description: Xóa thành công, không có nội dung trả về
 *       500:
 *         description: Lỗi server
 */
app.delete('/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
}); 
