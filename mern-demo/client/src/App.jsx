import { useState, useEffect } from 'react';

// Đường dẫn API Backend trên GitHub Codespaces
const API_URL = 'https://fluffy-fishstick-pjr994pv4g96h7pwv-5000.app.github.dev/api/students';

function App() {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    studentId: '',
    name: '',
    email: ''
  });

  // Lấy danh sách sinh viên từ Backend API
  const fetchStudents = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu sinh viên:', error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Cập nhật State khi nhập Form
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Thêm sinh viên mới
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setFormData({ studentId: '', name: '', email: '' });
        fetchStudents();
      } else {
        console.error('Lỗi response khi thêm sinh viên:', response.status);
      }
    } catch (error) {
      console.error('Lỗi khi thêm sinh viên:', error);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', fontFamily: 'sans-serif', padding: '0 20px' }}>
      <h2>Quản Lý Sinh Viên</h2>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '30px' }}>
        <input
          type="text"
          name="studentId"
          placeholder="Mã sinh viên (MSSV)"
          value={formData.studentId}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="name"
          placeholder="Họ và tên"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <button type="submit" style={{ padding: '10px', backgroundColor: '#007bff', color: '#fff', border: 'none', cursor: 'pointer' }}>
          Thêm Sinh Viên
        </button>
      </form>

      <h3>Danh Sách Sinh Viên</h3>
      <ul>
        {students.map((sv) => (
          <li key={sv._id} style={{ marginBottom: '8px' }}>
            <strong>{sv.studentId}</strong> - {sv.name} ({sv.email})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;