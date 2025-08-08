const connection = require('../../db');
const { refundMomoSandbox } = require('./Momo.controller');
const { refundPaypalPayment } = require('./Paypal.controller');
const Cancel = async (req, res) => {
  const { code_order } = req.params;

  try {
    // 1. Lấy thông tin thanh toán và trạng thái đơn
    const [paymentRows] = await connection.promise().query(
      `SELECT p.paystatus, p.method, p.capture_id, o.status
      FROM tbl_payment_infor p 
      JOIN tbl_order o ON o.code_order = p.code_order
      WHERE p.code_order = ?`,
      [code_order]
    );
    console.log(paymentRows)
    if (paymentRows.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy đơn hàng thanh toán' });
    }

    const { paystatus, method, capture_id, status } = paymentRows[0];

    // 2. Kiểm tra trạng thái đơn: nếu status = 0 hoặc 1 thì không cho hủy
    if (status !== 0 || status !== 1) {
      return res.status(400).json({ message: 'Đơn hàng không được phép hủy vì trạng thái hiện tại không phù hợp.' });
    }

    // 3. Lấy số tiền hoàn
    const [orderRows] = await connection.promise().query(
      `SELECT total_price FROM tbl_order WHERE code_order = ?`,
      [code_order]
    );
    const amount = orderRows[0]?.total_price || 0;

    // 4. Nếu đã thanh toán, hoàn tiền trước
    if (paystatus === 1) {
      if (method === 1) {
        // MoMo refund
        const requestId = `${code_order}_refund_${Date.now()}`;
        const result = await new Promise((resolve) => {
          const fakeRes = {
            status: (code) => ({ json: (obj) => resolve({ code, ...obj }) }),
            json: (obj) => resolve({ code: 200, ...obj }),
          };
          req.body = { orderId: code_order, requestId, amount, transId: capture_id };
          refundMomoSandbox(req, fakeRes);
        });
        if (result.code !== 200) {
          return res.status(result.code).json({ message: 'Hoàn tiền MoMo thất bại', detail: result });
        }
      }

      if (method === 3) {
        // PayPal refund
        const result = await new Promise((resolve) => {
          const fakeRes = {
            status: (code) => ({ json: (obj) => resolve({ code, ...obj }) }),
            json: (obj) => resolve({ code: 200, ...obj }),
          };
          req.body = { code_order, capture_id, amount };
          refundPaypalPayment(req, fakeRes);
        });
        if (result.code !== 200) {
          return res.status(result.code).json({ message: 'Hoàn tiền PayPal thất bại', detail: result });
        }
      }
    }

    // 5. Cập nhật trạng thái đơn hàng thành hủy (4)
    await connection.promise().query(
      `UPDATE tbl_order SET status = 4 WHERE code_order = ?`,
      [code_order]
    );

    return res.json({ message: 'Hủy đơn hàng và hoàn tiền (nếu có) thành công' });

  } catch (err) {
    console.error("❌ Lỗi hủy đơn hàng:", err);
    return res.status(500).json({ message: 'Lỗi máy chủ khi xử lý hủy đơn hàng' });
  }
};


module.exports = { Cancel };
