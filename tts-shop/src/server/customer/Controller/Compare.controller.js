const db = require("../../db");

const compareProducts = async (req, res) => {
  const ids = req.query.ids;

  if (!ids) return res.status(400).json({ message: "Thiếu ID sản phẩm." });

  const idList = ids.split(',').map(id => parseInt(id)).filter(Boolean);
  if (idList.length < 2) return res.status(400).json({ message: "Phải có ít nhất 2 sản phẩm." });

  try {
    const productQuery = `
      SELECT 
        MIN(p.id_product) AS id_product,
        gp.id_group_product,
        gp.name_group_product,
        gp.id_category_product,
        MIN(p.price) AS price,
        (
          SELECT image 
          FROM tbl_product_images 
          WHERE id_product = MIN(p.id_product) 
          ORDER BY id_product_images ASC 
          LIMIT 1
        ) AS image
      FROM tbl_product p
      JOIN tbl_group_product gp ON p.id_group_product = gp.id_group_product
      WHERE p.id_group_product IN (?)
      GROUP BY gp.id_group_product
    `;

    const productResult = await new Promise((resolve, reject) => {
      db.query(productQuery, [idList], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });

    const specsQuery = `
      SELECT pa.id_group_product, pa.attribute, pa.value
      FROM tbl_parameter pa
      WHERE pa.id_group_product IN (?)
    `;

    const specResult = await new Promise((resolve, reject) => {
      db.query(specsQuery, [idList], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });

    res.json({
      products: productResult,
      specifications: specResult,
    });

  } catch (error) {
    console.error("Lỗi khi so sánh sản phẩm:", error);
    res.status(500).json({ error: "Lỗi server khi lấy dữ liệu so sánh." });
  }
};

module.exports = {
  compareProducts,
};
