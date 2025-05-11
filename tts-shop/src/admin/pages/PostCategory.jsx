import React, { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const PostCategory = () => {
  const [cagposts, setCagposts] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Gọi API từ backend khi component mount
  useEffect(() => {
    fetch("http://localhost:5000/api/cagposts")
      .then((res) => res.json())
      .then((data) => setCagposts(data))
      .catch((err) => console.error("Lỗi khi fetch danh mục bài viết:", err));
  }, []);

  // Xóa danh mục
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa danh mục này?")) {
      try {
        const response = await fetch(`http://localhost:5000/api/cagposts/${id}`, {
          method: "DELETE",
        });

        const result = await response.json();

        if (response.ok) {
          setSuccess(true);
          // Cập nhật lại danh sách sản phẩm sau khi xóa
          setCagposts(cagposts.filter((cagpost) => cagpost.id_category_post !== id));
        } else {
          setError(result.message || "Lỗi khi xóa danh mục.");
        }
      } catch (err) {
        setError("Lỗi máy chủ.");
      }
    }
  };

  return (
    <div>
      {/* Nút thêm danh mục bài viết */}
      <Button as={Link} to="/admin/postcategory/add" variant="primary" className="mt-4 mb-3">
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
              <tr key={cagpost.id_category_post}>
                <td className="text-center align-middle">{index + 1}</td>
                <td className="text-center align-middle">{cagpost.name_category_post}</td>
                <td className="text-center align-middle">
                <Link to={`/admin/postcategory/edit/${cagpost.id_category_post}`}>
                  <Button variant="info" size="sm" className="me-2">
                    Sửa
                  </Button>
                </Link>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(cagpost.id_category_post)}>
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
