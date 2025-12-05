const connection = require('../../db');

// Lấy danh sách nhân viên (role = 2)
const getStaffs = (req, res) => {
  const query = 'SELECT id_user, name, email, phone, address,role FROM tbl_user WHERE role = 2 OR role = 4';
  connection.query(query, (err, results) => {
    if (err) {
      console.error("Lỗi truy vấn:", err);
      return res.status(500).json({ error: "Lỗi máy chủ" });
    }
    res.json(results);
  });
};


const bcrypt = require("bcrypt");
const saltRounds = 10;

const addStaff = (req, res) => {
  const { name, email, phone, address, role } = req.body; // Lấy role từ client

  // Thay vì lấy password từ client, ta cố định mật khẩu là demo@123
  const password = "demo@123";

  if (!name || !email || !phone) {
    return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin: name, email, phone" });
  }

  // Chỉ chấp nhận role = 2 hoặc 4, mặc định là 2
  const staffRole = (role === 2 || role === 4) ? role : 2;

  bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
    if (err) {
      console.error("Lỗi mã hóa mật khẩu:", err);
      return res.status(500).json({ message: "Lỗi máy chủ khi xử lý mật khẩu" });
    }
    
    console.log("Hashed password:", hashedPassword);

    const query = `INSERT INTO tbl_user (name, email, phone, address, password, role, lock_account) 
                   VALUES (?, ?, ?, ?, ?, ?, 0)`;

    connection.query(
      query,
      [name, email, phone, address, hashedPassword, staffRole],
      (err, result) => {
        if (err) {
          console.error("Lỗi thêm nhân viên:", err);
          return res.status(500).json({ message: "Lỗi máy chủ khi thêm nhân viên" });
        }
        res.status(201).json({ message: `Thêm nhân viên thành công với mật khẩu mặc định! (role=${staffRole})` });
      }
    );
  });
};



// Lấy thông tin nhân viên theo ID
const getStaffById = (req, res) => {
  const { id } = req.params;
  const query = 'SELECT id_user, name, email, phone, address, role FROM tbl_user WHERE id_user = ?';

  connection.query(query, [id], (err, results) => {
    if (err) {
      console.error("Lỗi truy vấn:", err);
      return res.status(500).json({ message: "Lỗi máy chủ" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy nhân viên" });
    }

    res.json(results[0]);
  });
};

// Sửa thông tin nhân viên
const editStaff = (req, res) => {
  const { id } = req.params;
  const { name, email, phone, address, role } = req.body;
  console.log(id,name, email, phone, address, role)
  const query = 'UPDATE tbl_user SET name = ?, email = ?, phone = ?, address = ?, role = ? WHERE id_user = ?';
  connection.query(query, [name, email, phone, address, role, id], (err, result) => {
    if (err) {
      console.error("Lỗi khi cập nhật nhân viên:", err);
      return res.status(500).json({ message: "Lỗi máy chủ khi cập nhật nhân viên" });
    }

    res.status(200).json({ message: "Cập nhật nhân viên thành công!" });
  });
};

// Xóa nhân viên
const deleteStaff = (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM tbl_user WHERE id_user = ? ';

  connection.query(query, [id], (err, result) => {
    if (err) {
      console.error("Lỗi khi xóa nhân viên:", err);
      return res.status(500).json({ message: "Lỗi máy chủ khi xóa nhân viên" });
    }

    res.json({ message: "Xóa nhân viên thành công" });
  });
};

module.exports = {
  getStaffs,
  addStaff,
  getStaffById,
  editStaff,
  deleteStaff,
};
