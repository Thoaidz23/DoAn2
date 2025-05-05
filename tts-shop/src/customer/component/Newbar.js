import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import "../styles/index.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "../styles/newbar.scss";
import 'bootstrap-icons/font/bootstrap-icons.css'; // Để dùng icon tác giả & thời gian

function Newbar() {
  const [newsList, setNewsList] = useState([]);
  
  useEffect(() => {
    axios.get('http://localhost:5000/api/catalognews/all') // Đảm bảo URL chính xác
      .then(response => {
        setNewsList(response.data); // Set dữ liệu từ API vào state
      })
      .catch(error => {
        console.error("Lỗi khi lấy dữ liệu bài viết:", error);
      });
  }, []);

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


  // Phân loại bài viết theo id_category_post
  const groupByCategory = (posts) => {
    return posts.reduce((acc, post) => {
      const categoryId = post.id_category_post;
      if (!acc[categoryId]) {
        acc[categoryId] = [];
      }
      acc[categoryId].push(post);
      return acc;
      
    }, {});
  };



  // Render bài viết theo từng danh mục
  const renderNewBarItems = (categoryId, title) => {
    const posts = groupByCategory(newsList)[categoryId] || [];

    return (
      <div className="mb-5">
        <div className="content-title-newbar mt-4 d-flex justify-content-between align-items-center">
          <h2>{title}</h2>
          <Link to={`/catalogproduct/${categoryId}`} className="see-all-newbar">Xem tất cả</Link>
        </div>

        <div className="news-wrapper">
          <div className="container">
            <div className="row gx-2 gy-3">
              {posts.map((item) => (
                <div className="col-md-3" key={item.id_post}>
                  <Link to={`/postdetail/${item.id_post}`}>
                  <div className="card h-100 shadow-sm">
                    <div className="position-relative">
                      <img
                        src={`http://localhost:5000/images/product/${item.image}`} // Đảm bảo rằng API trả về hình ảnh đúng
                        className="card-img-top rounded"
                        alt={item.title}
                        style={{ width: '100%', height: '180px', objectFit: 'cover' }}
                      />
                    </div>
                    <div className="card-body p-2 pb-0">
                      <h6 className="card-title fw-bold">{item.title}</h6>
                      <div className="text-muted small d-flex flex-wrap align-items-center mt-3 ">
                        <div className="me-5 " >
                          <i className="bi bi-person-circle me-1"></i>
                          <span className="me-5">{item.author}</span>
                        </div>
                        
                        <div>
                          <i className="bi bi-clock me-1 "></i>
                          <span>{formatDate(item.date)}</span>
                        </div>
                        
                      </div>
                    </div>
                  </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Lấy tất cả các danh mục duy nhất
  const categories = [...new Set(newsList.map(item => item.id_category_post))];

  return (
    <div className="container">
      {categories.map((categoryId) => {
        const category = newsList.find(item => item.id_category_post === categoryId);
        const categoryTitle = category ? category.name_category_post : 'Danh mục không xác định';
        
        return (
          <div key={categoryId} className="mb-4">  {/* Thêm class mb-4 để tạo khoảng cách giữa các mục */}
            {renderNewBarItems(categoryId, categoryTitle)}
          </div>
        );
      })}
    </div>
  );
  
}

export default Newbar;
