const connection = require('../../db');

const Cancel = (req, res) => {
    const { code_order } = req.params;
    const sql = `UPDATE tbl_order SET status = 4 WHERE code_order = ?`;
    
    connection.query(sql, [code_order], (err, result) => {
      if (err) return res.status(500).json({ error: 'Lỗi máy chủ' });
      if (result.affectedRows === 0) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
  
      res.json({ message: 'Yêu cầu hủy đơn thành công' });
    });
  };
  

module.exports = { Cancel };
