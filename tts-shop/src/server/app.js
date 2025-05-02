const express = require('express');
const cors = require('cors'); // Kết nối MySQL
const path = require("path");
const orderRoutes = require('./admin/routes/orderRoutes'); // Import routes đơn hàng
const groupProductRoutes = require('./admin/routes/groupProductRoutes');
const cagpostRoutes = require('./admin/routes/cagpostRoutes');
const cagbrandRoutes = require('./admin/routes/cagbrandRoutes');
const cagproductRoutes = require('./admin/routes/cagproductRoutes');
const bannerRoutes = require('./admin/routes/bannerRoutes');
const postRoutes = require('./admin/routes/postRoutes');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;

// Chen hinh
app.use('/images', express.static(path.join(__dirname, 'images')));

// Sử dụng các route
app.use('/api/orders', orderRoutes);
app.use('/api/products', groupProductRoutes);
app.use('/api/cagposts', cagpostRoutes);
app.use('/api/cagbrands', cagbrandRoutes);
app.use('/api/cagproducts', cagproductRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/posts', postRoutes);

// Server lắng nghe
app.listen(PORT, () => {
  console.log(`✅ Server đang chạy tại http://localhost:${PORT}`);
});
