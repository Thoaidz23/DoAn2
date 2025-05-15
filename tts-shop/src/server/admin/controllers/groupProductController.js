const connection = require('../../db');  // Đảm bảo bạn đã có kết nối với MySQL

const mysql = require('mysql2/promise'); // Thêm dòng này

// Lấy tất cả dòng sản phẩm
const getAllProducts = (req, res) => {
  const sql = `SELECT g.name_group_product, g.image, b.name_category_brand, c.name_category_product,g.id_group_product
FROM tbl_group_product g 
INNER JOIN tbl_category_brand b ON g.id_category_brand = b.id_category_brand 
INNER JOIN tbl_category_product c ON g.id_category_product = c.id_category_product`;
  connection.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

// Lấy chi tiết sản phẩm theo ID
const getGroupProductById = (req, res) => {
  const { id } = req.params;

  const sql = `
   SELECT p.*, 
             gp.name_group_product, 
             gp.content,
             c.name_color, 
             r1.name_ram, 
             r2.name_rom,
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
      LEFT JOIN tbl_product_images i ON i.id_group_product = gp.id_group_product
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

// Lấy tất cả danh mục sản phẩm
const getProductCag = (req, res) => {
  const sql = 'SELECT * FROM tbl_category_product';
  connection.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results); // Trả về danh sách danh mục
  });
};

// Lấy tất cả danh mục thương hiệu
const getBrandCategory = (req, res) => {
  const sql = 'SELECT * FROM tbl_category_brand'; // Query lấy tất cả dữ liệu từ bảng tbl_category_brand
  connection.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err }); // Xử lý lỗi nếu có
    res.json(results); // Trả về danh sách danh mục thương hiệu
  });
};


// Lấy danh sách RAM từ bảng tbl_ram
const getRamOptions = (req, res) => {
  const sql = 'SELECT * FROM tbl_ram';
  connection.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Lỗi khi lấy dữ liệu RAM' });
    }
    res.json(results);
  });
};

// Lấy danh sách ROM từ bảng tbl_rom
const getRomOptions = (req, res) => {
  const sql = 'SELECT * FROM tbl_rom';
  connection.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Lỗi khi lấy dữ liệu ROM' });
    }
    res.json(results);
  });
};

// Lấy danh sách Màu từ bảng tbl_color
const getColorOptions = (req, res) => {
  const sql = 'SELECT * FROM tbl_color';
  connection.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Lỗi khi lấy dữ liệu màu sắc' });
    }
    res.json(results);
  });
};


const addProduct = async (req, res) => {
  console.log("Dữ liệu nhận được từ client:", req.body);
  console.log("Dữ liệu cấu hình sản phẩm:", req.body.configurations);
  console.log("Thông số kỹ thuật:", req.body.parameters);
  console.log("File image:", req.file);

  const { name_group_product, content, id_category_product, id_category_brand } = req.body;
  const configurations = JSON.parse(req.body.configurations);
  const parameters = JSON.parse(req.body.parameters);

  const image = req.file?.filename || null;

  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'ttsshop'
  });

  try {
    console.log("Bắt đầu giao dịch...");
    await connection.beginTransaction();

    // 1. Thêm vào bảng group product
    const [groupResult] = await connection.execute(
      `INSERT INTO tbl_group_product (name_group_product, content, image, id_category_product, id_category_brand) 
       VALUES (?, ?, ?, ?, ?)`,
      [name_group_product, content, image, id_category_product, id_category_brand]
    );
    const id_group_product = groupResult.insertId;
    console.log("Thêm group product thành công, ID:", id_group_product);

    // 2. Duyệt qua từng cấu hình để thêm vào product
    for (const config of configurations) {
      const { ram, rom, color, quantity, price } = config;

      // Kiểm tra tham số để tránh undefined
      if (ram !== undefined && rom !== undefined && color !== undefined && quantity !== undefined && price !== undefined) {
        // Thêm vào bảng tbl_product
        await connection.execute(
          `INSERT INTO tbl_product (id_group_product, id_ram, id_rom, id_color, quantity, price) 
           VALUES (?, ?, ?, ?, ?, ?)`,
          [id_group_product, ram, rom, color, quantity, price]
        );
      } else {
        throw new Error("Một hoặc nhiều tham số cấu hình không hợp lệ.");
      }
    }

    // 3. Thêm thông số kỹ thuật vào bảng tbl_parameter
    for (const param of parameters) {
      const { attribute, value } = param;

      // Thêm vào bảng tbl_parameter
      await connection.execute(
        `INSERT INTO tbl_parameter (id_group_product, attribute, value) 
         VALUES (?, ?, ?)`,
        [id_group_product, attribute, value]
      );
    }

    await connection.commit();
    console.log("Giao dịch thành công!");
    res.status(201).json({ message: "Thêm sản phẩm thành công!" });

  } catch (err) {
    await connection.rollback();
    console.error("Lỗi khi thêm sản phẩm:", err);
    res.status(500).json({ error: "Lỗi khi thêm sản phẩm!" });

  } finally {
    await connection.end();
    console.log("Kết thúc kết nối với database.");
  }
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  console.log("ID sản phẩm cần cập nhật:", id);
  console.log("Dữ liệu nhận được từ client:", req.body);
  console.log("File image:", req.file);

  const {
    name_group_product,
    content,
    id_category_product,
    id_category_brand,
    configurations,
    parameters
  } = req.body;

  const parsedConfigurations = JSON.parse(configurations);
  const parsedParameters = JSON.parse(parameters);

  const image = req.file?.filename || null;

  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'ttsshop'
  });

  try {
    await connection.beginTransaction();

    // 1. Cập nhật bảng group product
    let updateGroupQuery = `
      UPDATE tbl_group_product
      SET name_group_product = ?, content = ?, id_category_product = ?, id_category_brand = ?
      ${image ? ', image = ?' : ''}
      WHERE id_group_product = ?
    `;

    const updateGroupParams = image
      ? [name_group_product, content, id_category_product, id_category_brand, image, id]
      : [name_group_product, content, id_category_product, id_category_brand, id];

    await connection.execute(updateGroupQuery, updateGroupParams);

    // 2. Xóa cấu hình cũ
    await connection.execute('DELETE FROM tbl_product WHERE id_group_product = ?', [id]);

    // 3. Thêm lại cấu hình mới
    for (const config of parsedConfigurations) {
      const { ram, rom, color, quantity, price } = config;
      if (ram !== undefined && rom !== undefined && color !== undefined && quantity !== undefined && price !== undefined) {
        await connection.execute(
          `INSERT INTO tbl_product (id_group_product, id_ram, id_rom, id_color, quantity, price)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [id, ram, rom, color, quantity, price]
        );
      } else {
        throw new Error("Một hoặc nhiều tham số cấu hình không hợp lệ.");
      }
    }

    // 4. Xóa thông số kỹ thuật cũ
    await connection.execute('DELETE FROM tbl_parameter WHERE id_group_product = ?', [id]);

    // 5. Thêm lại thông số kỹ thuật mới
    for (const param of parsedParameters) {
      const { attribute, value } = param;
      await connection.execute(
        `INSERT INTO tbl_parameter (id_group_product, attribute, value)
         VALUES (?, ?, ?)`,
        [id, attribute, value]
      );
    }

    await connection.commit();
    res.status(200).json({ message: "Cập nhật sản phẩm thành công!" });
  } catch (err) {
    await connection.rollback();
    console.error("Lỗi khi cập nhật sản phẩm:", err);
    res.status(500).json({ error: "Lỗi khi cập nhật sản phẩm!" });
  } finally {
    await connection.end();
  }
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
  updateProduct
};
