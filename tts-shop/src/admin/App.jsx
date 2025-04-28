import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import '../admin/index.css';
import Sidebar from "./components/Sidebar";
import Dashboard from './pages/Dashboard';
import Order from './pages/Order';
import Banner from './pages/Banner';
import Product from './pages/Product';
import ProductDetail from './pages/ProductDetail';  // Thêm import cho ProductDetail
import ProductCategory from './pages/ProductCategory';
import BrandCategory from './pages/BrandCategory';
import Post from './pages/Post';
import PostCategory from './pages/PostCategory';
import StaffAccount from './pages/StaffAccount';
import CustomerAccount from './pages/CustomerAccount';
import AddProduct from './pages/AddProduct';
import EditProduct from "./pages/EditProduct";


function App() {
  return (
    <Router>
      <div className="d-flex">
        <Sidebar />

        <div
          className="flex-grow-1 p-4 bg-dark text-white"
          style={{ marginLeft: '16.6667%', minHeight: '100vh' }} // tương ứng col-2
        >
          <Routes>
            <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/order" element={<Order />} />
            <Route path="/admin/banner" element={<Banner />} />
            <Route path="/admin/product" element={<Product />} />
            <Route path="/admin/product/:id" element={<ProductDetail />} /> {/* Route cho trang chi tiết sản phẩm */}
            <Route path="/admin/product/add" element={<AddProduct />} />
            <Route path="/admin/product/edit/:id" element={<EditProduct />} />
            <Route path="/admin/productcategory" element={<ProductCategory />} />
            <Route path="/admin/brandcategory" element={<BrandCategory />} />
            <Route path="/admin/post" element={<Post />} />
            <Route path="/admin/postcategory" element={<PostCategory />} />
            <Route path="/admin/staffaccount" element={<StaffAccount />} />
            <Route path="/admin/customeraccount" element={<CustomerAccount />} />
            {/* Route khác sau này */}
          </Routes>
        </div>

      </div>
    </Router>
  );
}

export default App;
