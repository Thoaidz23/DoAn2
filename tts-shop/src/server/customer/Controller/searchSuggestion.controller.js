const db = require("../../db");

exports.getSearchSuggestions = (req, res) => {
  const query = req.query.query || "";

  const sql = `
    SELECT id_group_product, name_group_product, image
    FROM tbl_group_product
    WHERE name_group_product LIKE ?
    LIMIT 5
  `;

  db.execute(sql, [`%${query}%`], (err, results) => {
    if (err) {
      console.error("❌ Lỗi truy vấn:", err);
      return res.status(500).json({ error: "Server error" });
    }

    res.json(results); // Không cần destructuring
  });
};
