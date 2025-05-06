const connection = require('../../db');

const generateCodeOrder = () => {
  const letters = Array.from({ length: 4 }, () =>
    String.fromCharCode(65 + Math.floor(Math.random() * 26))
  ).join('');
  const numbers = Math.floor(1000 + Math.random() * 9000);
  return letters + numbers;
};

const addToPay = (req, res) => {
  const { id_user, products, name_user, address, phone,method } = req.body;

  if (!id_user || !products || products.length === 0 || !name_user || !address || !phone) {
    return res.status(400).json({ message: 'Thiếu thông tin' });
  }

  const code_order = generateCodeOrder();
  const total_price = products.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const insertOrderQuery = `
  INSERT INTO tbl_order (id_user, code_order, status, total_price, name_user, address, phone, date,paystatus , method)
  VALUES (?, ?, 0, ?, ?, ?, ?, NOW(),0,?)
`;
connection.query(
  insertOrderQuery,
  [id_user, code_order, total_price, name_user, address, phone,method],
  (err1, result) => {
    if (err1) {
      return connection.rollback(() => {
        console.error('Lỗi khi thêm đơn hàng:', err1);
        res.status(500).json({ message: 'Lỗi server khi thêm đơn hàng' });
      });
    }

    // Sau khi thêm order, xóa giỏ hàng
    const deleteCartQuery = `DELETE FROM tbl_cart WHERE id_user = ?`;
    connection.query(deleteCartQuery, [id_user], (errDel) => {
      if (errDel) {
        return connection.rollback(() => {
          console.error('Lỗi khi xóa giỏ hàng:', errDel);
          res.status(500).json({ message: 'Lỗi khi xóa giỏ hàng' });
        });
      }

      // Thêm chi tiết đơn hàng
      const insertDetailQuery = `
        INSERT INTO tbl_order_detail (code_order, id_product, quantity_product)
        VALUES ?
      `;
      const detailValues = products.map(item => [code_order, item.id_product, item.quantity]);

      connection.query(insertDetailQuery, [detailValues], (err2) => {
        if (err2) {
          return connection.rollback(() => {
            console.error('Lỗi khi thêm chi tiết đơn hàng:', err2);
            res.status(500).json({ message: 'Lỗi server khi thêm chi tiết đơn hàng' });
          });
        }

        connection.commit(errCommit => {
          if (errCommit) {
            return connection.rollback(() => {
              res.status(500).json({ message: 'Lỗi commit giao dịch' });
            });
          }

          res.status(201).json({ message: 'Đã thanh toán thành công', code_order });
        });
      });
    });
  }
);

};


module.exports = { addToPay };
