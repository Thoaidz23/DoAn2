const db = require("../../db");

const searchProducts = async (req, res) => {
  try {
    const { brand, category, search, price } = req.query;

    let query = `
    SELECT g.*, p.price-((p.price/100)*g.sale) as saleprice, p.price, cp.name_category_product, cb.name_category_brand
    FROM tbl_group_product g 
    JOIN tbl_product p ON p.id_group_product = g.id_group_product 
    LEFT JOIN tbl_category_product cp ON cp.id_category_product = g.id_category_product
    LEFT JOIN tbl_category_brand cb ON cb.id_category_brand = g.id_category_brand
    WHERE g.is_del = 0`;
    const params = [];

    if (brand) {
      query += " AND g.id_category_brand = ?";
      params.push(brand);
    }

    if (category) {
      query += " AND g.id_category_product = ?";
      params.push(category);
    }

    if (search) {
      query += " AND g.name_group_product LIKE ?";
      params.push(`%${search}%`);
    }

    if (price) {
      const [min, max] = price.split("-");
      if (min !== "") {
        query += " AND p.price >= ?";
        params.push(Number(min));
      }
      if (max !== "") {
        query += " AND p.price <= ?";
        params.push(Number(max));
      }
    }

    query += " GROUP BY g.name_group_product";

    const [products] = await db.promise().query(query, params);
    res.json(products);
  } catch (error) {
    console.error("Lỗi khi tìm kiếm sản phẩm:", error);
    res.status(500).json({ error: "Lỗi máy chủ khi tìm kiếm sản phẩm" });
  }
};

module.exports = { searchProducts };
