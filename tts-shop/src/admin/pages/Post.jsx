import React, { useEffect, useState } from "react";
import { Table, Button, Form, Row, Col, InputGroup } from "react-bootstrap";
import { Search} from "lucide-react";

const Post = () => {
  const [posts, setPosts] = useState([]);

  // Gọi API từ backend khi component mount
    useEffect(() => {
      fetch("http://localhost:5000/api/posts")
        .then((res) => res.json())
        .then((data) => setPosts(data))
        .catch((err) => console.error("Lỗi khi fetch sản phẩm:", err));
    }, []);

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
          <Button variant="primary">Thêm bài viết</Button>
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
            <th className="text-center align-middle">Tình trạng</th>
            <th className="text-center align-middle">Hành động</th>
          </tr>
        </thead>
        <tbody>
        {posts.length > 0 ? (
          posts.map((post, index) => (
            <tr key={post.id_baiviet}>
              <td className="text-center align-middle">{index + 1}</td>
              <td className="text-center align-middle">
              <img
                src={`http://localhost:5000/images/post/${post.hinhanh}`}
                alt={post.title}
                className="img-thumbnail"
                style={{
                    width: "150px",
                    height: "100px",
                }}
                />
              </td>
              <td className="text-center align-middle">{post.tieude}</td>
              <td className="text-center align-middle">{post.tacgia}</td>
              <td className="text-center align-middle">{post.tinhtrang}</td>
              <td className="text-center align-middle">
                <Button variant="warning" size="sm" className="me-2">
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
            <td colSpan="6" className="text-center">Đang tải sản phẩm...</td>
          </tr>
        )}
        </tbody>
      </Table>
    </div>
  );
};

export default Post;
