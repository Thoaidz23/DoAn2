import React, { useEffect } from 'react';
import Navbar from "../component/NavBar";
import "../styles/catalognews.scss";
import Footer from '../component/Footer';

function Catalognews () {

  useEffect(() => {
    const categoryLinks = document.querySelectorAll('.category-link');

    categoryLinks.forEach(link => {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        categoryLinks.forEach(link => link.classList.remove('active'));
        this.classList.add('active');
      });
    });

    return () => {
      categoryLinks.forEach(link => {
        link.removeEventListener('click', () => {});
      });
    };
  }, []);

  return (
    <div>
      <Navbar/>
      <div className="Catalognews_container">
        <div className="container">
          <h2>BÀI VIẾT NỔI BẬT</h2>
        </div>
      </div>

      <div className="content-catalognews">
        <div className="container">
          <div className="left-news">
            <img src="https://cdn-media.sforum.vn/storage/app/media/thongvo/tren-tay-macbook-air-m4/tren-tay-macbook-air-m4-13-inch-cover.jpg" alt="MacBook Air M4" />
            <div className="overlay-text">
              <h3>Trên tay MacBook Air M4 13 inch: Màu Sky Blue tươi mới, chip M4 mạnh mẽ, Desk View độc đáo, giá chỉ 26.9 triệu!</h3>
              <p>Trên tay MacBook Air M4 13 inch, mẫu laptop bán chạy số 1 mới của Apple được nâng cấp phần cứng lên Apple M4 mạnh mẽ...</p>
              <div className="meta">
                <span className="author">👤 Thông Võ</span>
                <span className="time">🕒 12/04/2025 11:19</span>
              </div>
            </div>
          </div>

          <div className="right-news">
            <div className="small-news">
              <img src="https://cdn-media.sforum.vn/storage/app/media/chibao/chi-bao-2025/Apple/iPad-Gen-11/tren-tay-ipad-gen-11-cover-1.jpg" alt="iPad Gen 11" />
              <div>
                <h4>Trên tay Apple iPad Gen 11: Bình cũ nhưng "rượu mạnh" với chip mới, giá chỉ 9.99 triệu</h4>
                <div className="meta">
                  <span>👤 Chí Bảo</span>
                  <span>🕒 11/04/2025 14:01</span>
                </div>
              </div>
            </div>

            <div className="small-news">
              <img src="https://cdn-media.sforum.vn/storage/app/media/chibao/chi-bao-2025/Apple/iPad-Gen-11/tren-tay-ipad-gen-11-cover-1.jpg" alt="iPad M3" />
              <div>
                <h4>Trên tay iPad Air M3 chính hãng: Thiết kế không đổi, hiệu năng siêu mạnh, giá từ 16.99 triệu</h4>
                <div className="meta">
                  <span>👤 Tiz</span>
                  <span>🕒 11/04/2025 09:55</span>
                </div>
              </div>
            </div>

            <div className="small-news">
              <img src="https://cdn-media.sforum.vn/storage/app/media/chibao/chi-bao-2025/Apple/iPad-Gen-11/tren-tay-ipad-gen-11-cover-1.jpg" alt="Camon 40" />
              <div>
                <h4>Tecno Camon 40 và 40 Pro ra mắt tại VN: Thiết kế siêu mỏng, camera Sony cực chất, giá từ 5.19 triệu đồng</h4>
                <div className="meta">
                  <span>👤 Hải Nam</span>
                  <span>🕒 10/04/2025 16:44</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-allnews">
        <div className="container">
          <h2>TẤT CẢ BÀI VIẾT</h2>
          <div className="category_news">
            <div className="container">
              <a href="#" className="category-link active">Sản phẩm mới</a>
              <a href="#" className="category-link">Đánh giá</a>
              <a href="#" className="category-link">Mẹo hay</a>
              <a href="#" className="category-link">Tư vấn</a>
            </div>
          </div>

          <div className="content-allnews">
            <div className="container">
              <div className="news-item">
                <img src="https://cdn-media.sforum.vn/storage/app/media/trannghia/trannghia/Galaxy-Z-Fold7-One-UI-8.jpg" alt="OnePlus 13T" />
                <div className="news-info">
                  <h3>OnePlus 13T gây ấn tượng với tỷ lệ phân bố trọng lượng hoàn hảo 50:50</h3>
                  <p>Điện thoại OnePlus 13T sắp ra mắt dự kiến sẽ có thiết kế cực kỳ cao cấp và tỷ lệ phân bố trọng lượng hoàn hảo...</p>
                  <div className="meta">
                    <span className="author">👤 Hải Nam</span>
                    <span className="time">🕒 12/04/2025 22:00</span>
                  </div>
                </div>
              </div>

              <div className="news-item">
                <img src="http://localhost/tts/admin/quanlybaiviet/uploads/1735194641_cau-hinh-spark-30-pro-cove.jpg" alt="Galaxy Z Fold7" />
                <div className="news-info">
                  <h3>Galaxy Z Fold7 được thử nghiệm trên Geekbench với One UI 8, chip Snapdragon 8 Elite for Galaxy</h3>
                  <p>Các điện thoại màn hình gập tiếp theo của Samsung dự kiến sẽ được cài sẵn giao diện người dùng One UI thế hệ tiếp theo...</p>
                  <div className="meta">
                    <span className="author">👤 Hải Nam</span>
                    <span className="time">🕒 12/04/2025 21:30</span>
                  </div>
                </div>
              </div>

              <div className="news-item">
                <img src="http://localhost/tts/admin/quanlybaiviet/uploads/1735194641_cau-hinh-spark-30-pro-cove.jpg" alt="Nordy AI" />
                <div className="news-info">
                  <h3>Phục chế hình cũ bằng Nordy AI: Hồi sinh ký ức chỉ trong vài phút</h3>
                  <p>Phục chế hình cũ bằng Nordy AI đang trở thành giải pháp được nhiều người lựa chọn để tái hiện những bức ảnh cũ kỹ, mờ nhòe...</p>
                  <div className="meta">
                    <span className="author">👤 Như Ý</span>
                    <span className="time">🕒 12/04/2025 17:04</span>
                  </div>
                </div>
              </div>

              <div className="news-item">
                <img src="http://localhost/tts/admin/quanlybaiviet/uploads/1735194641_cau-hinh-spark-30-pro-cove.jpg" alt="Nordy AI" />
                <div className="news-info">
                  <h3>Phục chế hình cũ bằng Nordy AI: Hồi sinh ký ức chỉ trong vài phút</h3>
                  <p>Phục chế hình cũ bằng Nordy AI đang trở thành giải pháp được nhiều người lựa chọn để tái hiện những bức ảnh cũ kỹ, mờ nhòe...</p>
                  <div className="meta">
                    <span className="author">👤 Như Ý</span>
                    <span className="time">🕒 12/04/2025 17:04</span>
                  </div>
                </div>
              </div>
            </div>  
          </div>
        </div>

      </div>
    </div>
  );
}

export default Catalognews;
