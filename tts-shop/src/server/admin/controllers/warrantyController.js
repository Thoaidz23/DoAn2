const connection = require("../../db");

// Lấy danh sách yêu cầu bảo hành mới nhất theo mỗi (code_order, id_product)
const getAllWarrantyRequests = (req, res) => {
  const query = `
    SELECT w.*
    FROM tbl_warranty_requests w
    INNER JOIN (
      SELECT code_order, id_product, MAX(request_time) AS latest_time
      FROM tbl_warranty_requests
      GROUP BY code_order, id_product
    ) latest
    ON w.code_order = latest.code_order 
      AND w.id_product = latest.id_product 
      AND w.request_time = latest.latest_time
    ORDER BY w.request_time DESC
  `;

  connection.query(query, (err, results) => {
    if (err) {
      console.error("Lỗi khi lấy dữ liệu bảo hành:", err);
      return res.status(500).json({ error: "Lỗi server" });
    }
    res.json(results);
  });
};

// Cập nhật trạng thái và reply của yêu cầu bảo hành, đồng thời lưu lịch sử trạng thái
const updateWarrantyStatus = (req, res) => {
  const { id } = req.params;
  const { status, reply } = req.body;

  if (![0,1,2,3,4].includes(status)) {
    return res.status(400).json({ error: "Trạng thái không hợp lệ" });
  }

  console.log("📌 [UPDATE] Yêu cầu cập nhật:", { id, status, reply });

  const updateQuery = `
    UPDATE tbl_warranty_requests
    SET status = ?,
        reply = COALESCE(?, reply)
    WHERE id = ?
  `;

  connection.query(updateQuery, [status, reply || null, id], (err, result) => {
    if (err) {
      console.error("❌ Lỗi khi cập nhật trạng thái:", err);
      return res.status(500).json({ error: "Lỗi server" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Không tìm thấy yêu cầu bảo hành" });
    }

    // Thêm lịch sử trạng thái
    const insertHistoryQuery = `
      INSERT INTO tbl_warranty_time (id_warranty, status)
      VALUES (?, ?)
    `;

    connection.query(insertHistoryQuery, [id, status], (err2) => {
      if (err2) {
        console.error("❌ Lỗi khi lưu lịch sử bảo hành:", err2);
        return res.status(500).json({ error: "Lỗi server khi lưu lịch sử" });
      }

      res.json({ message: "Cập nhật thành công" });
    });
  });
};

// Lấy chi tiết các yêu cầu bảo hành theo code_order và id_product, kèm lịch sử trạng thái
const getWarrantyByCode = (req, res) => {
  const { code } = req.params;
  const { id_product } = req.query;

  if (!id_product) {
    return res.status(400).json({ error: "Thiếu id_product trong truy vấn" });
  }

  const mainQuery = `
    SELECT 
      w.*,
      od.quantity_product,
      od.date_start_warranty,
      od.date_end_warranty,
      o.id_order,
      o.total_price,
      o.status AS order_status,
      o.date,
      u.name AS user_name,
      u.email,
      u.phone,
      u.address,
      p.price,
      gp.name_group_product,
      gp.image,
      ram.name_ram,
      rom.name_rom,
      color.name_color
    FROM tbl_warranty_requests w
    JOIN tbl_order_detail od ON w.code_order = od.code_order AND w.id_product = od.id_product
    JOIN tbl_order o ON w.code_order = o.code_order
    JOIN tbl_user u ON o.id_user = u.id_user
    JOIN tbl_product p ON od.id_product = p.id_product
    JOIN tbl_group_product gp ON p.id_group_product = gp.id_group_product
    LEFT JOIN tbl_ram ram ON p.id_ram = ram.id_ram
    LEFT JOIN tbl_rom rom ON p.id_rom = rom.id_rom
    LEFT JOIN tbl_color color ON p.id_color = color.id_color
    WHERE w.code_order = ? AND w.id_product = ?
    ORDER BY w.request_time ASC
  `;

  connection.query(mainQuery, [code, id_product], (err, results) => {
    if (err) {
      console.error("❌ Lỗi truy vấn bảo hành:", err);
      return res.status(500).json({ error: "Lỗi máy chủ" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy yêu cầu bảo hành nào" });
    }

    // Lấy lịch sử từng bản ghi (nhớ là kết quả có nhiều yêu cầu)
    const promises = results.map(row => {
      return new Promise((resolve, reject) => {
        const historyQuery = `SELECT status, time FROM tbl_warranty_time WHERE id_warranty = ? ORDER BY time ASC`;
        connection.query(historyQuery, [row.id], (err2, history) => {
          if (err2) return reject(err2);

          resolve({
            id: row.id,
            code_order: row.code_order,
            warranty_status: row.status,
            request_time: row.request_time,
            issue: row.issue,
            reply: row.reply,
            history,
            user: {
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
          });
        });
      });
    });

    Promise.all(promises)
      .then(fullData => res.json(fullData))
      .catch(e => {
        console.error("❌ Lỗi khi truy vấn lịch sử:", e);
        res.status(500).json({ error: "Lỗi khi truy vấn lịch sử bảo hành" });
      });
  });
};

module.exports = {
  getAllWarrantyRequests,
  updateWarrantyStatus,
  getWarrantyByCode,
};
