const connection = require('../../db');

// Lấy danh sách sản phẩm trong giỏ
const getCart = async (req, res) => {
  const { userId } = req.params; // ✅ Dùng đúng tên
  try {
    connection.query(
                `SELECT c.*, gp.name_group_product, gp.image,c.price-((c.price/100)*gp.sale) as saleprice,
               cl.name_color,
               r1.name_ram,
               r2.name_rom
        FROM tbl_cart c
        JOIN tbl_group_product gp ON gp.id_group_product = c.id_group_product 
        JOIN tbl_product p ON p.id_product = c.id_product
        LEFT JOIN tbl_color cl ON cl.id_color = p.id_color
        LEFT JOIN tbl_ram r1 ON r1.id_ram = p.id_ram
        LEFT JOIN tbl_rom r2 ON r2.id_rom = p.id_rom
        WHERE c.id_user = ?
        ORDER BY c.id_cart DESC;
        `,

      [userId],
      (err, results) => {
        if (err) return res.status(500).json({ message: 'Lỗi server', error: err });
        return res.status(200).json(results);
      }
    );
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi server' });
  }
};

// Cập nhật số lượng
const updateQuantity = (req, res) => {
  const { id_user, id_product, quantity } = req.body;
  if (!id_user || !id_product || !quantity)
    return res.status(400).json({ message: 'Thiếu thông tin' });

  connection.query(
    'UPDATE tbl_cart SET quantity = ? WHERE id_user = ? AND id_product = ?',
    [quantity, id_user, id_product],
    (err) => {
      if (err) return res.status(500).json({ message: 'Lỗi server' });
      return res.status(200).json({ message: 'Cập nhật thành công' });
    }
  );
};

// Xoá sản phẩm khỏi giỏ
const deleteFromCart = (req, res) => {
  const { id_cart } = req.body;  // Kiểm tra xem có nhận đúng id_cart không
  if (!id_cart)
    return res.status(400).json({ message: 'Thiếu thông tin' });  // Trả về thông báo lỗi nếu không có id_cart

  connection.query(
    'DELETE FROM tbl_cart WHERE id_cart = ?',
    [id_cart],
    (err) => {
      if (err) return res.status(500).json({ message: 'Lỗi server', error: err });
      return res.status(200).json({ message: 'Đã xoá sản phẩm' });
    }
  );
};



module.exports = {
  getCart,
  updateQuantity,
  deleteFromCart
};
