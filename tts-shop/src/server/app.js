const express = require('express');
const cors = require('cors'); // Kết nối MySQL
const path = require("path");
const bodyParser = require("body-parser");
//admin
const orderRoutes = require('./admin/routes/orderRoutes'); // Import routes đơn hàng
const productRoutes = require('./admin/routes/productRoutes');
const cagpostRoutes = require('./admin/routes/cagpostRoutes');
const cagbrandRoutes = require('./admin/routes/cagbrandRoutes');
const cagproductRoutes = require('./admin/routes/cagproductRoutes');
const bannerRoutes = require('./admin/routes/bannerRoutes');
const postRoutes = require('./admin/routes/postRoutes');
//customer
const HProductRoute = require('./customer/Routes/Home.routes')
const searchRoutes = require("./customer/Routes/search.routes");
const MenuBar = require("./customer/Routes/MenuBar.route")
// const otpRoutes = require('./customer/Routes/Otp.route');
const groupProductRoute = require("./customer/Routes/ProductDetail.routes");
const user = require('./customer/Routes/user.route');
const cartRoutes = require('./customer/Routes/Cart.route');
const cartPageRoute = require('./customer/Routes/CartPage.route');


const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;

// Chen hinh
app.use('/images', express.static(path.join(__dirname, 'images')));

// admin
app.use('/api/orders', orderRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cagposts', cagpostRoutes);
app.use('/api/cagbrands', cagbrandRoutes);
app.use('/api/cagproducts', cagproductRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/posts', postRoutes);
//customer
app.use('/api/Home',HProductRoute)
app.use("/api/SearchProduct",searchRoutes );
app.use('/api/category',MenuBar)
// app.use('/api/otp', otpRoutes);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api/group-route", groupProductRoute);
app.use('/api/users', user);
app.use('/api/cart', cartRoutes);
app.use('/api/cartpage', cartPageRoute);
// Server lắng nghe
app.listen(PORT, () => {
  console.log(`✅ Server đang chạy tại http://localhost:${PORT}`);
});

