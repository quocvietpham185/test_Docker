import express from 'express';
import  pool  from './database';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(express.json());

app.get('/user', async(req,res) => {
    try {
      const result = await pool.query('SELECT * FROM public.users');
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
  
  // Delete a user
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
});