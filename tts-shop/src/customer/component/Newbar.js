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
