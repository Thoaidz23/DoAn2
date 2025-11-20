const db = require("../../db");

const getAllSpecs = async (req, res) => {
  try {
    const [rows] = await db.promise().query(`
      SELECT DISTINCT attribute, value 
      FROM tbl_parameter
      ORDER BY attribute ASC
    `);

    const specs = {};

    rows.forEach(row => {
      if (!specs[row.attribute]) specs[row.attribute] = [];
      specs[row.attribute].push(row.value);
    });

    res.json(specs);
  } catch (error) {
    console.error("Lỗi lấy thông số kỹ thuật:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

module.exports = { getAllSpecs };
