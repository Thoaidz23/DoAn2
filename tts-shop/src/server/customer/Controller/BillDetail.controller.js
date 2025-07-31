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
    SELECT d.*, gp.name_group_product, gp.image, p.price, p.id_group_product , ram.name_ram, rom.name_rom, c.name_color
    FROM tbl_order_detail d
    JOIN tbl_product p ON d.id_product = p.id_product
    JOIN tbl_group_product gp ON gp.id_group_product = p.id_group_product
    JOIN tbl_ram ram ON ram.id_ram = p.id_ram
    JOIN tbl_rom rom ON rom.id_rom = p.id_rom
    JOIN tbl_color c ON c.id_color = p.id_color
    WHERE d.code_order = ?
  `;

  const queryWarranties = `
    SELECT w.*, p.id_group_product
    FROM tbl_warranty_requests w
    JOIN tbl_product p ON w.id_product = p.id_product
    WHERE w.code_order = ?
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
          w => w.id_product === product.id_product
        );
      
        let warranty_status_text = 'Không có yêu cầu bảo hành';
      
        if (matchingWarranties.length > 0) {
          // Lấy bảo hành mới nhất (theo request_time hoặc id nếu cần)
          const latestWarranty = matchingWarranties.reduce((latest, current) => {
            return new Date(current.request_time) > new Date(latest.request_time) ? current : latest;
          });
        
          const completedCount = matchingWarranties.filter(w => w.status === 4).length;
        
          if (latestWarranty.status === 4) {
            warranty_status_text = `Đã bảo hành (${completedCount} lần)`;
          } else {
            warranty_status_text = warrantyMap[latestWarranty.status] || 'Không rõ';
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
