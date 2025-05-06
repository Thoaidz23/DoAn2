const connection = require('../../db');

const getPurchaseHistory = (req, res) => {
  const id_user = req.params.id
  const query = `
    SELECT 
      o.code_order,
      o.total_price,
      o.status,
      o.date,
      o.paystatus,
      gp.name_group_product AS product_name,
      gp.image AS product_image
    FROM tbl_order o
    JOIN tbl_order_detail od ON o.code_order = od.code_order
    JOIN tbl_product p ON od.id_product = p.id_product
    JOIN tbl_group_product gp ON p.id_group_product = gp.id_group_product
    WHERE o.id_user = ?
    GROUP BY o.code_order
    ORDER BY o.date DESC
  `;

  connection.query(query, [id_user], (err, results) => {
    if (err) {
      console.error('Lỗi khi truy vấn lịch sử mua hàng:', err);
      return res.status(500).json({ message: 'Lỗi server' });
    }
    res.json(results);
  });
};

module.exports = { getPurchaseHistory };
