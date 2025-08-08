const db = require('../../db');

// 👉 Tạo yêu cầu bảo hành
exports.createWarrantyRequest = (req, res) => {
  const { id_user, id_product, code_order, phone, issue } = req.body;

  if (!id_user || !id_product || !code_order || !phone || !issue) {
    return res.status(400).json({ success: false, message: 'Thiếu thông tin yêu cầu' });
  }

  // Query insert yêu cầu bảo hành
  const insertWarrantyQuery = `
    INSERT INTO tbl_warranty_requests (id_user, id_product, code_order, phone, issue, status)
    VALUES (?, ?, ?, ?, ?, 1)
  `;

  db.query(insertWarrantyQuery, [id_user, id_product, code_order, phone, issue], (err, result) => {
    if (err) {
      console.error("Lỗi khi tạo yêu cầu bảo hành:", err);
      return res.status(500).json({ success: false, message: 'Lỗi server' });
    }

    const newWarrantyId = result.insertId; // ✅ lấy id_warranty vừa insert

    // Insert vào bảng lịch sử trạng thái
    const insertHistoryQuery = `
      INSERT INTO tbl_warranty_time (id_warranty, status)
      VALUES (?, 1)
    `;

    db.query(insertHistoryQuery, [newWarrantyId], (err2) => {
      if (err2) {
        console.error("Lỗi khi lưu lịch sử bảo hành:", err2);
        return res.status(500).json({ success: false, message: 'Lỗi server khi lưu lịch sử' });
      }

      res.json({ success: true, message: 'Gửi yêu cầu bảo hành thành công' });
    });
  });
};
