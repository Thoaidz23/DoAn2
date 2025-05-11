const db = require("../../db"); // file cấu hình kết nối MySQL

exports.getUserById = (req, res) => {
  const userId = req.params.id;
  const sql = "SELECT id_user, name, email, phone, address FROM tbl_user WHERE id_user = ?";
  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: "Lỗi truy vấn" });
    if (results.length === 0) return res.status(404).json({ error: "Không tìm thấy người dùng" });
    res.json(results[0]);
  });
};

exports.updateUserInfo = (req, res) => {
  const userId = req.params.id;
  const { name, phone, address } = req.body;
  const sql = "UPDATE tbl_user SET name = ?, phone = ?, address = ? WHERE id_user = ?";
  db.query(sql, [name, phone, address, userId], (err, result) => {
    if (err) return res.status(500).json({ error: "Lỗi cập nhật" });
    res.json({ message: "Cập nhật thành công" });
  });
};
