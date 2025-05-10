import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import "../styles/catalognews.scss";
import Newbar from "../component/Newbar.js";

function Catalognews() {
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
      categoryLinks.forEach(link => link.removeEventListener('click', () => {}));
    };
  }, []);

  return (
    <div>
      <div className="Catalognews_container">
        <div className="container">
          <h2>BÀI VIẾT NỔI BẬT</h2>
        </div>
      </div>

      <div className="content-catalognews">
        <div className="container">
<<<<<<< HEAD
          <div className="left-news">
            <Link to="/PostDetail">
              <img
                src="https://cdn-media.sforum.vn/storage/app/media/thongvo/tren-tay-macbook-air-m4/tren-tay-macbook-air-m4-13-inch-cover.jpg"
                alt="MacBook Air M4"
              />
              <div className="overlay-text">
                <h3>Trên tay MacBook Air M4 13 inch: Màu Sky Blue tươi mới, chip M4 mạnh mẽ, Desk View độc đáo, giá chỉ 26.9 triệu!</h3>
                <p>Trên tay MacBook Air M4 13 inch, mẫu laptop bán chạy số 1 mới của Apple được nâng cấp phần cứng lên Apple M4 mạnh mẽ...</p>
                <div className="meta">
                  <span className="author">👤 Thông Võ</span>
                  <span className="time">🕒 12/04/2025 11:19</span>
=======
          {featuredPost && (
            <div className="left-news">
              <Link to={`/postdetail/${featuredPost.id_post}`}>
                <img src={`http://localhost:5000/images/post/${featuredPost.image}`} alt={featuredPost.title} />
                <div className="overlay-text">
                  <h3>{featuredPost.title}</h3>
                  <p>{featuredPost.desc_post}</p>
                  <div className="meta">
                    <span className="author">👤 {featuredPost.author}</span>
                    <span className="time">🕒 {formatDate(featuredPost.date)}</span>
                  </div>
                </div>
              </Link>
            </div>
          )}

          <div className="right-news">
            {otherPosts.map(post => (
              <div className="small-news" key={post.id_post}>
                <Link to={`/PostDetail/${post.id_post}`}>
                  <img src={`http://localhost:5000/images/post/${post.image}`} alt={post.title} />
                </Link>
                <div className='postcontent'>
                  <Link to={`/PostDetail/${post.id_post}`}>
                    <h4>{post.title}</h4>
                  </Link>
                  <div className="meta">
                    <span>👤 {post.author}</span>
                    <span>🕒 {formatDate(post.date)}</span>
                  </div>
>>>>>>> d796181d0ce5157210794b691833585f6e52a437
                </div>
              </div>
            </Link>
          </div>

          <div className="right-news">
            <div className="small-news">
              <Link to="/PostDetail">
                <img src="https://cdn-media.sforum.vn/storage/app/media/chibao/chi-bao-2025/Apple/iPad-Gen-11/tren-tay-ipad-gen-11-cover-1.jpg" alt="iPad Gen 11" />
              </Link>
              <div>
                <Link to="/PostDetail">
                  <h4>Trên tay Apple iPad Gen 11: Bình cũ nhưng "rượu mạnh" với chip mới, giá chỉ 9.99 triệu</h4>
                </Link>
                <div className="meta">
                  <span>👤 Chí Bảo</span>
                  <span>🕒 11/04/2025 14:01</span>
                </div>
              </div>
            </div>

            <div className="small-news">
              <Link to="PostDetail">
                <img src="https://cdn-media.sforum.vn/storage/app/media/chibao/chi-bao-2025/Apple/iPad-Gen-11/tren-tay-ipad-gen-11-cover-1.jpg" alt="iPad M3" />
              </Link>
              <div>
                <Link to="/PostDetail">
                  <h4>Trên tay iPad Air M3 chính hãng: Thiết kế không đổi, hiệu năng siêu mạnh, giá từ 16.99 triệu</h4>
                </Link>
                <div className="meta">
                  <span>👤 Tiz</span>
                  <span>🕒 11/04/2025 09:55</span>
                </div>
              </div>
            </div>

            <div className="small-news">
              <Link to="/PostDetail">
                <img src="https://cdn-media.sforum.vn/storage/app/media/chibao/chi-bao-2025/Apple/iPad-Gen-11/tren-tay-ipad-gen-11-cover-1.jpg" alt="Camon 40" />
              </Link>
              <div>
                <Link to="/PostDetail">
                  <h4>Tecno Camon 40 và 40 Pro ra mắt tại VN: Thiết kế siêu mỏng, camera Sony cực chất, giá từ 5.19 triệu đồng</h4>
                </Link>
                <div className="meta">
                  <span>👤 Hải Nam</span>
                  <span>🕒 10/04/2025 16:44</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='container-allnews'>
        <Newbar></Newbar>
      </div>
    </div>
  );
}

export default Catalognews;
