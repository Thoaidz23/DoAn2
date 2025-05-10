const pool = require('../../db');

const generateCodeOrder = () => {
  const letters = Array.from({ length: 4 }, () =>
    String.fromCharCode(65 + Math.floor(Math.random() * 26))
  ).join('');
  const numbers = Math.floor(1000 + Math.random() * 9000);
  return letters + numbers;
};

const addToPay = (req, res) => {
  const { id_user, products, name_user, address, phone, method, code_order: reqCodeOrder } = req.body;

  if (!id_user || !products || products.length === 0 || !name_user || !address || !phone) {
    return res.status(400).json({ message: 'Thiếu thông tin' });
  }

  const code_order = reqCodeOrder || generateCodeOrder(); 
  const total_price = products.reduce((sum, item) => sum + item.price * item.quantity, 0);

  pool.getConnection((err, conn) => {
    if (err) {
      console.error('Lỗi lấy kết nối từ pool:', err);
      return res.status(500).json({ message: 'Lỗi kết nối database' });
    }

    conn.beginTransaction(err => {
      if (err) {
        conn.release();
        console.error('Lỗi bắt đầu transaction:', err);
        return res.status(500).json({ message: 'Lỗi transaction' });
      }

      const insertOrderQuery = `
        INSERT INTO tbl_order (id_user, code_order, status, total_price, name_user, address, phone, date, paystatus, method)
        VALUES (?, ?, 0, ?, ?, ?, ?, NOW(), 0, ?)
      `;

      conn.query(insertOrderQuery, [id_user, code_order, total_price, name_user, address, phone, method], (err1, result1) => {
        if (err1) {
          return conn.rollback(() => {
            conn.release();
            console.error('Lỗi thêm đơn hàng:', err1);
            res.status(500).json({ message: 'Lỗi thêm đơn hàng' });
          });
        }

        const deleteCartQuery = `DELETE FROM tbl_cart WHERE id_user = ?`;
        conn.query(deleteCartQuery, [id_user], (errDel) => {
          if (errDel) {
            return conn.rollback(() => {
              conn.release();
              console.error('Lỗi xoá giỏ hàng:', errDel);
              res.status(500).json({ message: 'Lỗi xoá giỏ hàng' });
            });
          }

          const insertDetailQuery = `
            INSERT INTO tbl_order_detail (code_order, id_product, quantity_product)
            VALUES ?
          `;
          const detailValues = products.map(item => [code_order, item.id_product, item.quantity]);

          conn.query(insertDetailQuery, [detailValues], (err2) => {
            if (err2) {
              return conn.rollback(() => {
                conn.release();
                console.error('Lỗi chi tiết đơn hàng:', err2);
                res.status(500).json({ message: 'Lỗi chi tiết đơn hàng' });
              });
            }

            conn.commit(errCommit => {
              if (errCommit) {
                return conn.rollback(() => {
                  conn.release();
                  console.error('Lỗi commit:', errCommit);
                  res.status(500).json({ message: 'Lỗi commit' });
                });
              }

              conn.release();
              res.status(201).json({ message: 'Đặt hàng thành công', code_order });
            });
          });
        });
      });
    });
  });
};


module.exports = { addToPay };
