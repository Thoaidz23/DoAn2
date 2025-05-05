const express = require('express');
const cors = require('cors');
const path = require("path");

const app = express();
const PORT = 5000;

// ===== Middleware cơ bản =====
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Thay bodyParser

// Cấu hình Express để phục vụ ảnh từ thư mục src/server/images/banner
app.use('/images/banner', express.static(path.join(__dirname, 'images', 'banner')));
app.use('/images/post', express.static(path.join(__dirname, 'images', 'post')));

// ======= Route Admin =======
const orderRoutes = require('./admin/routes/orderRoutes');
const groupProductRoutes = require('./admin/routes/groupProductRoutes');
const cagpostRoutes = require('./admin/routes/cagpostRoutes');
const cagbrandRoutes = require('./admin/routes/cagbrandRoutes');
const cagproductRoutes = require('./admin/routes/cagproductRoutes');
const bannerRoutes = require('./admin/routes/bannerRoutes');
const postRoutes = require('./admin/routes/postRoutes');

app.use('/api/orders', orderRoutes);
app.use('/api/products', groupProductRoutes);
app.use('/api/cagposts', cagpostRoutes);
app.use('/api/cagbrands', cagbrandRoutes);
app.use('/api/cagproducts', cagproductRoutes);
app.use('/api/banners', bannerRoutes);  // ✅ Đảm bảo đúng path
app.use('/api/posts', postRoutes);

// ======= Route Customer =======
const HProductRoute = require('./customer/Routes/Home.routes');
const searchRoutes = require("./customer/Routes/search.routes");
const MenuBar = require("./customer/Routes/MenuBar.route");
const groupProductRoute = require("./customer/Routes/ProductDetail.routes");
const user = require('./customer/Routes/user.route');
const cartRoutes = require('./customer/Routes/Cart.route');
const cartPageRoute = require('./customer/Routes/CartPage.route');

app.use('/api/Home', HProductRoute);
app.use("/api/SearchProduct", searchRoutes);
app.use('/api/category', MenuBar);
app.use("/api/group-route", groupProductRoute);
app.use('/api/users', user);
app.use('/api/cart', cartRoutes);
app.use('/api/cartpage', cartPageRoute);

// ======= Khởi động server =======
app.listen(PORT, () => {
  console.log(`✅ Server đang chạy tại http://localhost:${PORT}`);
});
