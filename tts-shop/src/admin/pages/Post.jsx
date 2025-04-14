import { useState } from "react";
import { Table, Button, Form, Row, Col, InputGroup } from "react-bootstrap";
import { Search} from "lucide-react";

const Post = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Dữ liệu bài viết mẫu
  const posts = [
    {
      id: 1,
      title: "Mời bạn xem bộ ảnh Đà Lạt - Phan Thiết: “Chuyến đi của thanh xuân” qua ống kính của Xiaomi 14",
      author: "Admin",
      date: "2025-04-10",
      image: "https://cdn-media.sforum.vn/storage/app/media/Nh%C3%A2n/Cover/B%E1%BB%99%20%E1%BA%A3nh%20ch%E1%BB%A5p%20Xiaomi%2014/Camera-Xaomi-14.jpg",
    },
    {
      id: 2,
      title: "Xu hướng công nghệ mới",
      author: "Nguyễn Văn A",
      date: "2025-04-08",
      image: "https://cdn-media.sforum.vn/storage/app/media/Nh%C3%A2n/Cover/B%E1%BB%99%20%E1%BA%A3nh%20ch%E1%BB%A5p%20Xiaomi%2014/Camera-Xaomi-14.jpg",
    },
    {
      id: 3,
      title: "Làm sao chọn laptop phù hợp?",
      author: "Trần Thị B",
      date: "2025-04-01",
      image: "https://cdn-media.sforum.vn/storage/app/media/Nh%C3%A2n/Cover/B%E1%BB%99%20%E1%BA%A3nh%20ch%E1%BB%A5p%20Xiaomi%2014/Camera-Xaomi-14.jpg",
    },
  ];

  // Lọc bài viết theo từ khóa tìm kiếm
  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
            <th>STT</th>
            <th>Hình ảnh</th>
            <th>Tiêu đề</th>
            <th>Tác giả</th>
            <th>Ngày đăng</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {filteredPosts.map((post, index) => (
            <tr key={post.id}>
              <td className="align-middle text-center">{index + 1}</td>
              <td className="text-center align-middle">
              <img
                src={post.image}
                alt={post.title}
                className="img-thumbnail"
                style={{
                    width: "150px",
                    height: "100px",
                }}
                />
              </td>
              <td className="align-middle">{post.title}</td>
              <td className="align-middle">{post.author}</td>
              <td className="align-middle">{post.date}</td>
              <td className="align-middle">
                <Button variant="warning" size="sm" className="me-2">
                  Sửa
                </Button>
                <Button variant="danger" size="sm">
                  Xóa
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Post;
