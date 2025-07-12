const connection = require('../../db');

const getOrderDetail = (req, res) => {
  const { code_order } = req.params;
  const queryOrder = `
    SELECT o.*, DATE_FORMAT(o.date, '%d/%m/%Y') as date_formatted,
           TIME_FORMAT(o.date, '%H giờ %i phút') as time_formatted
    FROM tbl_order o
    WHERE o.code_order = ?
  `;
  const queryProducts = `
    SELECT d.*, gp.name_group_product, gp.image, p.price, p.id_group_product  
    FROM tbl_order_detail d
    JOIN tbl_product p ON d.id_product = p.id_product
    JOIN tbl_group_product gp ON gp.id_group_product = p.id_group_product
    WHERE d.code_order =  ?
  `;

  connection.query(queryOrder, [code_order], (err, orderResults) => {
    if (err || orderResults.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    }

    connection.query(queryProducts, [code_order], (err2, productResults) => {
      if (err2) {
        return res.status(500).json({ message: 'Lỗi lấy sản phẩm đơn hàng' });
      }

      const order = orderResults[0];
      // Mapping trạng thái đơn hàng
      const statusMap = {
        0: 'Chờ xác nhận',
        1: 'Đã xác nhận',
        2: 'Đang vận chuyển',
        3: 'Đã giao hàng',
        4: 'Chờ hủy',
        5: 'Đã huỷ',
      };

      order.status_text = statusMap[order.status] || 'Không xác định';
      order.paystatus_text = order.paystatus === 1 ? 'Đã thanh toán' : 'Chưa thanh toán';

      res.json({
        order,
        products: productResults
      });
    });
  });
};

module.exports = { getOrderDetail };
