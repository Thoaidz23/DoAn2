const db = require("../../db");

exports.getAll = (req, res) => {
    db.query(`SELECT sad.*, u.name
              FROM stock_adjustments sad
              JOIN tbl_user u ON u.id_user = sad.id_staff
              ORDER BY id DESC`, (err, data) => {
        if (err) return res.status(500).json(err);
        res.json(data);
    });
};


exports.getDetail = (req, res) => {
    const id = req.params.id;

    const q1 = `SELECT * FROM stock_adjustments WHERE id = ?`;
    const q2 = `
        SELECT sad.*, 
               gp.name_group_product, 
               p.id_product,
               p.quantity AS quantity_product, 
               r.name_ram,
               ro.name_rom,
               c.name_color,
               u.name AS staff_name
        FROM stock_adjustment_details sad
        JOIN stock_adjustments sa ON sa.id = sad.id_adjust
        LEFT JOIN tbl_product p ON p.id_product = sad.id_product
        LEFT JOIN tbl_group_product gp ON gp.id_group_product = p.id_group_product
        LEFT JOIN tbl_user u ON u.id_user = sa.id_staff
        LEFT JOIN tbl_ram r ON r.id_ram = p.id_ram
        LEFT JOIN tbl_rom ro ON ro.id_rom = p.id_rom
        LEFT JOIN tbl_color c ON c.id_color = p.id_color
        WHERE sad.id_adjust = ?
    `;

    db.query(q1, [id], (err, adjust) => {
        if (err) return res.status(500).json(err);

        db.query(q2, [id], (err2, details) => {
            if (err2) return res.status(500).json(err2);

            res.json({ adjust: adjust[0], details });
        });
    });
};


exports.create = (req, res) => {
    const { id_staff, reason, items } = req.body;
    const code_adjust = "ADJ" + Date.now();

    if (!items || items.length === 0) {
        return res.status(400).json({ message: "Danh sách sản phẩm rỗng!" });
    }

    db.getConnection((err, conn) => {
        if (err) return res.status(500).json(err);

        conn.beginTransaction(async err => {
            if (err) {
                conn.release();
                return res.status(500).json(err);
            }

            try {
                // Tạo phiếu điều chỉnh
                const qAdjust = `
                    INSERT INTO stock_adjustments(code_adjust, id_staff, reason)
                    VALUES (?, ?, ?)
                `;

                const rs1 = await new Promise((resolve, reject) => {
                    conn.query(qAdjust, [code_adjust, id_staff, reason], (err, result) =>
                        err ? reject(err) : resolve(result)
                    );
                });

                const id_adjust = rs1.insertId;

                // Duyệt từng sản phẩm
                for (const item of items) {
                    // 1️⃣ Lấy tồn kho hiện tại
                    const rows = await new Promise((resolve, reject) => {
                        conn.query(
                            `SELECT quantity FROM tbl_product WHERE id_product = ?`,
                            [item.id_product],
                            (err, result) => err ? reject(err) : resolve(result)
                        );
                    });

                    const currentQty = rows[0]?.quantity ?? 0;

                    // 2️⃣ Nếu vượt quá thì rollback + báo lỗi
                    if (item.adjust_quantity > currentQty) {
                        await new Promise(resolve => conn.rollback(() => resolve()));
                        conn.release();
                        return res.status(400).json({
                            message: `❌ Sản phẩm ID ${item.id_product} chỉ còn ${currentQty}, không thể trừ ${item.adjust_quantity}!`
                        });
                    }

                    // 3️⃣ Lưu chi tiết
                    await new Promise((resolve, reject) => {
                        conn.query(
                            `INSERT INTO stock_adjustment_details(id_adjust, id_product, adjust_quantity)
                             VALUES (?, ?, ?)`,
                            [id_adjust, item.id_product, item.adjust_quantity],
                            (err) => err ? reject(err) : resolve()
                        );
                    });

                    // 4️⃣ Update tồn kho
                    await new Promise((resolve, reject) => {
                        conn.query(
                            `UPDATE tbl_product SET quantity = quantity - ? WHERE id_product = ?`,
                            [item.adjust_quantity, item.id_product],
                            (err) => err ? reject(err) : resolve()
                        );
                    });
                }

                // Nếu chạy hết vòng for → commit
                conn.commit(err => {
                    conn.release();
                    if (err) return res.status(500).json(err);

                    res.json({
                        message: "✅ Tạo phiếu điều chỉnh thành công!",
                        code_adjust
                    });
                });

            } catch (error) {
                conn.rollback(() => {
                    conn.release();
                    res.status(500).json({
                        message: "❌ Lỗi hệ thống!",
                        error
                    });
                });
            }
        });
    });
};
