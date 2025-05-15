import React, { useEffect, useState } from "react";
import { Table, Button, Form, InputGroup } from "react-bootstrap";
import { Search} from "lucide-react";
import { Link } from 'react-router-dom';
import axios from 'axios';

const Post = () => {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

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

      const filteredPosts = posts.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.author.toLowerCase().includes(searchTerm.toLowerCase())
      );



  return (
      <div>
        <h4 className="m-0">Quản lý bài viết</h4>
        <div className="d-flex justify-content-between align-items-center my-3 flex-wrap gap-2">
        {/* Thanh tìm kiếm bên trái */}
        <InputGroup style={{ maxWidth: "500px" }}>
          <InputGroup.Text>
            <Search size={18} />
          </InputGroup.Text>
          <Form.Control
            placeholder="Tìm kiếm theo tiêu đề và tác giả ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

        </InputGroup>

        {/* Nút thêm bên phải */}
        <Button as={Link} to="/admin/post/add" variant="primary">
          Thêm bài viết
        </Button>
    </div>

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
  {filteredPosts.length > 0 ? (
    filteredPosts.map((post, index) => (
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
        <td className="text-center align-middle" style={{ width: "340px" }}>{post.title}</td>
        <td className="text-center align-middle">{post.author}</td>
        <td className="text-center align-middle" style={{ width: "140px" }}>{post.name_category_post}</td>
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
