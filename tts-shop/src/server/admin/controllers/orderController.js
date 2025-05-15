const connection = require('../../db');  // Đảm bảo bạn đã có kết nối với MySQL

// Lấy tất cả đơn hàng từ cơ sở dữ liệu
const getOrders = (req, res) => {
  const query = 'SELECT o.id_order, o.code_order, u.name, o.total_price, o.status, o.date, o.name_user, o.address, o.phone, o.paystatus FROM tbl_order o JOIN tbl_user u ON o.id_user = u.id_user';
  
  connection.query(query, (err, results) => {
    if (err) {
      console.error("Lỗi truy vấn:", err);
      return res.status(500).json({ error: "Lỗi máy chủ" });
    }
    res.json(results);  // Trả về kết quả dưới dạng JSON
  });
};

// Lấy chi tiết đơn hàng theo code_order
const getOrderByCode = (req, res) => {
  const { code } = req.params;
  
  const query = `
    SELECT 
    o.id_order,
    o.code_order,
    o.total_price,
    o.status,
    o.paystatus,
    o.method,
    o.date,
    o.name_user,
    o.address,
    o.phone,

    u.id_user,
    u.name AS user_name,
    u.email,

    od.id_order_detail,
    od.quantity_product,

    p.id_product,
    p.price,

    gp.name_group_product,
    gp.image,

    ram.name_ram,
    rom.name_rom,
    color.name_color

    FROM tbl_order o
    JOIN tbl_user u ON o.id_user = u.id_user
    JOIN tbl_order_detail od ON o.code_order = od.code_order
    JOIN tbl_product p ON od.id_product = p.id_product
    JOIN tbl_group_product gp ON p.id_group_product = gp.id_group_product
    LEFT JOIN tbl_ram ram ON p.id_ram = ram.id_ram
    LEFT JOIN tbl_rom rom ON p.id_rom = rom.id_rom
    LEFT JOIN tbl_color color ON p.id_color = color.id_color

    WHERE o.code_order = ?;
    `;

  connection.query(query, [code], (err, results) => {
    if (err) {
      console.error("Lỗi truy vấn:", err);
      return res.status(500).json({ error: "Lỗi máy chủ" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Đơn hàng không tồn tại" });
    }

    const order = results[0];
    const products = results.map(row => ({
      name_group_product: row.name_group_product,
      name_ram: row.name_ram,
      name_rom: row.name_rom,
      name_color: row.name_color,
      quantity_product: row.quantity_product,
      price: row.price,
      image: row.image
    }));

    res.json({ ...order, products });
  });
};

const updateOrder = (req, res) => {
  const { code } = req.params;
  const { status, paystatus } = req.body; // Lấy thêm paystatus

  const query = 'UPDATE tbl_order SET status = ?, paystatus = ? WHERE code_order = ?';

  connection.query(query, [status, paystatus, code], (err, results) => {
    if (err) {
      console.error("Lỗi truy vấn:", err);
      return res.status(500).json({ error: "Lỗi máy chủ" });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Đơn hàng không tồn tại" });
    }

    res.json({ message: "Cập nhật trạng thái thành công" });
  });
};


module.exports = { getOrders, getOrderByCode, updateOrder };
