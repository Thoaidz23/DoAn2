  const db = require("../../db");

  const searchProducts = async (req, res) => {
    try {
      let { brand, category, search, specs, price } = req.query;

      let query = `
        SELECT g.*, p.price - ((p.price/100) * g.sale) AS saleprice, p.price,
              cp.name_category_product, cb.name_category_brand
        FROM tbl_group_product g
        JOIN tbl_product p ON p.id_group_product = g.id_group_product
        LEFT JOIN tbl_category_product cp ON cp.id_category_product = g.id_category_product
        LEFT JOIN tbl_category_brand cb ON cb.id_category_brand = g.id_category_brand
      `;

      const where = ["g.is_del = 0"];
      const params = [];

      // --- 0. Price filter ---
      if (price) {
        const [min, max] = price.split("-").map(p => p ? Number(p) : null);
        if (min !== null) { where.push("p.price >= ?"); params.push(min); }
        if (max !== null) { where.push("p.price <= ?"); params.push(max); }
      }

      // --- 1. Specs parsing ---
      if (specs) {
        const specMap = {};
        specs.split(",").forEach(pair => {
          const [attr, value] = pair.split(":").map(s => s.trim());
          if (attr && value) specMap[attr] = value;
        });

        if (specMap["RAM"]) {
          query += " LEFT JOIN tbl_ram r ON r.id_ram = p.id_ram";
          where.push("LOWER(r.name_ram) LIKE LOWER(?)");
          params.push(`%${specMap["RAM"]}%`);
        }
        if (specMap["ROM"] || specMap["Bộ nhớ trong"]) {
          query += " LEFT JOIN tbl_rom ro ON ro.id_rom = p.id_rom";
          where.push("LOWER(ro.name_rom) LIKE LOWER(?)");
          params.push(`%${specMap["ROM"] || specMap["Bộ nhớ trong"]}%`);
        }
        if (specMap["Màu sắc"]) {
          query += " LEFT JOIN tbl_color c ON c.id_color = p.id_color";
          where.push("LOWER(c.name_color) LIKE LOWER(?)");
          params.push(`%${specMap["Màu sắc"]}%`);
        }

        Object.entries(specMap).forEach(([attr, value]) => {
          if (!["RAM","ROM","Bộ nhớ trong","Màu sắc","Keyword"].includes(attr)) {
            where.push(`
              EXISTS (
                SELECT 1 FROM tbl_parameter tp
                WHERE tp.id_group_product = g.id_group_product
                  AND LOWER(tp.attribute) = LOWER(?)
                  AND LOWER(tp.value) LIKE LOWER(?)
              )
            `);
            params.push(attr, `%${value}%`);
          }
        });

        // --- Keyword tự động map sang category hoặc brand ---
        if (specMap["Keyword"]) {
          const kw = specMap["Keyword"].trim().toLowerCase();
          console.log(kw)
          // 1. Danh mục
          const [cat] = await db.promise().query(
            "SELECT id_category_product FROM tbl_category_product WHERE LOWER(name_category_product) LIKE ?",
            [`%${kw}%`]
          );
          if (cat.length > 0) category = cat[0].id_category_product;
          else {
            // 2. Thương hiệu
            const [brandResult] = await db.promise().query(
              "SELECT id_category_brand FROM tbl_category_brand WHERE LOWER(name_category_brand) LIKE ?",
              [`%${kw}%`]
            );
            if (brandResult.length > 0) brand = brandResult[0].id_category_brand;
            else {
              // 3. Tìm theo tên sản phẩm
              where.push("LOWER(g.name_group_product) LIKE LOWER(?)");
              params.push(`%${kw}%`);
            }
          }
        }
      }

      // --- 2. Search / brand / category id riêng ---
      if (search) {
        where.push("LOWER(g.name_group_product) LIKE LOWER(?)");
        params.push(`%${search}%`);
      }
      if (brand) {
        where.push("g.id_category_brand = ?");
        params.push(brand);
      }
      if (category) {
        where.push("g.id_category_product = ?");
        params.push(category);
      }

      if (where.length) query += " WHERE " + where.join(" AND ");
      query += " GROUP BY g.id_group_product";

      const [products] = await db.promise().query(query, params);
      res.json(products);

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Lỗi máy chủ" });
    }
  };

  module.exports = { searchProducts };
