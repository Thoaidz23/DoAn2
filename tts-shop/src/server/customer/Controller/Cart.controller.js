const connection = require('../../db');

const addToCart = (req, res) => {
  const { id_user, id_product, quantity, id_group_product, price } = req.body;

  if (!id_user || !id_product || !quantity || !id_group_product || !price) {
    return res.status(400).json({ message: 'Thiếu thông tin' });
  }

  // Kiểm tra xem sản phẩm đã có trong giỏ chưa
  const checkQuery = 'SELECT * FROM tbl_cart WHERE id_user = ? AND id_product = ?';
  connection.query(checkQuery, [id_user, id_product], (err, results) => {
    if (err) {
      console.error('Lỗi truy vấn SELECT:', err);
      return res.status(500).json({ message: 'Lỗi server' });
    }

    if (results.length > 0) {
      const currentQuantity = results[0].quantity;
      const newQuantity = currentQuantity + quantity;

      // Giới hạn số lượng tối đa là 10
      if (newQuantity > 5) {
        return res.status(400).json({ message: 'Mỗi sản phẩm chỉ được mua tối đa 10 đơn vị trong giỏ hàng.' });
      }

      const updateQuery = 'UPDATE tbl_cart SET quantity = ? WHERE id_user = ? AND id_product = ?';
      connection.query(updateQuery, [newQuantity, id_user, id_product], (err2) => {
        if (err2) {
          console.error('Lỗi khi cập nhật giỏ hàng:', err2);
          return res.status(500).json({ message: 'Lỗi server' });
        }
        return res.status(200).json({ message: 'Đã cập nhật giỏ hàng' });
      });
    } else {
      // Nếu là sản phẩm mới => kiểm tra quantity có vượt quá 10 không
      if (quantity > 5) {
        return res.status(400).json({ message: 'Mỗi sản phẩm chỉ được mua tối đa 10 đơn vị trong giỏ hàng.' });
      }

      const insertQuery = 'INSERT INTO tbl_cart (id_user, id_product, id_group_product, quantity, price) VALUES (?, ?, ?, ?, ?)';
      connection.query(insertQuery, [id_user, id_product, id_group_product, quantity, price], (err3) => {
        if (err3) {
          console.error('Lỗi khi thêm vào giỏ hàng:', err3);
          return res.status(500).json({ message: 'Lỗi server' });
        }
        return res.status(201).json({ message: 'Đã thêm vào giỏ hàng' });
      });
    }
  });
};

module.exports = { addToCart };
