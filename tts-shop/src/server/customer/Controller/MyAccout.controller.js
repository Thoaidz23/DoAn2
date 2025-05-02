const db = require("../../db");

exports.getUserById = (req, res) => {
  const userId = req.params.id;
    
  db.query("SELECT * FROM tbl_user WHERE id_user = ?", [userId], (err, results) => {
    if (err) {
      console.error("Lỗi khi truy vấn:", err);
      return res.status(500).json({ message: "Lỗi server" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    res.json(results[0]);
  });
};
