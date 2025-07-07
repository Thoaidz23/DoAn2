import React, { useState, useEffect } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const AddPost = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  // Lấy danh sách danh mục từ API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/cagposts");
        const result = await response.json();
        if (response.ok) {
          setCategories(result); // Giả sử response trả về một mảng các danh mục
        } else {
          setError("Không thể lấy danh mục bài viết.");
        }
      } catch (err) {
        setError("Lỗi khi tải danh mục bài viết.");
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("Tiêu đề không được để trống.");
      return;
    }

    if (!author.trim()) {
      setError("Tên tác giả không được để trống.");
      return;
    }

    if (!image) {
      setError("Vui lòng chọn ảnh cho bài viết.");
      return;
    }

    if (!category) {
      setError("Vui lòng chọn danh mục cho bài viết.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("author", author);
    formData.append("content", content);
    formData.append("date", new Date().toISOString()); // Thời gian hiện tại
    formData.append("image", image);
    formData.append("id_category_post", category);

    try {
      const response = await fetch("http://localhost:5000/api/posts", {
        method: "POST",
        body: formData,
      });

      const text = await response.text();  // Đọc phản hồi dưới dạng văn bản
      console.log(text);  // In ra phản hồi (có thể là HTML nếu gặp lỗi)

      try {
        const result = JSON.parse(text);  // Cố gắng chuyển sang JSON
        if (response.ok) {
          setSuccess(true);
          setError("");
          setTimeout(() => {
            navigate("/admin/post"); // Điều hướng tới danh sách bài viết sau khi thành công
          }, 1500);
        } else {
          setError(result.message || "Lỗi khi thêm bài viết.");
        }
      } catch (err) {
        setError("Phản hồi không phải dạng JSON: " + err.message);
      }
    } catch (err) {
      console.error("Error during fetch:", err);
      setError("Lỗi máy chủ: " + (err.message || "Không xác định"));
    }
  };

  return (
    <Card className="p-4 bg-dark text-white">
      <h3 className="mb-4">Thêm mới bài viết</h3>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">✅ Thêm bài viết thành công!</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Tiêu Đề</Form.Label>
          <Form.Control
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Nhập tiêu đề bài viết"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Tác giả</Form.Label>
          <Form.Control
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Nhập tên tác giả"
            required
          />
        </Form.Group>
{preview && (
  <div className="mb-3">
    <img
      src={preview}
      alt="Ảnh xem trước"
      style={{
        maxWidth: "100%",
        maxHeight: "300px",
        marginTop: "10px",
        borderRadius: "8px",
        border: "1px solid #ccc",
      }}
    />
  </div>
)}

        <Form.Group className="mb-3">
  <Form.Label>Ảnh bài viết</Form.Label>
  <Form.Control
    type="file"
    accept="image/*"
    onChange={(e) => {
      const file = e.target.files[0];
      setImage(file);

      if (file) {
        setPreview(URL.createObjectURL(file));
      } else {
        setPreview(null);
      }
    }}
    required
  />
</Form.Group>


        <Form.Group className="mb-3">
  <Form.Label>Nội dung</Form.Label>
  <div className="bg-white text-dark rounded">
    <CKEditor
      editor={ClassicEditor}
      data={content}
      onChange={(event, editor) => {
        const data = editor.getData();
        setContent(data);
      }}
    />
  </div>
</Form.Group>




        <Form.Group className="mb-3">
          <Form.Label>Danh mục</Form.Label>
          <Form.Control
            as="select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Chọn danh mục</option>
            {categories.map((cat) => (
              <option key={cat.id_category_post} value={cat.id_category_post}>
                {cat.name_category_post}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        <Button variant="primary" type="submit">
          Thêm bài viết
        </Button>
      </Form>
    </Card>
  );
};

export default AddPost;
