const pool = require('../../db');
const nodemailer = require("nodemailer"); 

const generateCodeOrder = () => {
  const letters = Array.from({ length: 4 }, () =>
    String.fromCharCode(65 + Math.floor(Math.random() * 26))
  ).join('');
  const numbers = Math.floor(1000 + Math.random() * 9000);
  return letters + numbers;
};

// ✅ API tạo code_order không lưu DB
const generateOrderCode = (req, res) => {
  const { id_user } = req.body;
  if (!id_user) {
    return res.status(400).json({ message: 'Thiếu id_user' });
  }

  const code_order = generateCodeOrder();
  return res.status(200).json({ code_order });
};



const addToPayRaw = ({ id_user, products, name_user, address, phone, method, code_order, email, name_group_product, paystatus = 0 }) => {
  return new Promise((resolve, reject) => {
    const total_price = products.reduce((sum, item) => sum + item.price * item.quantity, 0);

    pool.getConnection((err, conn) => {
      if (err) return reject('Lỗi kết nối DB');

      conn.beginTransaction(err => {
        if (err) {
          conn.release();
          return reject('Lỗi transaction');
        }

        const insertOrderQuery = `
          INSERT INTO tbl_order (id_user, code_order, status, total_price, name_user, address, phone, date, paystatus, method)
          VALUES (?, ?, 0, ?, ?, ?, ?, NOW(), ?, ?)
        `;

        conn.query(insertOrderQuery, [id_user, code_order, total_price, name_user, address, phone, paystatus, method], (err1) => {
          if (err1) {
            return conn.rollback(() => {
              conn.release();
              console.error('Chi tiết lỗi SQL:', err1); // Thêm dòng này
              reject('Lỗi thêm đơn hàng');
            });
          }

          const deleteCartQuery = `DELETE FROM tbl_cart WHERE id_user = ?`;
          conn.query(deleteCartQuery, [id_user], (errDel) => {
            if (errDel) {
              return conn.rollback(() => {
                conn.release();
                reject('Lỗi xoá giỏ hàng');
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
                  reject('Lỗi chi tiết đơn hàng');
                });
              }

              conn.commit(errCommit => {
                if (errCommit) {
                  return conn.rollback(() => {
                    conn.release();
                    reject('Lỗi commit');
                  });
                }

                conn.release();
                sendOrderConfirmationEmail(email, code_order, products, total_price, name_group_product)
                  .then(() => resolve('Đặt hàng thành công'))
                  .catch((errMail) => resolve('Đặt hàng xong nhưng không gửi được email'));
              });
            });
          });
        });
      });
    });
  });
};

const addToPay = async (req, res) => {
  try {
    await addToPayRaw(req.body);
    return res.status(201).json({ message: 'Đặt hàng thành công' });
  } catch (err) {
    console.error('❌ Lỗi khi đặt hàng:', err);
    return res.status(500).json({ message: err });
  }
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



module.exports = { addToPay ,sendOrderConfirmationEmail,generateOrderCode,addToPayRaw};
