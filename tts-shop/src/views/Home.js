import Navbar from "../component/NavBar";
import '../styles/home.scss';  // nếu file nằm trong src/styles/
import '../styles/ProductDetail.scss';
function Home() {
    return(
        <div>
      <Navbar />  {/* Header sẽ hiển thị trên đầu */}
      <main>
        <h2>Chào mừng đến với Shop Điện Thoại</h2>
        <p>Trang chủ hiển thị danh sách sản phẩm...</p>
      </main>
    </div>
    )
}
export default Home;