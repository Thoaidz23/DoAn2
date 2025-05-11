import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom'; // 👈 import useParams
import axios from 'axios';
import "../styles/catalogProduct.scss";

function CatalogProduct() {
  const { id_category } = useParams(); // 👈 Lấy category từ URL
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (id_category) {
      axios.get(`http://localhost:5000/api/catalogproduct/${id_category}`)
        .then(response => {
          if (response.data.success) {
            setPosts(response.data.data);
          } else {
            setPosts([]);
          }
        })
        .catch(error => {
          console.error("Lỗi khi lấy dữ liệu bài viết:", error);
          setPosts([]);
        });
    }
  }, [id_category]);
    // Hàm chuyển ISO string sang định dạng giờ Việt Nam
    const formatDate = (isoDateStr) => {
      const date = new Date(isoDateStr);
      const vnTime = new Date(date.getTime()); // Cộng 7 tiếng
    
      const day = vnTime.getDate().toString().padStart(2, '0');
      const month = (vnTime.getMonth() + 1).toString().padStart(2, '0');
      const year = vnTime.getFullYear();
      const hours = vnTime.getHours().toString().padStart(2, '0');
      const minutes = vnTime.getMinutes().toString().padStart(2, '0');
    
      return `${day}/${month}/${year} ${hours}:${minutes}`;
    };

  return (
    <div className="container-allProduct">
      <div className="container">
      <h2>{posts.length > 0 ? posts[0].name_category_post : 'Danh mục'}</h2>
        <div className="content-allProduct">
          <div className="container">
            {posts.length > 0 ? (
              posts.map(post => (
                <div className="catalogProduct-item" key={post.id_post}>
                <Link to={`/postdetail/${post.id_post}`}>
                    <img src={`http://localhost:5000/images/post/${post.image}`} alt={post.title} />
                  </Link>
                  <div className="Product-info">
                  <Link to={`/postdetail/${post.id_post}`}>
                      <h3>{post.title}</h3>
                    </Link>
                    <div className="meta">
                      <span className="author">👤 {post.author}</span>
                      <span className="time">🕒 {formatDate(post.date)}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>Không có bài viết nào trong danh mục này.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CatalogProduct;