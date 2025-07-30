const db = require('../../db');

// 👉 Tạo yêu cầu bảo hành
exports.createWarrantyRequest = (req, res) => {
  const { id_user, id_group_product, code_order, phone, issue } = req.body;

  if (!id_user || !id_group_product || !code_order || !phone || !issue) {
    return res.status(400).json({ success: false, message: 'Thiếu thông tin yêu cầu' });
  }

  const query = `
    INSERT INTO tbl_warranty_requests (id_user, id_group_product, code_order, phone, issue, status)
    VALUES (?, ?, ?, ?, ?, 1)
  `;

  db.query(query, [id_user, id_group_product, code_order, phone, issue], (err, result) => {
    if (err) {
      console.error("Lỗi khi tạo yêu cầu bảo hành:", err);
      return res.status(500).json({ success: false, message: 'Lỗi server' });
    }

    res.json({ success: true, message: 'Gửi yêu cầu bảo hành thành công' });
  });
};

// 👉 Lấy tất cả yêu cầu bảo hành (dành cho admin)
exports.getAllWarrantyRequests = (req, res) => {
  const query = `
    SELECT w.*, u.name_user, p.name_group_product 
    FROM tbl_warranty_requests w
    JOIN tbl_user u ON w.id_user = u.id_user
    JOIN tbl_group_product p ON w.id_group_product = p.id_group_product
    ORDER BY w.request_time DESC
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Lỗi khi lấy danh sách bảo hành:", err);
      return res.status(500).json({ success: false, message: 'Lỗi server' });
    }

    res.json({ success: true, data: results });
  });
};

// 👉 Cập nhật trạng thái yêu cầu bảo hành (0: chờ, 1: duyệt, 2: từ chối)
exports.updateWarrantyStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const query = `UPDATE tbl_warranty_requests SET status = ? WHERE id = ?`;

  db.query(query, [status, id], (err, result) => {
    if (err) {
      console.error("Lỗi cập nhật trạng thái:", err);
      return res.status(500).json({ success: false, message: 'Lỗi server' });
    }

    res.json({ success: true, message: 'Cập nhật trạng thái thành công' });
  });
};
