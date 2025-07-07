const pool = require('../../db');
const nodemailer = require("nodemailer"); 

const generateCodeOrder = () => {
  const letters = Array.from({ length: 4 }, () =>
    String.fromCharCode(65 + Math.floor(Math.random() * 26))
  ).join('');
  const numbers = Math.floor(1000 + Math.random() * 9000);
  return letters + numbers;
};

const addToPay = (req, res) => {
  const { id_user, products, name_user, address, phone, method, code_order: reqCodeOrder,email ,name_group_product, paystatus = 0 } = req.body;

  if (!id_user || !products || products.length === 0 || !name_user || !address || !phone) {
    return res.status(400).json({ message: 'Thiếu thông tin' });
  }

  const code_order = reqCodeOrder || generateCodeOrder(); 
  const total_price = products.reduce((sum, item) => sum + item.price * item.quantity, 0);

  pool.getConnection((err, conn) => {
    if (err) {
      console.error('Lỗi lấy kết nối từ pool:', err);
      return res.status(500).json({ message: 'Lỗi kết nối database' });
    }

    conn.beginTransaction(err => {
      if (err) {
        conn.release();
        console.error('Lỗi bắt đầu transaction:', err);
        return res.status(500).json({ message: 'Lỗi transaction' });
      }

      const insertOrderQuery = `
        INSERT INTO tbl_order (id_user, code_order, status, total_price, name_user, address, phone, date, paystatus, method)
        VALUES (?, ?, 0, ?, ?, ?, ?, NOW(), ?, ?)
      `;

      conn.query(insertOrderQuery, [id_user, code_order, total_price, name_user, address, phone,  paystatus, method], (err1, result1) => {
        if (err1) {
          return conn.rollback(() => {
            conn.release();
            console.error('Lỗi thêm đơn hàng:', err1);
            res.status(500).json({ message: 'Lỗi thêm đơn hàng' });
          });
        }

        const deleteCartQuery = `DELETE FROM tbl_cart WHERE id_user = ?`;
        conn.query(deleteCartQuery, [id_user], (errDel) => {
          if (errDel) {
            return conn.rollback(() => {
              conn.release();
              console.error('Lỗi xoá giỏ hàng:', errDel);
              res.status(500).json({ message: 'Lỗi xoá giỏ hàng' });
            });
          }

          const insertDetailQuery = `
            INSERT INTO tbl_order_detail (code_order, id_product, quantity_product)
            VALUES ?
          `;
          const detailValues = products.map(item => [code_order, item.id_product, item.quantity]);

          conn.query(insertDetailQuery, [detailValues], (err2) => {
            if (err2) {
              return conn.rollback(() => {
                conn.release();
                console.error('Lỗi chi tiết đơn hàng:', err2);
                res.status(500).json({ message: 'Lỗi chi tiết đơn hàng' });
              });
            }

            conn.commit(errCommit => {
              if (errCommit) {
                return conn.rollback(() => {
                  conn.release();
                  console.error('Lỗi commit:', errCommit);
                  res.status(500).json({ message: 'Lỗi commit' });
                });
              }

              conn.release();
              res.status(201).json({ message: 'Đặt hàng thành công', code_order });
                // Gửi email xác nhận sau khi đơn hàng được lưu vào DB
              sendOrderConfirmationEmail(email, code_order, products, total_price,name_group_product);
            });
          });
        });
      });
    });
  });
};

const path = require('path');

const sendOrderConfirmationEmail = async (email, orderCode, items, totalAmount) => {
  if (!email) {
    throw new Error('Không có email người nhận.');
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'truongthuong1512@gmail.com',
      pass: 'lljvbafslfcjbltv',
    },
  });

  const attachments = items.map((item, index) => ({
    filename: item.image,
    path: path.resolve(__dirname, '..', '..', 'images', 'product', item.image),
    cid: `product${index}` // cid để dùng trong HTML
  }));

  const itemListHtml = items
  .map((item, index) => `
    <li style="display: flex; align-items: center; margin-bottom: 8px; width:100%">
      <img src="cid:product${index}" style="width: 100px; height: auto; vertical-align: middle; margin-right: 10px;" />
      <div style="flex-grow: 1; text-align: right; right:0">
        <div>${item.name_group_product}</div>
        <div>SL: ${item.quantity}</div>
        <div>Giá: ${item.price.toLocaleString()}đ</div>
      </div>
    </li>

  `)
  .join('');


  const mailOptions = {
    from: 'truongthuong1512@gmail.com',
    to: email,
    subject: 'Xác nhận đơn hàng từ hệ thống',
    html: `
      <h3>Đơn hàng của bạn đã được đặt thành công ở TTSshop</h3>
      <p><strong>Mã đơn hàng:</strong> ${orderCode}</p>
      <ul style="list-style-type: none; padding: 0; margin: 0; width:400px">${itemListHtml}</ul>
      <p><strong>Tổng tiền:</strong> ${totalAmount.toLocaleString()}đ</p>
      <p>Cảm ơn bạn đã mua hàng!</p>
    `,
    attachments: attachments
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error('❌ Lỗi khi gửi email:', err);
    throw new Error('Không thể gửi email xác nhận.');
  }
};



module.exports = { addToPay ,sendOrderConfirmationEmail};
