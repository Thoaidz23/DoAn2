const db = require("../../db");

// Lấy chi tiết sản phẩm và thông số kỹ thuật
const getProductDetail = async (req, res) => {
  const { id } = req.params;

  try {
    // Lấy chi tiết sản phẩm
    const productQuery = `
      SELECT p.*, 
             gp.name_group_product, 
             gp.content,
             c.name_color, 
             r1.name_ram, 
             r2.name_rom,
             GROUP_CONCAT(CONCAT('http://localhost:5000/images/product/', i.name) ORDER BY i.id_product_images ASC) AS images
      FROM tbl_product p
      JOIN tbl_group_product gp ON p.id_group_product = gp.id_group_product
      LEFT JOIN tbl_color c ON p.id_color = c.id_color
      LEFT JOIN tbl_ram r1 ON p.id_ram = r1.id_ram
      LEFT JOIN tbl_rom r2 ON p.id_rom = r2.id_rom  
      LEFT JOIN tbl_product_images i ON i.id_group_product = gp.id_group_product
      WHERE p.id_group_product = ?
      GROUP BY p.id_product;
    `;
   
    const productResult = await new Promise((resolve, reject) => {
      db.query(productQuery, [id], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
    
    // Kiểm tra tồn tại
    if (productResult.length === 0) {
      return res.status(404).json({ message: "Sản phẩm không tìm thấy." });
    }
    

    // Lấy thông số kỹ thuật
    const specificationsQuery = `
      SELECT pa.attribute, pa.value
      FROM tbl_parameter pa
      JOIN tbl_group_product p ON p.id_group_product = pa.id_group_product
      LEFT JOIN tbl_group_product g ON g.id_group_product = p.id_group_product
      WHERE g.id_group_product =  ?;
    `;
    const specificationsResult = await new Promise((resolve, reject) => {
      db.query(specificationsQuery, [id], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });

    const postQuery = `
      SELECT *
      FROM tbl_post
      ORDER BY id_post DESC
    `;
    const postResult = await new Promise((resolve, reject) => {
      db.query(postQuery, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });

    

    // Gửi về client
    res.json({
      product: productResult, 
      specifications: specificationsResult,
      post: postResult
    }); 

  } catch (err) {
    console.error("Lỗi khi lấy chi tiết sản phẩm:", err);
    res.status(500).json({ error: "Lỗi server khi lấy chi tiết sản phẩm" });
  }
};

module.exports = {
  getProductDetail,
};
