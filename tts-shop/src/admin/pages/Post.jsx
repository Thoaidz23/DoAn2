import React, { useEffect, useState } from "react";
import { Table, Button, Form, Row, Col, InputGroup } from "react-bootstrap";
import { Search} from "lucide-react";
import { Link } from 'react-router-dom';
import axios from 'axios';

const Post = () => {
  const [posts, setPosts] = useState([]);

  // Gọi API từ backend khi component mount
    useEffect(() => {
      fetch("http://localhost:5000/api/posts")
        .then((res) => res.json())
        .then((data) => setPosts(data))
        .catch((err) => console.error("Lỗi khi fetch sản phẩm:", err));
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa banner này không?")) {
          try {
            await axios.delete(`http://localhost:5000/api/posts/${id}`);
            alert("Xóa bài viết thành công!");
            window.location.reload();
          } catch (err) {
            console.error("Lỗi khi xóa bài viết:", err);
            alert("Xóa không thành công");
          }
        }
      };

  return (
    <div>
      {/* Thanh tìm kiếm + Nút thêm */}
      <Row className="mb-4 mt-3">
        <Col md={6}>
          <InputGroup>
            <InputGroup.Text>
              <Search size={18} />
            </InputGroup.Text>
            <Form.Control
              placeholder="Tìm kiếm bài viết..."
            />
          </InputGroup>
        </Col>
        <Col md={6} className="text-end">
        <Button as={Link} to="/admin/post/add" variant="primary" className="mt-4 mb-3">
          Thêm bài viết
        </Button>
        </Col>
      </Row>

      {/* Bảng bài viết */}
      <Table striped bordered hover responsive variant="dark">
        <thead>
          <tr>
            <th className="text-center align-middle">STT</th>
            <th className="text-center align-middle">Hình ảnh</th>
            <th className="text-center align-middle">Tiêu đề</th>
            <th className="text-center align-middle">Tác giả</th>
            <th className="text-center align-middle">Danh mục</th>
            <th className="text-center align-middle">Hành động</th>
          </tr>
        </thead>
        <tbody>
        {posts.length > 0 ? (
          posts.map((post, index) => (
            <tr key={post.id_post}>
              <td className="text-center align-middle">{index + 1}</td>
              <td className="text-center align-middle">
              <img
                src={`http://localhost:5000/images/post/${post.image}`}
                alt={post.title}
                className="img-thumbnail"
                style={{
                    width: "150px",
                    height: "100px",
                }}
                />
              </td>
              <td className="text-center align-middle">{post.title}</td>
              <td className="text-center align-middle">{post.author}</td>
              <td className="text-center align-middle">{post.name_category_post}</td>
              <td className="text-center align-middle">
                <Link to={`/admin/post/edit/${post.id_post}`}>
                <Button variant="warning" size="sm" className="me-2">Sửa</Button>
              </Link>
                <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(post.id_post)}
                    >
                      Xóa
                    </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="6" className="text-center">Không có bài viết nào</td>
          </tr>
        )}
        </tbody>
      </Table>
    </div>
  );
};

export default Post;
