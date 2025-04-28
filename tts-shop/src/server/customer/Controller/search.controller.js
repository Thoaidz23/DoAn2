const db = require("../../db");

const searchProducts = async (req, res) => {
  try {
    const { brand, category, search, price } = req.query;

    let query = "SELECT g.*,p.price FROM tbl_group_product g JOIN tbl_product p ON p.id_group_product = g.id_group_product GROUP BY g.name_group_product WHERE 1=1";
    const params = [];

    if (brand) {
      query += " AND id_category_brand = ?";
      params.push(brand);
    }

    if (category) {
      query += " AND id_category_product = ?";
      params.push(category);
    }

    if (search) {
      query += " AND name_group_product LIKE ?";
      params.push(`%${search}%`);
    }

    if (price) {
      const [min, max] = price.split("-");
      if (min !== "") {
        query += " AND price >= ?";
        params.push(Number(min));
      }
      if (max !== "") {
        query += " AND price <= ?";
        params.push(Number(max));
      }
    }
    
    

    const [products] = await db.promise().query(query, params);
    res.json(products);
  } catch (error) {
    console.error("Lỗi khi tìm kiếm sản phẩm:", error);
    res.status(500).json({ error: "Lỗi máy chủ khi tìm kiếm sản phẩm" });
  }
};

module.exports = { searchProducts };
