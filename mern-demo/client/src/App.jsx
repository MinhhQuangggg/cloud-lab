import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5000/api/students';

function App() {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    studentId: '',
    name: '',
    email: ''
  });

  const [editingId, setEditingId] = useState(null);

  // Lấy danh sách sinh viên
  const fetchStudents = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu:', error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Xử lý nhập form
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Thêm hoặc cập nhật sinh viên
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let response;

      if (editingId) {
        // Cập nhật sinh viên
        response = await fetch(`${API_URL}/${editingId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });
      } else {
        // Thêm sinh viên
        response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });
      }

      if (response.ok) {
        setFormData({
          studentId: '',
          name: '',
          email: ''
        });

        setEditingId(null);
        fetchStudents();
      } else {
        console.error('Lỗi response:', response.status);
      }
    } catch (error) {
      console.error('Lỗi:', error);
    }
  };

  // Chọn sinh viên để sửa
  const handleEdit = (student) => {
    setEditingId(student._id);

    setFormData({
      studentId: student.studentId,
      name: student.name,
      email: student.email
    });
  };

  // Xóa sinh viên
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchStudents();
      } else {
        console.error('Lỗi khi xóa:', response.status);
      }
    } catch (error) {
      console.error('Lỗi:', error);
    }
  };

  return (
    <div
      style={{
        maxWidth: '700px',
        margin: '40px auto',
        fontFamily: 'sans-serif',
        padding: '0 20px'
      }}
    >
      <h2>Quản lý Sinh viên - Version 2.0</h2>

      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          marginBottom: '30px'
        }}
      >
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

        <button
          type="submit"
          style={{
            padding: '10px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          {editingId ? 'Cập Nhật Sinh Viên' : 'Thêm Sinh Viên'}
        </button>

        {editingId && (
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setFormData({
                studentId: '',
                name: '',
                email: ''
              });
            }}
          >
            Hủy sửa
          </button>
        )}
      </form>

      <h3>Danh Sách Sinh Viên</h3>

      <ul>
        {students.map((sv) => (
          <li
            key={sv._id}
            style={{
              marginBottom: '15px'
            }}
          >
            <strong>{sv.studentId}</strong> - {sv.name}
            <br />
            ({sv.email})

            <br />

            <button
              onClick={() => handleEdit(sv)}
              style={{ marginRight: '10px' }}
            >
              Sửa
            </button>

            <button
              onClick={() => handleDelete(sv._id)}
            >
              Xóa
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;