// controllers/customerController.js
const db = require("../../db"); // file kết nối MySQL

exports.getAllCustomers = (req, res) => {
  const query = "SELECT *  FROM tbl_user WHERE role = 3";

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching customers:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
    res.json(results);
  });
};
