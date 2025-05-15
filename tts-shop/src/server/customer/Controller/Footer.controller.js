const db = require("../../db");

exports.getFooterInfo = (req, res) => {
  const query = "SELECT * FROM tbl_footer";

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
};
