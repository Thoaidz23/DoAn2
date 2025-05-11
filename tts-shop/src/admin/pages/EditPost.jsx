import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [imagePreview, setImagePreview] = useState("");
  const [newImage, setNewImage] = useState(null);

  // Lấy danh sách danh mục
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/cagposts");
        setCategories(res.data);
      } catch (err) {
        console.error("Lỗi khi lấy danh mục:", err);
      }
    };
    fetchCategories();
  }, []);

  // Lấy chi tiết bài viết theo ID
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/posts/${id}`);
        const post = res.data;
        setTitle(post.title || "");
        setAuthor(post.author || "");
        setContent(post.content || "");
        setCategory(String(post.id_category_post) || "");
        if (post.image) {
          setImagePreview(`http://localhost:5000/images/post/${post.image}`);
        }
      } catch (err) {
        console.error("Lỗi khi lấy bài viết:", err);
        alert("Không tìm thấy bài viết");
        navigate("/admin/post");
      }
    };
    fetchPost();
  }, [id, navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setNewImage(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !author || !content || !category) {
      return alert("Vui lòng điền đầy đủ thông tin");
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("author", author);
    formData.append("content", content);
    formData.append("id_category_post", category);
    if (newImage) {
      formData.append("image", newImage);
    }

    try {
      await axios.put(`http://localhost:5000/api/posts/${id}`, formData);
      alert("Cập nhật bài viết thành công");
      navigate("/admin/post");
    } catch (error) {
      console.error("Lỗi khi cập nhật bài viết:", error);
      alert("Cập nhật thất bại");
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-4">Chỉnh sửa Bài viết</h3>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-3">
          <label className="form-label">Tiêu đề</label>
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Tác giả</label>
          <input
            type="text"
            className="form-control"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Ảnh bài viết</label>
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={handleImageChange}
          />
          {imagePreview && (
            <div className="mt-2">
              <img
                src={imagePreview}
                alt="Preview"
                style={{ width: "300px", height: "auto", border: "1px solid #ccc" }}
              />
            </div>
          )}
        </div>

        <div className="mb-3">
  <label className="form-label">Nội dung</label>
  <div className="bg-white text-dark rounded p-2">
    <CKEditor
      editor={ClassicEditor}
      data={content}
      onChange={(event, editor) => {
        const data = editor.getData();
        setContent(data);
      }}
    />
  </div>
</div>


        <div className="mb-3">
          <label className="form-label">Danh mục</label>
          <select
            className="form-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">-- Chọn danh mục --</option>
            {categories.map((cat) => (
              <option key={cat.id_category_post} value={cat.id_category_post}>
                {cat.name_category_post}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="btn btn-primary">Lưu thay đổi</button>
      </form>
    </div>
  );
};

export default EditPost;
