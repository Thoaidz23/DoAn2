const { Code } = require('lucide-react');
const connection = require('../../db');

// Hàm ghi lịch sử trạng thái
const insertOrderTime = (code_order, status) => {
  return new Promise((resolve, reject) => {
    const query = `INSERT INTO tbl_order_time (code_order, status) VALUES (?, ?)`;
    connection.query(query, [code_order, status], (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
};

// Lấy tất cả đơn hàng
const getOrders = (req, res) => {
  const query = `
    SELECT o.id_order, o.code_order, u.name, o.total_price, o.status, o.date,
           o.name_user, o.address, o.phone, p.method, p.paystatus 
    FROM tbl_order o 
    JOIN tbl_user u ON o.id_user = u.id_user 
    JOIN tbl_payment_infor p ON o.code_order = p.code_order 
    ORDER BY id_order DESC
  `;

  connection.query(query, (err, results) => {
    if (err) {
      console.error("Lỗi truy vấn:", err);
      return res.status(500).json({ error: "Lỗi máy chủ" });
    }
    res.json(results);
  });
};

// Lấy chi tiết đơn hàng theo code_order
const getOrderByCode = (req, res) => {
  const { code } = req.params;

  const query = `
    SELECT 
      o.id_order, o.code_order, o.total_price, o.status, o.date, pi.capture_id, o.customer_cancel_reason,
      o.name_user, o.address, o.phone,
      u.id_user, u.name AS user_name, u.email,
      od.id_order_detail, od.quantity_product,
      p.id_product, p.price,
      gp.name_group_product, gp.image,
      ram.name_ram, rom.name_rom, color.name_color,
      pi.method, pi.paystatus
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

    // Lấy lịch sử thời gian
    const timeQuery = `
      SELECT status, \`time\` 
      FROM tbl_order_time 
      WHERE code_order = ? 
      ORDER BY \`time\` ASC
    `;

    connection.query(timeQuery, [code], (err2, timeRows) => {
      if (err2) {
        console.error("Lỗi truy vấn thời gian:", err2);
        return res.status(500).json({ error: "Lỗi khi lấy lịch sử trạng thái" });
      }

      res.json({ 
        ...order, 
        products, 
        statusHistory: timeRows 
      });
    });
  });
};


// Xác nhận đơn (0 -> 1)
const updateOrder = (req, res) => {
  const { code } = req.params;
  const { status } = req.body;

  const getStatusQuery = 'SELECT status FROM tbl_order WHERE code_order = ?';
  connection.query(getStatusQuery, [code], (err, statusResult) => {
    if (err) return res.status(500).json({ error: "Lỗi máy chủ" });
    if (statusResult.length === 0) return res.status(404).json({ message: "Đơn hàng không tồn tại" });

    const currentStatus = statusResult[0].status;

    if (currentStatus === 0 && status === 1) {
      const getProductsQuery = `
        SELECT od.id_product, od.quantity_product 
        FROM tbl_order_detail od
        JOIN tbl_order o ON od.code_order = o.code_order
        WHERE o.code_order = ?
      `;

      connection.query(getProductsQuery, [code], (err, products) => {
        if (err) return res.status(500).json({ error: "Lỗi khi lấy sản phẩm" });

        const updateQuantityPromises = products.map(product => {
          return new Promise((resolve, reject) => {
            const updateQtyQuery = `
              UPDATE tbl_product 
              SET quantity = ? 
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
            const updateOrderQuery = `UPDATE tbl_order SET status = ? WHERE code_order = ?`;
            connection.query(updateOrderQuery, [status, code], async (err) => {
              if (err) return res.status(500).json({ error: "Lỗi cập nhật đơn hàng" });

              try {
                await insertOrderTime(code, status);
              } catch (e) {
                console.error("Lỗi lưu lịch sử trạng thái:", e);
              }

              return res.json({ message: "Cập nhật trạng thái và trừ số lượng thành công" });
            });
          })
          .catch(() => res.status(500).json({ error: "Lỗi khi cập nhật số lượng sản phẩm" }));
      });
    } else {
      return res.status(400).json({ message: "Chỉ được phép từ trạng thái 0 sang 1" });
    }
  });
};

// In đơn nếu chưa xác nhận
const printOrderIfUnconfirmed = (req, res) => {
  const { code } = req.params;

  const getStatusQuery = "SELECT status FROM tbl_order WHERE code_order = ?";
  connection.query(getStatusQuery, [code], (err, results) => {
    if (err || results.length === 0) return res.status(500).json({ message: "Lỗi hoặc không tìm thấy" });

    const currentStatus = results[0].status;

    if (currentStatus === 0) {
      const updateQuery = "UPDATE tbl_order SET status = 1 WHERE code_order = ?";
      connection.query(updateQuery, [code], async (err2) => {
        if (err2) return res.status(500).json({ message: "Lỗi khi cập nhật trạng thái" });

        try {
          await insertOrderTime(code, 1);
        } catch (e) {
          console.error("Lỗi lưu lịch sử trạng thái:", e);
        }

        return res.json({ message: "Cập nhật trạng thái thành công" });
      });
    } else {
      return res.json({ message: "Đơn hàng không cần cập nhật" });
    }
  });
};


function generateStockCode() {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  const numbers = Math.floor(1000 + Math.random() * 9000);
  return code + numbers;
}

// Wrapper query Promise
function queryPromise(conn, sql, params) {
  return new Promise((resolve, reject) => {
    conn.query(sql, params, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
}

const markAsShipping = async (req, res) => {
  const { code } = req.params;
  const { id } = req.body;
  console.log("[SHIPPING] incoming:", { code, id });

  if (!id) {
    return res.status(400).json({ message: "Thiếu id nhân viên" });
  }

  connection.getConnection((err, conn) => {
    if (err) return res.status(500).json({ error: "Không kết nối được CSDL" });

    conn.beginTransaction(async (txErr) => {
      if (txErr) {
        conn.release();
        return res.status(500).json({ error: "Không thể bắt đầu transaction" });
      }

      try {
        // 1) Kiểm tra trạng thái đơn
        const statusRows = await queryPromise(
          conn,
          "SELECT status FROM tbl_order WHERE code_order = ?",
          [code]
        );

        if (!statusRows.length)
          throw { status: 404, message: "Đơn hàng không tồn tại" };

        if (statusRows[0].status !== 1)
          throw { status: 400, message: "Chỉ chuyển từ trạng thái 1 sang 2" };

        // 2) Lấy chi tiết sản phẩm
        const orderItems = await queryPromise(
          conn,
          `SELECT od.id_product, od.quantity_product AS quantity, p.price
           FROM tbl_order_detail od
           JOIN tbl_product p ON od.id_product = p.id_product
           WHERE od.code_order = ?`,
          [code]
        );

        if (!orderItems.length)
          throw { status: 400, message: "Đơn hàng không có sản phẩm" };

        console.log("[SHIPPING] orderItems:", orderItems);

        // 3) Kiểm tra tồn kho và trừ
        for (const item of orderItems) {
          const product = await queryPromise(
            conn,
            "SELECT quantity FROM tbl_product WHERE id_product = ?",
            [item.id_product]
          );

          if (!product.length)
            throw { status: 400, message: `Sản phẩm ${item.id_product} không tồn tại` };

          const available = product[0].quantity;

          if (item.quantity > available)
            throw {
              status: 400,
              message: `Sản phẩm ID ${item.id_product} chỉ còn ${available}`,
            };

          await queryPromise(
            conn,
            "UPDATE tbl_product SET quantity = quantity - ? WHERE id_product = ?",
            [item.quantity, item.id_product]
          );
        }

        // 4) Tạo phiếu xuất (tbl_stock)
        const code_stock = generateStockCode();
        console.log("[SHIPPING] code_stock:", code_stock);

        const insertStock = await queryPromise(
          conn,
          `INSERT INTO tbl_stock (code_stock, type, note, supplier, id_employee, code_order)
           VALUES (?, 'EXPORT', 'Phiếu xuất tự động khi duyệt đơn', '', ?, ?)`,
          [code_stock, id, code]
        );

        const id_stock = insertStock.insertId;
        console.log("[SHIPPING] created stock:", { id_stock });

        // 5) Thêm chi tiết phiếu xuất (tbl_stock_detail)
        for (const item of orderItems) {
          const price = item.price ? item.price : 0;

          await queryPromise(
            conn,
            `INSERT INTO tbl_stock_detail (id_stock, id_product, quantity, price)
             VALUES (?, ?, ?, ?)`,
            [id_stock, item.id_product, item.quantity, price]
          );
        }

        // 6) Cập nhật trạng thái đơn
        await queryPromise(
          conn,
          "UPDATE tbl_order SET status = 2 WHERE code_order = ?",
          [code]
        );

        conn.commit((commitErr) => {
          if (commitErr) {
            return conn.rollback(() => {
              conn.release();
              res.status(500).json({ error: "Lỗi commit" });
            });
          }

          conn.release();
          res.json({
            message: "Chuyển trạng thái → Đang vận chuyển + tạo phiếu xuất thành công",
            code_stock,
            id_stock,
          });
        });

      } catch (error) {
        console.error("[SHIPPING] error:", error);
        conn.rollback(() => {
          conn.release();
          if (error.status)
            return res.status(error.status).json({ message: error.message });

          return res.status(500).json({ error: "Lỗi xử lý" });
        });
      }
    });
  });
};

// Đã giao hàng (2 -> 3)
const markAsDelivered = (req, res) => {
  const { code } = req.params;

  const getStatusQuery = 'SELECT status FROM tbl_order WHERE code_order = ?';
  connection.query(getStatusQuery, [code], (err, result) => {
    if (err) return res.status(500).json({ error: "Lỗi khi truy vấn" });
    if (result.length === 0) return res.status(404).json({ message: "Đơn hàng không tồn tại" });

    if (result[0].status !== 2) {
      return res.status(400).json({ message: "Chỉ có thể từ đang vận chuyển sang đã giao hàng" });
    }

    const updateOrderStatus = 'UPDATE tbl_order SET status = 3 WHERE code_order = ?';
    connection.query(updateOrderStatus, [code], async (err2) => {
      if (err2) return res.status(500).json({ error: "Lỗi khi cập nhật trạng thái" });

      try {
        await insertOrderTime(code, 3);
      } catch (e) {
        console.error("Lỗi lưu lịch sử trạng thái:", e);
      }

      const updatePayment = 'UPDATE tbl_payment_infor SET paystatus = 1 WHERE code_order = ?';
      connection.query(updatePayment, [code], (err3) => {
        if (err3) return res.status(500).json({ error: "Lỗi khi cập nhật thanh toán" });

        // --- Bắt đầu tính bảo hành ---
        const getProductsInOrder = `
          SELECT od.id_product, gp.warranty_level
          FROM tbl_order_detail od
          JOIN tbl_product p ON od.id_product = p.id_product
          JOIN tbl_group_product gp ON p.id_group_product = gp.id_group_product 
          WHERE od.code_order = ?;
        `;

        connection.query(getProductsInOrder, [code], (err4, products) => {
          if (err4) {
            console.error("Lỗi lấy sản phẩm để tính bảo hành:", err4);
            return res.status(500).json({ error: "Lỗi khi tính bảo hành" });
          }

          const today = new Date();

          products.forEach(prod => {
            let endDate = new Date(today);

            // Tính thời gian bảo hành theo warranty_level
            switch (prod.warranty_level) {
              case 1: endDate.setMonth(endDate.getMonth() + 6); break;
              case 2: endDate.setFullYear(endDate.getFullYear() + 1); break;
              case 3: endDate.setFullYear(endDate.getFullYear() + 2); break;
              case 4: endDate.setFullYear(endDate.getFullYear() + 3); break;
              case 0: endDate = null; break; // Trọn đời
            }

            const updateWarranty = `
              UPDATE tbl_order_detail 
              SET date_start_warranty = ?, date_end_warranty = ?
              WHERE code_order = ? AND id_product = ?;
            `;

            connection.query(
              updateWarranty,
              [
                today,
                endDate ? endDate : null,
                code,
                prod.id_product
              ],
              (err5) => {
                if (err5) {
                  console.error("Lỗi cập nhật bảo hành:", err5);
                }
              }
            );
          });

          return res.json({ message: "Đơn hàng đã chuyển sang: Đã giao hàng và bắt đầu bảo hành" });
        });
      });
    });
  });
};


// Hủy đơn
const cancelOrder = (req, res) => {
  const { code } = req.params;
  const { reason } = req.body;

  if (!reason || reason.trim() === "") {
    return res.status(400).json({ message: "Vui lòng nhập lý do hủy đơn" });
  }

  const getStatusQuery = 'SELECT status FROM tbl_order WHERE code_order = ?';
  connection.query(getStatusQuery, [code], (err, result) => {
    if (err) return res.status(500).json({ error: "Lỗi khi truy vấn" });
    if (result.length === 0) return res.status(404).json({ message: "Đơn hàng không tồn tại" });

    if (result[0].status === 3 || result[0].status === 5) {
      return res.status(400).json({ message: "Không thể hủy đơn đã giao hoặc đã hủy" });
    }

    const updateQuery = `UPDATE tbl_order SET status = 5, cancel_reason = ? WHERE code_order = ?`;
    connection.query(updateQuery, [reason, code], async (err2) => {
      if (err2) return res.status(500).json({ error: "Lỗi khi cập nhật hủy" });

      try {
        await insertOrderTime(code, 5);
      } catch (e) {
        console.error("Lỗi lưu lịch sử trạng thái:", e);
      }

      return res.json({ message: "Đơn hàng đã được hủy thành công" });
    });
  });
};

module.exports = {
  getOrders,
  getOrderByCode,
  updateOrder,
  printOrderIfUnconfirmed,
  markAsShipping,
  markAsDelivered,
  cancelOrder
};
