const db = require('../../db');

// 👉 Tạo yêu cầu bảo hành
exports.createWarrantyRequest = (req, res) => {
  const { id_user, id_product, code_order, phone, issue } = req.body;

  if (!id_user || !id_product || !code_order || !phone || !issue) {
    return res.status(400).json({ success: false, message: 'Thiếu thông tin yêu cầu' });
  }

  const query = `
    INSERT INTO tbl_warranty_requests (id_user, id_product, code_order, phone, issue, status)
    VALUES (?, ?, ?, ?, ?, 1)
  `;

  db.query(query, [id_user, id_product, code_order, phone, issue], (err, result) => {
    if (err) {
      console.error("Lỗi khi tạo yêu cầu bảo hành:", err);
      return res.status(500).json({ success: false, message: 'Lỗi server' });
    }

    res.json({ success: true, message: 'Gửi yêu cầu bảo hành thành công' });
  });
};

