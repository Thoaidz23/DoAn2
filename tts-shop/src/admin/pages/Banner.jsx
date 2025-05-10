import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { Button } from "react-bootstrap";
import axios from 'axios';

const Banner = () => {
    const [banners, setBanners] = useState([]);

    // Gọi API từ backend khi component mount
      useEffect(() => {
        fetch("http://localhost:5000/api/banners")
          .then((res) => res.json())
          .then((data) => setBanners(data))
          .catch((err) => console.error("Lỗi khi fetch sản phẩm:", err));
      }, []);

      const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa banner này không?")) {
          try {
            await axios.delete(`http://localhost:5000/api/banners/${id}`);
            alert("Xóa banner thành công!");
            window.location.reload();
          } catch (err) {
            console.error("Lỗi khi xóa banner:", err);
            alert("Xóa không thành công");
          }
        }
      };

    return (
      <div>
        <h3 className="mb-4">Quản lý Banner</h3>
  
        <div className="mb-3 text-end" style={{ marginTop: "-8px" }}>
        <Button as={Link} to="/admin/banner/add" variant="primary" className="mb-3">
          Thêm banner
        </Button>
      </div>
  
        <div className="table-responsive">
          <table className="table table-bordered table-dark table-hover align-middle">
            <thead>
              <tr>
                <th scope="col" className="text-center align-middle">Ảnh</th>
                <th scope="col" className="text-center align-middle">Tên</th>
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
                  <td className="text-center align-middle">
                    <Link to={`/admin/banner/edit/${banner.id_banner}`}>
                      <button className="btn btn-sm btn-warning me-2">Sửa</button>
                    </Link>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(banner.id_banner)}
                    >
                      Xóa
                    </button>

                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">Danh sách banner trống</td>
              </tr>
            )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };
  
  export default Banner;
  