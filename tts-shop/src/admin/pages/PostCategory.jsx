import React, { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";

const PostCategory = () => {
  const [cagposts, setCagposts] = useState([]);

  // Gọi API từ backend khi component mount
  useEffect(() => {
    fetch("http://localhost:5000/api/cagposts")
      .then((res) => res.json())
      .then((data) => setCagposts(data))
      .catch((err) => console.error("Lỗi khi fetch danh mục bài viết:", err));
  }, []);

  return (
    <div>
      {/* Nút thêm danh mục bài viết */}
      <Button variant="primary" className="mt-4 mb-3">
        Thêm danh mục bài viết
      </Button>

      {/* Bảng danh mục bài viết */}
      <Table striped bordered hover responsive variant="dark">
        <thead>
          <tr>
            <th className="text-center align-middle">STT</th>
            <th className="text-center align-middle">Tên danh mục bài viết</th>
            <th className="text-center align-middle">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {cagposts.length > 0 ? (
            cagposts.map((cagpost, index) => (
              <tr key={cagpost.id_dmbv}>
                <td className="text-center align-middle">{index + 1}</td>
                <td className="text-center align-middle">{cagpost.ten_dmbv}</td>
                <td className="text-center align-middle">
                  <Button variant="info" size="sm" className="me-2">
                    Sửa
                  </Button>
                  <Button variant="danger" size="sm">
                    Xóa
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center">
                Không có danh mục nào
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default PostCategory;
