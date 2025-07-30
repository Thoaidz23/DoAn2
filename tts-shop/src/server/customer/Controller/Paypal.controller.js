const db = require("../../db");

const axios = require("axios");
require("dotenv").config();

const getAccessToken = async () => {
  const credentials = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`
  ).toString("base64");

  const res = await axios.post(
    `${process.env.PAYPAL_API}/v1/oauth2/token`,
    "grant_type=client_credentials",
    {
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  return res.data.access_token;
};

exports.refundPaypalPayment = async (req, res) => {
  const { capture_id, code_order } = req.body;

  console.log("🔁 Refund payload:", { capture_id, code_order });

  if (!capture_id || !code_order  ) {
    return res.status(400).json({ error: "Thiếu thông tin refund" });
  }

  if (!/^([A-Z0-9]{17})$/.test(capture_id)) {
    return res.status(400).json({ error: "capture_id không hợp lệ" });
  }

  try {
    const accessToken = await getAccessToken();
    console.log("🔑 Access Token:", accessToken); // chỉ bật khi test sandbox

    const refundRes = await axios.post(
      `${process.env.PAYPAL_API}/v2/payments/captures/${capture_id}/refund`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Refund response:", JSON.stringify(refundRes.data, null, 2));

     const updateQuery = `
      UPDATE tbl_payment_infor
      SET paystatus = 0
      WHERE code_order = ? 
    `;
    await db.promise().query(updateQuery, [code_order]);

    return res.status(200).json({
      message: "Refund successful",
      data: refundRes.data,
    });
  } catch (err) {
    const debugId = err.response?.data?.debug_id;
    console.error("❌ Refund PayPal error:", err.response?.data || err.message);
    if (debugId) {
      console.error("🔍 Debug ID:", debugId);
    }

    return res.status(500).json({
      error: "Refund failed",
      details: err.response?.data || err.message,
    });
  }
};
