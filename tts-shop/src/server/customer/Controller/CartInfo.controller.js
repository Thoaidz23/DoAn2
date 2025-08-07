const db = require("../../db");
// BẠN ĐANG QUÊN IMPORT nodemailer
const { v4: uuidv4 } = require("uuid");

// Lấy thông tin giỏ hàng và người dùngd
const getPay = async (req, res) => {
  const { id } = req.params;

  try {
    // Lấy chi tiết sản phẩm trong giỏ hàng
    const productQuery = `
      SELECT c.*, gp.image, gp.name_group_product,c.price-((c.price/100)*gp.sale) as saleprice,r1.name_ram,r2.name_rom,cl.name_color
      FROM tbl_cart c 
      JOIN tbl_product p ON c.id_product = p.id_product 
      JOIN tbl_group_product gp ON gp.id_group_product = c.id_group_product
      LEFT JOIN tbl_color cl ON p.id_color = cl.id_color
      LEFT JOIN tbl_ram r1 ON p.id_ram = r1.id_ram
      LEFT JOIN tbl_rom r2 ON p.id_rom = r2.id_rom  
      WHERE c.id_user = ?
    `;

    const productResult = await new Promise((resolve, reject) => {
      db.query(productQuery, [id], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });

    if (productResult.length === 0) {
      return res.status(404).json({ message: "Không có sản phẩm nào trong giỏ hàng." });
    }

    // Lấy thông tin người dùng
    const UserQuery = `SELECT * FROM tbl_user WHERE id_user = ?`;
    const UserResult = await new Promise((resolve, reject) => {
      db.query(UserQuery, [id], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });

    res.json({
      product: productResult,
      User: UserResult,
    });
  } catch (err) {
    console.error("Lỗi khi lấy chi tiết sản phẩm:", err);
    res.status(500).json({ error: "Lỗi server khi lấy chi tiết sản phẩm" });
  }
};

module.exports = {
  getPay
};
