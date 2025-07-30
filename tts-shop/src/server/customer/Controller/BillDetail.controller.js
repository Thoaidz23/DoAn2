const connection = require('../../db');

const getOrderDetail = (req, res) => {
  const { code_order } = req.params;

 const queryOrder = `
  SELECT o.*, 
         pi.method, 
         pi.paystatus,
         pi.capture_id,
         DATE_FORMAT(o.date, '%d/%m/%Y') AS date_formatted,
         TIME_FORMAT(o.date, '%H giờ %i phút') AS time_formatted
  FROM tbl_order o
  JOIN tbl_payment_infor pi ON pi.code_order = o.code_order
  WHERE o.code_order = ?
`;


  const queryProducts = `
    SELECT d.*, gp.name_group_product, gp.image, p.price, p.id_group_product
    FROM tbl_order_detail d
    JOIN tbl_product p ON d.id_product = p.id_product
    JOIN tbl_group_product gp ON gp.id_group_product = p.id_group_product
    WHERE d.code_order = ?
  `;

  const queryWarranties = `
    SELECT * FROM tbl_warranty_requests
    WHERE code_order = ?
  `;

  connection.query(queryOrder, [code_order], (err, orderResults) => {
    if (err || orderResults.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    }

    const order = orderResults[0];

    connection.query(queryProducts, [code_order], (err2, productResults) => {
      if (err2) {
        return res.status(500).json({ message: 'Lỗi lấy sản phẩm đơn hàng' });
      }

      connection.query(queryWarranties, [code_order], (err3, warrantyResults) => {
        if (err3) {
          return res.status(500).json({ message: 'Lỗi lấy thông tin bảo hành' });
        }

        const statusMap = {
          0: 'Chờ xác nhận',
          1: 'Đã xác nhận',
          2: 'Đang vận chuyển',
          3: 'Đã giao hàng',
          4: 'Chờ hủy',
          5: 'Đã huỷ',
        };

        const warrantyMap = {
          0: 'Không duyệt bảo hành',
          1: 'Đang chờ duyệt',
          2: 'Đã duyệt bảo hành',
          3: 'Đang bảo hành',
          4: 'Đã bảo hành xong',
        };

        order.status_text = statusMap[order.status] || 'Không xác định';
        order.paystatus_text = order.paystatus === 1 ? 'Đã thanh toán' : 'Chưa thanh toán';

        const productsWithWarranty = productResults.map(product => {
          const matchingWarranties = warrantyResults.filter(
            w => w.id_group_product === product.id_group_product
          );

          let warranty_status_text = null;

          if (matchingWarranties.length === 1) {
            const status = matchingWarranties[0].status;
            warranty_status_text = warrantyMap[status] || 'Không rõ';
          } else if (matchingWarranties.length > 1) {
            const active = matchingWarranties.find(w => w.status !== 3);
            if (active) {
              warranty_status_text = warrantyMap[active.status] || 'Không rõ';
            } else {
              warranty_status_text = `Đã bảo hành (${matchingWarranties.length} lần)`;
            }
          }

          return {
            ...product,
            warranty_status_text,
          };
        });

        res.json({
          order,
          products: productsWithWarranty
        });
      });
    });
  });
};

module.exports = { getOrderDetail };
