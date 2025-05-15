const express = require('express');
const cors = require('cors');
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;

const bodyParser = require("body-parser");


// Chen hinh
app.use('/images', express.static(path.join(__dirname, 'images')));


//admin
const dashboardRoutes = require('./admin/routes/dashboardRoutes');
const orderRoutes = require('./admin/routes/orderRoutes');
const groupProductRoutes = require('./admin/routes/groupProductRoutes');
const cagpostRoutes = require('./admin/routes/cagpostRoutes');
const cagbrandRoutes = require('./admin/routes/cagbrandRoutes');
const cagproductRoutes = require('./admin/routes/cagproductRoutes');
const bannerRoutes = require('./admin/routes/bannerRoutes');
const postRoutes = require('./admin/routes/postRoutes');
const footerRoutes = require('./admin/routes/footerRoutes');

//customer
const HProductRoute = require('./customer/Routes/Home.routes')
const searchRoutes = require("./customer/Routes/search.routes");
const MenuBar = require("./customer/Routes/MenuBar.route")
const otpRoutes = require('./customer/Routes/Otp.route');
const groupProductRoute = require("./customer/Routes/ProductDetail.routes");
const user = require('./customer/Routes/user.route');
const cartRoutes = require('./customer/Routes/Cart.route');
const payRoutes = require('./customer/Routes/Pay.route');
const cartPageRoute = require('./customer/Routes/CartPage.route');
const MyAccount = require("./customer/Routes/MyAccout.route");
const accountRoutes = require("./customer/Routes/ChangePassword.route"); 
const uploadAccountRoutes = require('./customer/Routes/UploadAcc.route');
const catalognewsRoutes = require('./customer/Routes/catalognews.route');
const catalogproduct   = require('./customer/Routes/CatalogProduct.route');
const postdetail = require('./customer/Routes/PostDetail.route')
const paymentInfoRoutes = require('./customer/Routes/CartInfo.route');
const order = require('./customer/Routes/Order.route');
const bill = require('./customer/Routes/BillDetail.route')
const resetPasswordRoute = require('./customer/Routes/Newpassword.route');
const chatRoutes = require('./customer/Routes/chat.route');
const footer = require('./customer/Routes/Footer.route')


app.use('/api/dashboards', dashboardRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/products', groupProductRoutes);
app.use('/api/cagposts', cagpostRoutes);
app.use('/api/cagbrands', cagbrandRoutes);
app.use('/api/cagproducts', cagproductRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/footers', footerRoutes);

//customer
app.use('/api/Home',HProductRoute)
app.use("/api/SearchProduct",searchRoutes );
app.use('/api/category',MenuBar)
app.use('/api/otp', otpRoutes);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api/group-route", groupProductRoute);
app.use('/api/users', user);
app.use('/api/cart', cartRoutes);
app.use('/api/pay', payRoutes);
app.use('/api/cartpage', cartPageRoute);
app.use("/api/account", MyAccount);
app.use("/api/change-password", accountRoutes);
app.use("/api/upload-account", uploadAccountRoutes);
app.use('/api/catalognews', catalognewsRoutes);
app.use('/api/catalogproduct', catalogproduct);
app.use('/api/',postdetail)
app.use('/api/payment', paymentInfoRoutes);
app.use('/api/orders', order);
app.use('/api/bill-detail', bill); 
app.use(resetPasswordRoute);
app.use('/api/chat', chatRoutes);
app.use('/footer', footer);

// ======= Khởi động server =======
app.listen(PORT, () => {
  console.log(`✅ Server đang chạy tại http://localhost:${PORT}`);
});
