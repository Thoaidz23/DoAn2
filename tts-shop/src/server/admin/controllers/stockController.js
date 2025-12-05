const db = require("../../db");

// ==========================
// Tạo mã phiếu nhập
// ==========================
function generateStockCode() {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let code = "";
    for (let i = 0; i < 4; i++) {
        code += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    const numbers = Math.floor(1000 + Math.random() * 9000);
    return code + numbers;
}

// ==========================
// Tạo phiếu nhập
// ==========================
exports.importStock = (req, res) => {
    const { items, note, supplier, id_user } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: "Chưa có sản phẩm để nhập" });
    }

    const code_stock = generateStockCode();

    db.execute(
        "INSERT INTO tbl_stock (code_stock, type, note, supplier, id_employee) VALUES (?, 'IMPORT', ?, ?, ?)",
        [code_stock, note || null, supplier || null, id_user],
        (err, result) => {
            if (err) return res.status(500).json({ error: err });

            const id_stock = result.insertId;

            items.forEach(item => {
                db.execute(
                    "INSERT INTO tbl_stock_detail (id_stock, id_product, quantity, price) VALUES (?,?,?,?)",
                    [id_stock, item.id_product, item.quantity, item.price]
                );

                // Cập nhật tồn kho
                db.execute(
                    "UPDATE tbl_product SET quantity = quantity + ? WHERE id_product = ?",
                    [item.quantity, item.id_product]
                );
            });

            return res.json({ message: "Nhập kho thành công", id_stock, code_stock });
        }
    );
};

// ==========================
// Lấy danh sách phiếu
// ==========================
exports.getAllStock = (req, res) => {
    db.execute(
        "SELECT * FROM tbl_stock ORDER BY id_stock DESC",
        (err, rows) => {
            if (err) return res.status(500).json({ error: err });
            res.json(rows);
        }
    );
};

// ==========================
// Lấy chi tiết phiếu
// ==========================
exports.getStockDetail = (req, res) => {
    const { id_stock } = req.params;

    db.execute(
        "SELECT * FROM tbl_stock WHERE id_stock = ?",
        [id_stock],
        (err, rows) => {
            if (err) return res.status(500).json({ error: err });

            const stock = rows[0];

            db.execute(
                `SELECT sd.*, gp.name_group_product AS name,
                        r.name_ram , ro.name_rom, c.name_color
                 FROM tbl_stock_detail sd
                 JOIN tbl_product p ON sd.id_product = p.id_product
                 LEFT JOIN tbl_group_product gp ON gp.id_group_product = p.id_group_product
                 LEFT JOIN tbl_ram r ON p.id_ram = r.id_ram
                 LEFT JOIN tbl_rom ro ON p.id_rom = ro.id_rom
                 LEFT JOIN tbl_color c ON p.id_color = c.id_color
                 WHERE sd.id_stock = ?`,
                [id_stock],
                (err2, details) => {
                    if (err2) return res.status(500).json({ error: err2 });

                    res.json({ stock, details });
                }
            );
        }
    );
};

exports.getHistoryByProduct = (req, res) => {
    const { id_product } = req.params;
    const { startDate, endDate } = req.query;

    let dateFilter = "";
    let dateValues = [];

    // Tạo bộ lọc ngày nếu có start - end
    if (startDate && endDate) {
        dateFilter = "AND s.created_at BETWEEN ? AND ?";
        dateValues = [startDate + " 00:00:00", endDate + " 23:59:59"];
    }

    const qCurrent = `SELECT quantity FROM tbl_product WHERE id_product = ?`;

    const qImport = `
        SELECT 
            sd.id_stock_detail, 
            s.code_stock, 
            sd.quantity, 
            sd.price, 
            s.supplier, 
            s.created_at,
            DATE_FORMAT(s.created_at, '%Y-%m-%d %H:%i:%s') AS date
        FROM tbl_stock_detail sd
        JOIN tbl_stock s ON s.id_stock = sd.id_stock
        WHERE sd.id_product = ? AND s.type = 'IMPORT'
        ${dateFilter}
        ORDER BY s.created_at ASC
    `;

    const qExport = `
        SELECT 
            sd.id_stock_detail, 
            s.code_stock, 
            sd.quantity, 
            s.code_order, 
            s.created_at,
            DATE_FORMAT(s.created_at, '%Y-%m-%d %H:%i:%s') AS date
        FROM tbl_stock_detail sd
        JOIN tbl_stock s ON s.id_stock = sd.id_stock
        WHERE sd.id_product = ? AND s.type = 'EXPORT'
        ${dateFilter}
        ORDER BY s.created_at ASC
    `;

    const qAdjust = `
        SELECT 
            sad.id AS id_detail,
            sa.code_adjust, 
            sad.adjust_quantity, 
            sa.reason, 
            sa.id_staff,
            sa.created_at,
            DATE_FORMAT(sa.created_at, '%Y-%m-%d %H:%i:%s') AS date
        FROM stock_adjustments sa
        JOIN stock_adjustment_details sad 
            ON sa.id = sad.id_adjust
        WHERE sad.id_product = ?
        ${dateFilter.replace(/s\./g, "sa.")}   -- đổi alias
        ORDER BY sa.created_at ASC
    `;

    db.query(qCurrent, [id_product], (err, current) => {
        if (err) return res.status(500).json({ error: err });
        const current_quantity = current[0]?.quantity || 0;

        db.query(qImport, [id_product, ...dateValues], (err2, imports) => {
            if (err2) return res.status(500).json({ error: err2 });

            db.query(qExport, [id_product, ...dateValues], (err3, exports) => {
                if (err3) return res.status(500).json({ error: err3 });

                db.query(qAdjust, [id_product, ...dateValues], (err4, adjustments) => {
                    if (err4) return res.status(500).json({ error: err4 });

                    const map = new Map();

                    // Gộp timeline
                    imports.forEach(r => {
                        if (!map.has(r.date))
                            map.set(r.date, { date: r.date, import: 0, export: 0, adjust: 0 });
                        map.get(r.date).import += r.quantity;
                    });

                    exports.forEach(r => {
                        if (!map.has(r.date))
                            map.set(r.date, { date: r.date, import: 0, export: 0, adjust: 0 });
                        map.get(r.date).export += r.quantity;
                    });

                    adjustments.forEach(r => {
                        if (!map.has(r.date))
                            map.set(r.date, { date: r.date, import: 0, export: 0, adjust: 0 });
                        map.get(r.date).adjust += Math.abs(r.adjust_quantity);
                    });

                    const timeline = Array.from(map.values()).sort(
                        (a, b) => new Date(a.date) - new Date(b.date)
                    );

                    const history = timeline.map(row => ({
                        date: row.date,
                        change: row.import - row.export - row.adjust
                    }));

                    return res.json({
                        current_quantity,
                        imports,
                        exports,
                        adjustments,
                        history
                    });
                });
            });
        });
    });
};
