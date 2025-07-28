
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider,AuthContext } from "../customer/context/AuthContext"; 

import Sidebar from "./components/Sidebar";
import Dashboard from './pages/Dashboard';
import Order from './pages/Order';
import DetailOrder from './pages/DetailOrder';
import Banner from './pages/Banner';
import GroupProduct from './pages/GroupProduct';
import GroupProductDetail from './pages/GroupProductDetail';
import ProductCategory from './pages/ProductCategory';
import BrandCategory from './pages/BrandCategory';
import Post from './pages/Post';
import PostCategory from './pages/PostCategory';
import StaffAccount from './pages/StaffAccount';
import CustomerAccount from './pages/CustomerAccount';
import AddProduct from './pages/AddProduct';
import EditProduct from "./pages/EditProduct";
import AddProductCategory from "./pages/AddProductCategory";
import EditProductCategory from "./pages/EditProductCategory";
import AddBrandCategory from "./pages/AddBrandCategory";
import EditBrandCategory from "./pages/EditBrandCategory";
import AddPostCategory from "./pages/AddPostCategory";
import EditPostCategory from "./pages/EditPostCategory";
import AddBanner from "./pages/AddBanner";
import EditBanner from "./pages/EditBanner";
import AddPost from './pages/AddPost';
import EditPost from './pages/EditPost';
import Footer from "./pages/Footer";
import AdminAccount from './pages/Account'
import ChangePassword from './pages/AddminChangePW';
import AddStaffaccount from './pages/AddStaffaccount';
import EditStaffaccount from './pages/EditStaffaccount';
import ProductImagesPage from './pages/ProductImagesManager';
import PrintOrder from "./pages/PrintOrder";
import ReviewList from "./pages/ReviewList";
import CommentList from "./pages/CommentList";


function App() {
  return (
    <AuthProvider>
    <Router>
      <div className="d-flex">
        <Sidebar />

        <div
          className="flex-grow-1 p-4 bg-dark text-white"
          style={{ marginLeft: '16.6667%', minHeight: '100vh' }} // tương ứng col-2
        >
          <Routes>
            {/* <Route path="/" element={<Navigate to="/admin/dashboard" replace />} /> */}
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/order" element={<Order />} />
            <Route path="/admin/orders/:code" element={<DetailOrder />} />
            <Route path="/admin/banner" element={<Banner />} />
            <Route path="/admin/product" element={<GroupProduct />} />
            <Route path="/admin/product/:id" element={<GroupProductDetail />} /> {/* Route cho trang chi tiết sản phẩm */}
            <Route path="/admin/product/add" element={<AddProduct />} />
            <Route path="/admin/product/edit/:id" element={<EditProduct />} />
            <Route path="/admin/productcategory" element={<ProductCategory />} />
            <Route path="/admin/brandcategory" element={<BrandCategory />} />
            <Route path="/admin/post" element={<Post />} />
            <Route path="/admin/postcategory" element={<PostCategory />} />
            <Route path="/admin/staffaccount" element={<StaffAccount />} />
            <Route path="/admin/staffaccount/add" element={<AddStaffaccount />} />
            <Route path="/admin/staffaccount/edit/:id" element={<EditStaffaccount />} />
            <Route path="/admin/customeraccount" element={<CustomerAccount />} />
            <Route path="/admin/categories/add" element={<AddProductCategory />} />
            <Route path="/admin/categories/edit/:id" element={<EditProductCategory />} />
            <Route path="/admin/brands/add" element={<AddBrandCategory />} />
            <Route path="/admin/edit-brand/:id" element={<EditBrandCategory />} />
            <Route path="/admin/postcategory/add" element={<AddPostCategory />} />
            <Route path="/admin/postcategory/edit/:id" element={<EditPostCategory />} />
            <Route path="/admin/banner/add" element={<AddBanner />} />
            <Route path="/admin/staffaccount/add" element={<AddBanner />} />
            <Route path="/admin/banner/edit/:id" element={<EditBanner />} />
            <Route path="/admin/post/add" element={<AddPost />} />
            <Route path="/admin/post/edit/:id" element={<EditPost />} />
            <Route path="/admin/footer" element={<Footer />} />
            <Route path="/admin/Account" element={<AdminAccount />} />
            <Route path="/admin/AddminChangePW" element={<ChangePassword />} />
           <Route path="/admin/product/:id/images" element={<ProductImagesPage />} />
           <Route path="/admin/order/print/:code" element={<PrintOrder />} />
           <Route path="/admin/product/:id_group_product/reviews" element={<ReviewList />} />
           <Route path="/admin/product/:id_group_product/comments" element={<CommentList />} />

            {/* Route khác sau này */}
          </Routes>
        </div>

      </div>
    </Router></AuthProvider>
  );
}


export default App;
