import React, { useState, useEffect } from "react";
import { Form, Button, Container } from "react-bootstrap";
import axios from "axios";

const AddPost = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]);

  // Lấy danh sách danh mục
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/cagposts")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Lỗi khi lấy danh mục:", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !author || !content || !category || !image) {
      alert("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("author", author);
    formData.append("content", content);
    formData.append("id_category_post", category);
    formData.append("image", image);

    try {
      await axios.post("http://localhost:5000/api/posts", formData);
      alert("Thêm bài viết thành công");
      // Reset form nếu muốn
      setTitle("");
      setAuthor("");
      setContent("");
      setCategory("");
      setImage(null);
    } catch (error) {
      console.error("Lỗi khi thêm bài viết:", error);
      alert("Thêm thất bại");
    }
  };

  return (
    <Container className="mt-4">
      <h3>Thêm bài viết mới</h3>
      <Form onSubmit={handleSubmit} encType="multipart/form-data">
        <Form.Group className="mb-3">
          <Form.Label>Tiêu đề</Form.Label>
          <Form.Control
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Nhập tiêu đề"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Tác giả</Form.Label>
          <Form.Control
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Nhập tên tác giả"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Nội dung</Form.Label>
          <Form.Control
            as="textarea"
            rows={5}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Nhập nội dung bài viết"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Danh mục</Form.Label>
          <Form.Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">-- Chọn danh mục --</option>
            {categories.map((cat) => (
              <option key={cat.id_category_post} value={cat.id_category_post}>
                {cat.name_category_post}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Ảnh bài viết</Form.Label>
          <Form.Control
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            accept="image/*"
          />
        </Form.Group>

        <Button variant="success" type="submit">
          Thêm bài viết
        </Button>
      </Form>
    </Container>
  );
};

export default AddPost;
