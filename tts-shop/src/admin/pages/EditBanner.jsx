import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const EditBanner = () => {
  const { id } = useParams(); // Lấy id banner từ URL
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [newImage, setNewImage] = useState(null);

  useEffect(() => {
    // Lấy dữ liệu banner theo id
    axios.get(`http://localhost:5000/api/banners`)
      .then((res) => {
        const banner = res.data.find(item => item.id_banner === parseInt(id));
        if (banner) {
          setName(banner.name);
          setImagePreview(`http://localhost:5000/images/banner/${banner.image}`);
        }
      })
      .catch((err) => {
        console.error("Lỗi khi lấy banner:", err);
      });
  }, [id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setNewImage(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) return alert("Tên không được để trống");

    const formData = new FormData();
    formData.append("name", name);
    if (newImage) {
      formData.append("image", newImage);
    }

    try {
      await axios.put(`http://localhost:5000/api/banners/${id}`, formData);
      alert("Cập nhật thành công");
      navigate("/admin/banner");
    } catch (error) {
      console.error("Lỗi khi cập nhật banner:", error);
      alert("Cập nhật thất bại");
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-4">Chỉnh sửa Banner</h3>
      <form onSubmit={handleSubmit} encType="multipart/form-data" style={{width:"100%", marginTop:"-250px"}}>
        <div className="mb-3">
          <label className="form-label">Tên banner</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Ảnh banner</label>
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

        <button type="submit" className="btn btn-primary">Lưu thay đổi</button>
      </form>
    </div>
  );
};

export default EditBanner;
