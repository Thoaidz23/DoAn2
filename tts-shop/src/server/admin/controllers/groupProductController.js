const connection = require('../../db');  // Kết nối pool MySQL sẵn có
const mysql = require('mysql2/promise'); // Tạo kết nối riêng dùng transaction

// 1. Lấy tất cả nhóm sản phẩm
const getAllProducts = (req, res) => {
  const sql = `
    SELECT g.name_group_product, g.image, b.name_category_brand, c.name_category_product, g.id_group_product
    FROM tbl_group_product g 
    INNER JOIN tbl_category_brand b ON g.id_category_brand = b.id_category_brand 
    INNER JOIN tbl_category_product c ON g.id_category_product = c.id_category_product
  `;
  connection.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

// 2. Lấy chi tiết nhóm sản phẩm cùng cấu hình và thông số kỹ thuật theo id
const getGroupProductById = (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT p.*, 
          gp.name_group_product, gp.content,
          c.name_color, r1.name_ram, r2.name_rom,
          gp.image,
          gp.id_category_product,
          gp.id_category_brand,
          cb.name_category_brand,
          cp.name_category_product,
          pa.attribute,
          pa.value
    FROM tbl_product p
    JOIN tbl_group_product gp ON p.id_group_product = gp.id_group_product
    LEFT JOIN tbl_color c ON p.id_color = c.id_color
    LEFT JOIN tbl_ram r1 ON p.id_ram = r1.id_ram
    LEFT JOIN tbl_rom r2 ON p.id_rom = r2.id_rom  
    LEFT JOIN tbl_category_brand cb ON cb.id_category_brand = gp.id_category_brand
    LEFT JOIN tbl_category_product cp ON cp.id_category_product = gp.id_category_product
    LEFT JOIN tbl_parameter pa ON pa.id_group_product = gp.id_group_product
    WHERE p.id_group_product = ?
  `;

  connection.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    res.json(results);
  });
};

// 3. Lấy danh mục sản phẩm
const getProductCag = (req, res) => {
  connection.query('SELECT * FROM tbl_category_product', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

// 4. Lấy danh mục thương hiệu
const getBrandCategory = (req, res) => {
  connection.query('SELECT * FROM tbl_category_brand', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

// 5. Lấy danh sách RAM
const getRamOptions = (req, res) => {
  connection.query('SELECT * FROM tbl_ram', (err, results) => {
    if (err) return res.status(500).json({ message: 'Lỗi khi lấy dữ liệu RAM' });
    res.json(results);
  });
};

// 6. Lấy danh sách ROM
const getRomOptions = (req, res) => {
  connection.query('SELECT * FROM tbl_rom', (err, results) => {
    if (err) return res.status(500).json({ message: 'Lỗi khi lấy dữ liệu ROM' });
    res.json(results);
  });
};

// 7. Lấy danh sách màu
const getColorOptions = (req, res) => {
  connection.query('SELECT * FROM tbl_color', (err, results) => {
    if (err) return res.status(500).json({ message: 'Lỗi khi lấy dữ liệu màu sắc' });
    res.json(results);
  });
};

// 8. Thêm nhóm sản phẩm mới cùng cấu hình và thông số kỹ thuật
const addProduct = async (req, res) => {
  const { name_group_product, content, id_category_product, id_category_brand } = req.body;
  let parameters = [];
  let classifications = [];

  try {
    parameters = req.body.parameters ? JSON.parse(req.body.parameters) : [];
    classifications = req.body.classifications ? JSON.parse(req.body.classifications) : [];
  } catch (error) {
    return res.status(400).json({ message: 'Dữ liệu không hợp lệ.' });
  }

  const image = req.file?.filename || null;

  const conn = await mysql.createConnection({ host: 'localhost', user: 'root', password: '', database: 'ttsshop' });

  try {
    await conn.beginTransaction();

    const [groupResult] = await conn.execute(
      `INSERT INTO tbl_group_product (name_group_product, content, image, id_category_product, id_category_brand, is_del) 
       VALUES (?, ?, ?, ?, ?, 0)`,
      [name_group_product, content, image, id_category_product, id_category_brand]
    );
    const id_group_product = groupResult.insertId;

    for (const config of classifications) {
      const { ram, rom, color, quantity, price } = config;
      await conn.execute(
        `INSERT INTO tbl_product (id_group_product, id_ram, id_rom, id_color, quantity, price) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [id_group_product, ram, rom, color, quantity, price]
      );
    }

    for (const param of parameters) {
      const { attribute, value } = param;
      await conn.execute(
        `INSERT INTO tbl_parameter (id_group_product, attribute, value) 
         VALUES (?, ?, ?)`,
        [id_group_product, attribute, value]
      );
    }

    await conn.commit();
    res.status(201).json({ message: "Thêm sản phẩm thành công!" });

  } catch (err) {
    await conn.rollback();
    res.status(500).json({ error: "Lỗi khi thêm sản phẩm!" });

  } finally {
    await conn.end();
  }
};

// 9. Cập nhật nhóm sản phẩm
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const {
    name_group_product,
    content,
    id_category_product,
    id_category_brand,
    classifications,
    parameters
  } = req.body;

  let parsedConfigurations = [];
  let parsedParameters = [];

  try {
    parsedConfigurations = classifications ? JSON.parse(classifications) : [];
    parsedParameters = parameters ? JSON.parse(parameters) : [];
  } catch (err) {
    return res.status(400).json({ error: "Dữ liệu không hợp lệ." });
  }

  const image = req.file?.filename || null;

  const conn = await mysql.createConnection({ host: 'localhost', user: 'root', password: '', database: 'ttsshop' });

  try {
    await conn.beginTransaction();

    let updateGroupQuery = `
      UPDATE tbl_group_product
      SET name_group_product = ?, content = ?, id_category_product = ?, id_category_brand = ?
      ${image ? ', image = ?' : ''}
      WHERE id_group_product = ?
    `;

    const updateGroupParams = image
      ? [name_group_product, content, id_category_product, id_category_brand, image, id]
      : [name_group_product, content, id_category_product, id_category_brand, id];

    await conn.execute(updateGroupQuery, updateGroupParams);

    const [existingProducts] = await conn.execute('SELECT id_product FROM tbl_product WHERE id_group_product = ?', [id]);
    const existingIds = existingProducts.map(p => p.id_product);
    const receivedIds = parsedConfigurations.map(p => p.id_product).filter(Boolean);

    for (const id_product of existingIds) {
      if (!receivedIds.includes(id_product)) {
        await conn.execute('DELETE FROM tbl_product WHERE id_product = ?', [id_product]);
      }
    }

    for (const config of parsedConfigurations) {
      const { id_product, ram, rom, color, quantity, price } = config;
      if (id_product) {
        await conn.execute(
          `UPDATE tbl_product SET id_ram = ?, id_rom = ?, id_color = ?, quantity = ?, price = ? WHERE id_product = ?`,
          [ram, rom, color, quantity, price, id_product]
        );
      } else {
        await conn.execute(
          `INSERT INTO tbl_product (id_group_product, id_ram, id_rom, id_color, quantity, price)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [id, ram, rom, color, quantity, price]
        );
      }
    }

    await conn.execute('DELETE FROM tbl_parameter WHERE id_group_product = ?', [id]);

    for (const param of parsedParameters) {
      const { attribute, value } = param;
      await conn.execute(
        `INSERT INTO tbl_parameter (id_group_product, attribute, value) VALUES (?, ?, ?)`,
        [id, attribute, value]
      );
    }

    await conn.commit();
    res.status(200).json({ message: "Cập nhật sản phẩm thành công!" });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ error: "Lỗi khi cập nhật sản phẩm!" });
  } finally {
    await conn.end();
  }
};

const getProductImages = async (req, res) => {
  const { id } = req.params;
  try {
    // thêm .promise() để query trả về promise
    const [rows] = await connection.promise().query("SELECT * FROM tbl_product_images WHERE id_group_product = ?", [id]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server khi lấy ảnh", error: err });
  }
};

const uploadProductImage = async (req, res) => {
  const { id } = req.params;
  const imagePath = req.file?.filename;
  if (!imagePath) return res.status(400).json({ message: "Thiếu tệp ảnh" });

  try {
    // thêm .promise()
    await connection.promise().query("INSERT INTO tbl_product_images (id_group_product, name) VALUES (?, ?)", [id, imagePath]);
    res.status(201).json({ message: "Tải ảnh lên thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server khi thêm ảnh", error: err });
  }
};

const deleteProductImage = async (req, res) => {
  const { imageId } = req.params;
  try {
    // thêm .promise()
    await connection.promise().query("DELETE FROM tbl_product_images WHERE id_product_images = ?", [imageId]);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ message: "Lỗi server khi xóa ảnh", error: err });
  }
};

// Hàm cập nhật trạng thái is_del cho nhóm sản phẩm
const updateIsDel = (req, res) => {
  const id = req.params.id;
  const { is_del } = req.body; // lấy từ body gửi lên

  const sql = "UPDATE tbl_group_product SET is_del = ? WHERE id_group_product = ?";
  connection.query(sql, [is_del, id], (err, result) => {
    if (err) return res.status(500).json({ message: "Lỗi server khi cập nhật trạng thái" });
    res.json({ message: "Cập nhật trạng thái thành công" });
  });
};



module.exports = {
  getAllProducts,
  getGroupProductById,
  addProduct,
  getProductCag,
  getRamOptions,
  getRomOptions,
  getColorOptions,
  getBrandCategory,
  updateProduct,
  getProductImages,
  uploadProductImage,
  deleteProductImage,
  updateIsDel, 
};