const https = require('https');
const crypto = require('crypto');
const { addToPayRaw } = require('./Pay.controller');

const partnerCode = 'MOMO';
const accessKey = 'F8BBA842ECF85';
const secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
const redirectUrl = 'http://localhost:3000/PurchaseHistory'; // hoặc domain thật
const ipnUrl = 'https://074fb63d4cbc.ngrok-free.app/api/momo/ipn';
const requestType = 'payWithMethod';

// ✅ Tạo URL thanh toán MoMo
const createMomoPaymentUrl = async (req, res) => {
  try {
    const { code_order, amount, orderInfo, userData, paymentCode } = req.body;
    console.log("✅ Nhận req tạo đơn MoMo:", req.body);
    const orderId = code_order;
    const requestId = orderId;
    const autoCapture = true;
    const orderGroupId = '';
    const lang = 'vi';
    const extraData = Buffer.from(JSON.stringify(userData)).toString('base64');

    const rawSignature =
      `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}` +
      `&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}` +
      `&requestId=${requestId}&requestType=${requestType}`;

    const signature = crypto.createHmac('sha256', secretKey).update(rawSignature).digest('hex');

    const requestBody = JSON.stringify({
      partnerCode,
      partnerName: 'TTSShop',
      storeId: 'TTSStore',
      requestId,
      amount: String(amount),
      orderId,
      orderInfo,
      redirectUrl,
      ipnUrl,
      lang,
      requestType,
      autoCapture,
      extraData,
      orderGroupId,
      signature,
      paymentCode // Mã QR hoặc mã ví MoMo người dùng
    });

    const options = {
      hostname: 'test-payment.momo.vn',
      port: 443,
      path: '/v2/gateway/api/create',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(requestBody),
      },
    };

    const momoReq = https.request(options, momoRes => {
      let data = '';
      momoRes.on('data', chunk => {
        data += chunk;
      });
      momoRes.on('end', () => {
        const response = JSON.parse(data);console.log("📥 Phản hồi từ MoMo:", response); 
        if (response.resultCode === 0) {
          return res.json({ payUrl: response.payUrl, deeplink: response.deeplink, qrCodeUrl: response.qrCodeUrl });
        } else {
          return res.status(400).json({ message: 'Tạo đơn thanh toán thất bại', response });
        }
      });
    });

    momoReq.on('error', error => {
      console.error('❌ Lỗi kết nối MoMo:', error);
      return res.status(500).json({ message: 'Lỗi gửi yêu cầu tới MoMo' });
    });

    momoReq.write(requestBody);
    momoReq.end();
  } catch (err) {
    console.error('❌ Lỗi khi tạo thanh toán MoMo:', err);
    return res.status(500).json({ message: 'Lỗi tạo thanh toán MoMo' });
  }
};

// ✅ Xử lý IPN từ MoMo
const handleMomoIPN = async (req, res) => {
  console.log("📩 ĐÃ NHẬN IPN MoMo");
  try {
    const { resultCode, orderId, extraData } = req.body;
    console.log("📨 MoMo IPN trả về:", req.body);

    if (resultCode === 0) {
      const userData = JSON.parse(Buffer.from(extraData, 'base64').toString('utf8'));
      const payload = {
        ...userData,
        code_order: orderId,
        paystatus: 1,
        address: userData.address || 'Không có địa chỉ',
        phone: userData.phone || 'Không có số điện thoại',
      };
      
      console.log("📦 Payload IPN MoMo:", payload);
      await addToPayRaw(payload);
      console.log("✅ Đã lưu đơn hàng MoMo thành công!");

      return res.status(200).json({ message: 'IPN xử lý thành công' });
    } else {
      console.warn("❌ MoMo IPN thất bại, không xử lý đơn:", resultCode);
      return res.status(400).json({ message: 'Thanh toán thất bại hoặc bị từ chối' });
    }
  } catch (err) {
    console.error('❌ Lỗi xử lý IPN:', err);
    return res.status(500).json({ message: 'Lỗi xử lý IPN MoMo' });
  }
};


module.exports = {
  createMomoPaymentUrl,
  handleMomoIPN,
};
