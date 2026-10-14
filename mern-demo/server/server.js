const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Import Model Student đã tạo ở Câu 35
const Student = require('./models/Student');

const app = express();
const PORT = process.env.PORT || 5000;
// Cấu hình CORS linh hoạt cho Production
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:3000'
];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(null, true); // Hoặc truyền origin cụ thể
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(cors());
app.use(express.json());

// Kết nối MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Kết nối MongoDB Atlas thành công!');
  })
  .catch((err) => {
    console.error('Lỗi kết nối MongoDB:', err);
  });

// Chuyển hướng trang chủ / sang /api/students
app.get('/', (req, res) => {
  res.redirect('/api/students');
});

// Câu 22: API GET /api/hello
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Backend đang hoạt động thành công!' });
});

// Câu 36: GET /api/students - Lấy danh sách sinh viên
app.get('/api/students', async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Câu 37: POST /api/students - Thêm sinh viên mới
app.post('/api/students', async (req, res) => {
  try {
    const { studentId, name, email } = req.body;
    const newStudent = await Student.create({ studentId, name, email });
    res.status(201).json(newStudent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Câu 38: PUT /api/students/:id - Cập nhật sinh viên
app.put('/api/students/:id', async (req, res) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedStudent) return res.status(404).json({ message: 'Không tìm thấy sinh viên' });
    res.status(200).json(updatedStudent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Câu 39: DELETE /api/students/:id - Xóa sinh viên
app.delete('/api/students/:id', async (req, res) => {
  try {
    const deletedStudent = await Student.findByIdAndDelete(req.params.id);
    if (!deletedStudent) return res.status(404).json({ message: 'Không tìm thấy sinh viên' });
    res.status(200).json({ message: 'Đã xóa sinh viên thành công' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Khởi động Express Server (Luôn đặt ở cuối file)
app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});