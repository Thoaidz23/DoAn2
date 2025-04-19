import React, { useEffect, useState } from "react";

const Banner = () => {
    const [banners, setBanners] = useState([]);

    // Gọi API từ backend khi component mount
      useEffect(() => {
        fetch("http://localhost:5000/api/banners")
          .then((res) => res.json())
          .then((data) => setBanners(data))
          .catch((err) => console.error("Lỗi khi fetch sản phẩm:", err));
      }, []);

    return (
      <div>
        <h3 className="mb-4">Quản lý Banner</h3>
  
        <div className="mb-3 text-end">
          <button className="btn btn-primary">
            <i className="bi bi-plus-lg"></i> Thêm banner
          </button>
        </div>
  
        <div className="table-responsive">
          <table className="table table-bordered table-dark table-hover align-middle">
            <thead>
              <tr>
                <th scope="col" className="text-center align-middle">Ảnh</th>
                <th scope="col" className="text-center align-middle">Tên</th>
                <th scope="col" className="text-center align-middle">Thứ tự</th>
                <th scope="col" className="text-center align-middle">Hành động</th>
              </tr>
            </thead>
            <tbody>
            {banners.length > 0 ? (
              banners.map((banner, index) => (
                <tr key={banner.id_banner}>
                  <td className="text-center align-middle">
                  <img
                    src={`http://localhost:5000/images/banner/${banner.image}`}
                    alt={banner.name}
                    style={{ width: "450px", height: "200px" }}
                    />
                  </td>
                  <td className="text-center align-middle">{banner.name}</td>
                  <td className="text-center align-middle">{banner.sort_order}</td>
                  <td className="text-center align-middle">
                    <button className="btn btn-sm btn-warning me-2">Sửa</button>
                    <button className="btn btn-sm btn-danger">Xóa</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">Đang tải sản phẩm...</td>
              </tr>
            )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };
  
  export default Banner;
  