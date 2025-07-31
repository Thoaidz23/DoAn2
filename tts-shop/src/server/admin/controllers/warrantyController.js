// server/admin/controllers/warrantyController.js

const connection = require("../../db");

const getAllWarrantyRequests = (req, res) => {
  const query = "SELECT * FROM tbl_warranty_requests ORDER BY request_time DESC";

  connection.query(query, (err, results) => {
    if (err) {
      console.error("Lỗi khi lấy dữ liệu bảo hành:", err);
      return res.status(500).json({ error: "Lỗi server" });
    }
    res.json(results);
  });
};

const updateWarrantyStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (![1, 2, 3].includes(status)) {
    return res.status(400).json({ error: "Trạng thái không hợp lệ" });
  }

  const query = "UPDATE tbl_warranty_requests SET status = ? WHERE id = ?";

  connection.query(query, [status, id], (err, result) => {
    if (err) {
      console.error("Lỗi khi cập nhật trạng thái:", err);
      return res.status(500).json({ error: "Lỗi server" });
    }

    res.json({ message: "Cập nhật trạng thái thành công", affectedRows: result.affectedRows });
  });
};

module.exports = {
  getAllWarrantyRequests,
  updateWarrantyStatus,
};
