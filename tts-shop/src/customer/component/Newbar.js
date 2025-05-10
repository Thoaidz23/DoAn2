import React from 'react';
import { Link } from 'react-router-dom';
import "../styles/index.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "../styles/newbar.scss";
import 'bootstrap-icons/font/bootstrap-icons.css'; // Để dùng icon tác giả & thời gian

function Newbar() {
  const newsList = [
    {
      id: 1,
      title: 'Rò rỉ cấu hình chi tiết Galaxy Z...',
      description: 'Đây là mô tả ngắn cho bài viết số 1.',
      image: 'https://cdn-media.sforum.vn/storage/app/media/thanhdat/2025/danh-gia-huawei-pura-x/danh-gia-huawei-pura-x-thumb.jpg',
      author: 'Giang Nguyễn',
      date: '30/04/2025 21:23',
    },
    {
      id: 2,
      title: 'Rò rỉ cấu hình chi tiết Galaxy Z...',
      description: 'Đây là mô tả ngắn cho bài viết số 2.',
      image: 'https://cdn-media.sforum.vn/storage/app/media/thanhdat/2025/danh-gia-huawei-pura-x/danh-gia-huawei-pura-x-thumb.jpg',
      author: 'Nguyễn Văn A',
      date: '01/05/2025 10:00',
    },
    {
      id: 3,
      title: 'Rò rỉ cấu hình chi tiết Galaxy Z...',
      description: 'Đây là mô tả ngắn cho bài viết số 3.',
      image: 'https://cdn-media.sforum.vn/storage/app/media/thanhdat/2025/danh-gia-huawei-pura-x/danh-gia-huawei-pura-x-thumb.jpg',
      author: 'Lê Thị B',
      date: '02/05/2025 08:30',
    },
    {
      id: 4,
      title: 'Rò rỉ cấu hình chi tiết Galaxy Z...',
      description: 'Đây là mô tả ngắn cho bài viết số 4.',
      image: 'https://cdn-media.sforum.vn/storage/app/media/thanhdat/2025/danh-gia-huawei-pura-x/danh-gia-huawei-pura-x-thumb.jpg',
      author: 'Trần Văn C',
      date: '03/05/2025 14:15',
    },
  ];

  const renderNewBarItems = (title) => (
    <>
      <div className="content-title-newbar mt-4 d-flex justify-content-between align-items-center">
        <h2>{title}</h2>
        <Link to="/Catalognews" className="see-all-newbar">Xem tất cả</Link>
      </div>

<<<<<<< HEAD
      <div className="news-wrapper">
        <div className="container">
          <div className="row gx-2 gy-3">
            {newsList.map((item) => (
              <div className="col-md-3" key={item.id}>
                <div className="card h-100 shadow-sm">
                  <div className="position-relative">
                    <img
                      src={item.image}
                      className="card-img-top rounded"
                      alt={item.title}
                      style={{ width: '100%', height: '180px', objectFit: 'cover' }}
                    />
                   
                  </div>
                  <div className="card-body p-2">
                    <h6 className="card-title fw-bold">{item.description}</h6>
                    <div className="text-muted small d-flex flex-wrap align-items-center mt-2">
                      <i className="bi bi-person-circle me-1"></i>
                      <span className="me-3">{item.author}</span>
                      <i className="bi bi-clock me-1"></i>
                      <span>{item.date}</span>
=======

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
                        src={`http://localhost:5000/images/post/${item.image}`} // Đảm bảo rằng API trả về hình ảnh đúng
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
>>>>>>> d796181d0ce5157210794b691833585f6e52a437
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="container">
      {renderNewBarItems("Bài viết")}
      {renderNewBarItems("Tin tức")}
      {renderNewBarItems("Game_S")}
    </div>
  );
}

export default Newbar;
