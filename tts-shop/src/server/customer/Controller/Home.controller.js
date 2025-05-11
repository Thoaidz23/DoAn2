const db = require('../../db');

const getHomeData = async (req, res) => {
  try {
    // Lấy nhóm sản phẩm
    const [products] = await db.promise().query('SELECT g.*,p.price FROM tbl_group_product g JOIN tbl_product p ON p.id_group_product = g.id_group_product GROUP BY g.name_group_product');
    
    // Lấy danh mục sản phẩm
    const [categories] = await db.promise().query('SELECT * FROM tbl_category_product');

    // Lấy thương hiệu theo danh mục sản phẩm
    const [rawBrands] = await db.promise().query(`
       SELECT DISTINCT dmsp.id_category_product, th.name_category_brand,th.id_category_brand
      FROM tbl_group_product sp
      JOIN tbl_category_brand th ON th.id_category_brand = sp.id_category_brand
      JOIN tbl_category_product dmsp ON dmsp.id_category_product = sp.id_category_product 
    `);

    // Nhóm thương hiệu theo id_dmsp
    const brandsByCategory = rawBrands.reduce((acc, item) => {
      const id = item.id_category_product;
      if (!acc[id]) acc[id] = [];
      if (!acc[id].some((b) => b.id_category_brand=== item.id_category_brand)) {
        acc[id].push({ id_category_brand: item.id_category_brand, name_category_brand: item.name_category_brand });
      }
      return acc;
    }, {});

    // Lấy bài viết
    const [posts] = await db.promise().query('SELECT * FROM tbl_post ORDER BY date DESC');
    const [banner]  = await db.promise().query('SELECT * FROM tbl_banner');
    
    res.status(200).json({ products, categories, brandsByCategory, posts , banner});

  } catch (err) {
    console.error("Lỗi truy vấn:", err);
    res.status(500).json({ error: "Lỗi truy vấn dữ liệu trang chủ" });
  }
};

module.exports = { getHomeData };
