const connection = require('../../db');  // Đảm bảo bạn đã có kết nối với MySQL

// Lấy tất cả đơn hàng từ cơ sở dữ liệu
const getOrders = (req, res) => {
  const query = 'SELECT o.id_order, o.code_order, u.name, o.total_price, o.status, o.date, o.name_user, o.address, o.phone, p.method, p.paystatus FROM tbl_order o JOIN tbl_user u ON o.id_user = u.id_user JOIN tbl_payment_infor p ON o.code_order = p.code_order';
  
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
    color.name_color,

    pi.method,
    pi.paystatus

FROM tbl_order o
JOIN tbl_user u ON o.id_user = u.id_user
JOIN tbl_order_detail od ON o.code_order = od.code_order
JOIN tbl_product p ON od.id_product = p.id_product
JOIN tbl_group_product gp ON p.id_group_product = gp.id_group_product
LEFT JOIN tbl_ram ram ON p.id_ram = ram.id_ram
LEFT JOIN tbl_rom rom ON p.id_rom = rom.id_rom
LEFT JOIN tbl_color color ON p.id_color = color.id_color
LEFT JOIN tbl_payment_infor pi ON o.code_order = pi.code_order

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
  const { status } = req.body;

  const getStatusQuery = 'SELECT status FROM tbl_order WHERE code_order = ?';
  connection.query(getStatusQuery, [code], (err, statusResult) => {
    if (err) {
      console.error("Lỗi truy vấn trạng thái:", err);
      return res.status(500).json({ error: "Lỗi máy chủ" });
    }

    if (statusResult.length === 0) {
      return res.status(404).json({ message: "Đơn hàng không tồn tại" });
    }

    const currentStatus = statusResult[0].status;

    // Chỉ xử lý chuyển từ 0 -> 1 (chờ xác nhận -> đã xác nhận) để trừ hàng
    if (currentStatus === 0 && status === 1) {
      const getProductsQuery = `
        SELECT od.id_product, od.quantity_product 
        FROM tbl_order_detail od
        JOIN tbl_order o ON od.code_order = o.code_order
        WHERE o.code_order = ?
      `;

      connection.query(getProductsQuery, [code], (err, products) => {
        if (err) {
          console.error("Lỗi truy vấn sản phẩm:", err);
          return res.status(500).json({ error: "Lỗi máy chủ khi lấy sản phẩm" });
        }

        const updateQuantityPromises = products.map(product => {
          return new Promise((resolve, reject) => {
            const updateQtyQuery = `
              UPDATE tbl_product 
              SET quantity = quantity - ? 
              WHERE id_product = ? AND quantity >= ?
            `;
            connection.query(updateQtyQuery, [product.quantity_product, product.id_product, product.quantity_product], (err) => {
              if (err) return reject(err);
              resolve();
            });
          });
        });

        Promise.all(updateQuantityPromises)
          .then(() => {
            const updateOrderQuery = `
              UPDATE tbl_order 
              SET status = ?
              WHERE code_order = ?
            `;
            connection.query(updateOrderQuery, [status, code], (err) => {
              if (err) {
                console.error("Lỗi cập nhật đơn hàng:", err);
                return res.status(500).json({ error: "Lỗi máy chủ khi cập nhật đơn hàng" });
              }
              return res.json({ message: "Cập nhật trạng thái và trừ số lượng thành công" });
            });
          })
          .catch((err) => {
            console.error("Lỗi khi trừ số lượng sản phẩm:", err);
            return res.status(500).json({ error: "Lỗi khi cập nhật số lượng sản phẩm" });
          });
      });
    } else {
      // Không xử lý các trường hợp khác trong hàm này
      return res.status(400).json({ message: "Chỉ được phép cập nhật từ trạng thái 0 sang 1 trong hàm này" });
    }
  });
};

const printOrderIfUnconfirmed = (req, res) => {
  const { code } = req.params;

  const getStatusQuery = "SELECT status FROM tbl_order WHERE code_order = ?";
  connection.query(getStatusQuery, [code], (err, results) => {
    if (err || results.length === 0) return res.status(500).json({ message: "Lỗi hoặc không tìm thấy" });

    const currentStatus = results[0].status;

    if (currentStatus === 0) {
      const updateQuery = "UPDATE tbl_order SET status = 1 WHERE code_order = ?";
      connection.query(updateQuery, [code], (err2) => {
        if (err2) return res.status(500).json({ message: "Lỗi khi cập nhật trạng thái" });
        return res.json({ message: "Cập nhật trạng thái thành công" });
      });
    } else {
      return res.json({ message: "Đơn hàng không cần cập nhật" });
    }
  });
};

const markAsShipping = (req, res) => {
  const { code } = req.params;

  const getStatusQuery = 'SELECT status FROM tbl_order WHERE code_order = ?';
  connection.query(getStatusQuery, [code], (err, result) => {
    if (err) return res.status(500).json({ error: "Lỗi khi truy vấn trạng thái" });
    if (result.length === 0) return res.status(404).json({ message: "Đơn hàng không tồn tại" });

    const currentStatus = result[0].status;

    if (currentStatus === 1) {
      const updateQuery = 'UPDATE tbl_order SET status = 2 WHERE code_order = ?';
      connection.query(updateQuery, [code], (err2) => {
        if (err2) return res.status(500).json({ error: "Lỗi khi cập nhật trạng thái sang đang vận chuyển" });
        return res.json({ message: "Đơn hàng đã chuyển sang trạng thái: Đang vận chuyển" });
      });
    } else {
      return res.status(400).json({ message: "Chỉ có thể chuyển từ đã xác nhận sang đang vận chuyển" });
    }
  });
};

const markAsDelivered = (req, res) => {
  const { code } = req.params;
  const getStatusQuery = 'SELECT status FROM tbl_order WHERE code_order = ?';

  connection.query(getStatusQuery, [code], (err, result) => {
    if (err) return res.status(500).json({ error: "Lỗi khi truy vấn trạng thái" });
    if (result.length === 0) return res.status(404).json({ message: "Đơn hàng không tồn tại" });

    const currentStatus = result[0].status;

    if (currentStatus !== 2) {
      return res.status(400).json({ message: "Chỉ có thể chuyển từ đang vận chuyển sang đã giao hàng" });
    }

    const updateOrderStatus = 'UPDATE tbl_order SET status = 3 WHERE code_order = ?';
    connection.query(updateOrderStatus, [code], (err2) => {
      if (err2) return res.status(500).json({ error: "Lỗi khi cập nhật trạng thái đơn hàng" });

      const updatePayment = 'UPDATE tbl_payment_infor SET paystatus = 1 WHERE code_order = ?';
      connection.query(updatePayment, [code], (err3) => {
        if (err3) return res.status(500).json({ error: "Lỗi khi cập nhật trạng thái thanh toán" });

        const getWarrantyData = `
          SELECT od.id_product, gp.warranty_level
          FROM tbl_order_detail od
          JOIN tbl_product p ON od.id_product = p.id_product
          JOIN tbl_group_product gp ON p.id_group_product = gp.id_group_product
          WHERE od.code_order = ?
        `;

        connection.query(getWarrantyData, [code], (err4, products) => {
          if (err4) return res.status(500).json({ error: "Lỗi khi truy vấn thông tin bảo hành" });

          if (products.length === 0) {
            return res.status(404).json({ error: "Không tìm thấy sản phẩm trong đơn hàng" });
          }


          const updates = products.map(({ id_product, warranty_level }) => {
  return new Promise((resolve, reject) => {
    let updateWarranty;
    let queryParams;

    if (warranty_level === 0) {
      // Trọn đời → start và end đều NOW()
      updateWarranty = `
        UPDATE tbl_order_detail 
        SET date_start_warranty = NOW(), date_end_warranty = NOW() 
        WHERE code_order = ? AND id_product = ?
      `;
      queryParams = [code, id_product];
    } else {
      // Tính bảo hành có thời hạn
      let months = 0;
      switch (warranty_level) {
        case 1: months = 6; break;
        case 2: months = 12; break;
        case 3: months = 24; break;
        case 4: months = 36; break;
        default: months = 0;
      }

      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + months);

      updateWarranty = `
        UPDATE tbl_order_detail 
        SET date_start_warranty = NOW(), date_end_warranty = ? 
        WHERE code_order = ? AND id_product = ?
      `;
      queryParams = [endDate, code, id_product];
    }

    connection.query(updateWarranty, queryParams, (err5) => {
      if (err5) reject(err5);
      else resolve();
    });
  });
});

          Promise.all(updates)
            .then(() => {
              return res.json({ message: "Đơn hàng đã chuyển sang trạng thái: Đã giao hàng và cập nhật bảo hành, thanh toán thành công" });
            })
            .catch(err => {
              return res.status(500).json({ error: "Lỗi khi cập nhật thông tin bảo hành", detail: err });
            });
        });
      });
    });
  });
};

module.exports = {
  getOrders,
  getOrderByCode,
  updateOrder,
  printOrderIfUnconfirmed,
  markAsShipping,
  markAsDelivered
};
