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
  const { status, reply } = req.body; // thêm reply

  // Cho phép các trạng thái 0 đến 4
  if (![0, 1, 2, 3, 4].includes(status)) {
    return res.status(400).json({ error: "Trạng thái không hợp lệ" });
  }

  const query = "UPDATE tbl_warranty_requests SET status = ?, reply = ? WHERE id = ?";

  connection.query(query, [status, reply || null, id], (err, result) => {
    if (err) {
      console.error("Lỗi khi cập nhật trạng thái:", err);
      return res.status(500).json({ error: "Lỗi server" });
    }

    res.json({ message: "Cập nhật trạng thái thành công", affectedRows: result.affectedRows });
  });
};


const getWarrantyByCode = (req, res) => {
  const { code } = req.params;
  const { id_product } = req.query;

  if (!id_product) {
    return res.status(400).json({ error: "Thiếu id_product trong truy vấn" });
  }

  const query = `
    SELECT 
      w.id,
      w.id_user,
      w.code_order,
      w.id_product,
      w.phone,
      w.issue,
      w.request_time,
      w.status AS warranty_status,

      od.quantity_product,
      od.date_start_warranty,
      od.date_end_warranty,

      o.id_order,
      o.total_price,
      o.status AS order_status,
      o.date,
      o.name_user,
      o.address,

      u.id_user,
      u.name AS user_name,
      u.email,

      p.price,

      gp.name_group_product,
      gp.image,

      ram.name_ram,
      rom.name_rom,
      color.name_color

    FROM tbl_warranty_requests w
    JOIN tbl_order_detail od 
      ON w.code_order = od.code_order AND w.id_product = od.id_product
    JOIN tbl_order o ON w.code_order = o.code_order
    JOIN tbl_user u ON o.id_user = u.id_user
    JOIN tbl_product p ON od.id_product = p.id_product
    JOIN tbl_group_product gp ON p.id_group_product = gp.id_group_product
    LEFT JOIN tbl_ram ram ON p.id_ram = ram.id_ram
    LEFT JOIN tbl_rom rom ON p.id_rom = rom.id_rom
    LEFT JOIN tbl_color color ON p.id_color = color.id_color

    WHERE w.code_order = ? AND w.id_product = ?
  `;

  connection.query(query, [code, id_product], (err, results) => {
    if (err) {
      console.error("Lỗi truy vấn chi tiết bảo hành:", err);
      return res.status(500).json({ error: "Lỗi máy chủ" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy yêu cầu bảo hành với mã đơn và sản phẩm này" });
    }

    const row = results[0];

    const warrantyInfo = {
      id: row.id,
      code_order: row.code_order,
      warranty_status: row.warranty_status,
      request_time: row.request_time,
      issue: row.issue,
      user: {
        id_user: row.id_user,
        name: row.user_name,
        email: row.email,
        phone: row.phone,
        address: row.address
      },
      order: {
        id_order: row.id_order,
        date: row.date,
        total_price: row.total_price,
        order_status: row.order_status
      },
      product: {
        id_product: row.id_product,
        name_group_product: row.name_group_product,
        name_ram: row.name_ram,
        name_rom: row.name_rom,
        name_color: row.name_color,
        quantity: row.quantity_product,
        price: row.price,
        image: row.image,
        date_start_warranty: row.date_start_warranty,
        date_end_warranty: row.date_end_warranty
      }
    };

    res.json(warrantyInfo);
  });
};



module.exports = {
  getAllWarrantyRequests,
  updateWarrantyStatus,
  getWarrantyByCode
};
