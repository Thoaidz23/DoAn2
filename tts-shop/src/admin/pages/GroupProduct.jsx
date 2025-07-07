import React, { useEffect, useState,useContext } from "react";
import { Table, Button, Form, Card, ButtonGroup } from "react-bootstrap";
import { Link } from "react-router-dom";


import { AuthContext } from "../../customer/context/AuthContext";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState(null);
const [brandFilter, setBrandFilter] = useState(null);



 

  const {user} = useContext(AuthContext)

  // Gọi API từ backend khi component mount
  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Lỗi khi fetch sản phẩm:", err));
  }, []);

  const filteredProducts = products.filter((product) =>
  product.name_group_product.toLowerCase().includes(searchTerm.toLowerCase()) &&
  (categoryFilter ? product.name_category_product === categoryFilter : true) &&
  (brandFilter ? product.name_category_brand === brandFilter : true)
);


const uniqueCategories = [...new Set(products.map(p => p.name_category_product))];
const uniqueBrands = [...new Set(products.map(p => p.name_category_brand))];

const countByCategory = (category) => {
  if (category === null) return products.length;
  return products.filter(p => p.name_category_product === category).length;
};

const countByBrand = (brand) => {
  if (brand === null) return products.length;
  return products.filter(p => p.name_category_brand === brand).length;
};

const handleToggleDelete = async (id_group_product, is_del) => {
  const confirmText = is_del === 1
    ? "Bạn có muốn khôi phục sản phẩm này không?"
    : "Bạn có chắc muốn xóa sản phẩm này không?";

  if (!window.confirm(confirmText)) return;

  try {
    const response = await fetch(`http://localhost:5000/api/products/update-isdel/${id_group_product}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ is_del: is_del === 1 ? 0 : 1 }),
    });

    if (response.ok) {
      setProducts(prev =>
        prev.map(p =>
          p.id_group_product === id_group_product ? { ...p, is_del: is_del === 1 ? 0 : 1 } : p
        )
      );
      alert(is_del === 1 ? "Khôi phục thành công!" : "Xóa thành công!");
    } else {
      alert("Thao tác thất bại!");
    }
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái is_del:", error);
    alert("Lỗi mạng hoặc server!");
  }
};



  return (
    <div>
      <h3 className="mb-4">Quản lý sản phẩm</h3>

      {/* Thống kê */}
      {/* Lọc theo danh mục sản phẩm */}
<div className="mb-4">
  <Card className="bg-dark text-white border-secondary">
    <Card.Body>
      <strong className="d-block mb-2">Lọc theo danh mục sản phẩm:</strong>
      <ButtonGroup className="flex-wrap">
        <Button
          variant={categoryFilter === null ? "primary" : "outline-light"}
          className="mb-2 me-2 d-flex align-items-center"
          onClick={() => setCategoryFilter(null)}
        >
          Tất cả
          <span className="badge bg-secondary ms-2" style={{ fontSize: '0.8rem' }}>
            {countByCategory(null)}
          </span>
        </Button>
        {uniqueCategories.map((cat, idx) => (
          <Button
            key={idx}
            variant={categoryFilter === cat ? "primary" : "outline-light"}
            className="mb-2 me-2 d-flex align-items-center"
            onClick={() => setCategoryFilter(cat)}
          >
            {cat}
            <span className="badge bg-secondary ms-2" style={{ fontSize: '0.8rem' }}>
              {countByCategory(cat)}
            </span>
          </Button>
        ))}
      </ButtonGroup>
    </Card.Body>
  </Card>
</div>

{/* Lọc theo danh mục thương hiệu */}
<div className="mb-4">
  <Card className="bg-dark text-white border-secondary">
    <Card.Body>
      <strong className="d-block mb-2">Lọc theo thương hiệu:</strong>
      <ButtonGroup className="flex-wrap">
        <Button
          variant={brandFilter === null ? "success" : "outline-light"}
          className="mb-2 me-2 d-flex align-items-center"
          onClick={() => setBrandFilter(null)}
        >
          Tất cả
          <span className="badge bg-secondary ms-2" style={{ fontSize: '0.8rem' }}>
            {countByBrand(null)}
          </span>
        </Button>
        {uniqueBrands.map((brand, idx) => (
          <Button
            key={idx}
            variant={brandFilter === brand ? "success" : "outline-light"}
            className="mb-2 me-2 d-flex align-items-center"
            onClick={() => setBrandFilter(brand)}
          >
            {brand}
            <span className="badge bg-secondary ms-2" style={{ fontSize: '0.8rem' }}>
              {countByBrand(brand)}
            </span>
          </Button>
        ))}
      </ButtonGroup>
    </Card.Body>
  </Card>
</div>


      {/* Tìm kiếm & Thêm sản phẩm */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Form className="d-flex w-50">
          <Form.Control
            type="text"
            placeholder="Tìm kiếm theo tên sản phẩm ..."
            className="me-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Form>
           {user.role === 1 ? (
                    <>
                      <Button as={Link} to="/admin/product/add" variant="success" className="mb-3">
                       Thêm sản phẩm
                      </Button></>
                  ):(<></>)}


        

      </div>

      {/* Bảng sản phẩm */}
      <Table striped bordered hover responsive variant="dark">
        <thead>
          <tr>
            <th className="text-center align-middle">STT</th>
            <th className="text-center align-middle">Hình ảnh</th>
            <th className="text-center align-middle">Tên sản phẩm</th>
            <th className="text-center align-middle">Danh mục</th>
            <th className="text-center align-middle">Thương hiệu</th>
            <th className="text-center align-middle">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.length > 0 ? (
  filteredProducts.map((product, index) => (
              <tr key={product.id_group_product}>
                <td className="text-center align-middle">{index + 1}</td>
                <td className="text-center align-middle">
                <img
                  src={`http://localhost:5000/images/product/${product.image}`}
                  alt={product.name_group_product}
                  className="img-thumbnail"
                  style={{ width: "150px", height: "150px" }}
                />

                </td>
                <td className="text-center align-middle">{product.name_group_product}</td>
                <td className="text-center align-middle">{product.name_category_product}</td>
                <td className="text-center align-middle">{product.name_category_brand}</td>
               
                 <td className="text-center align-middle">
  {user.role === 1 && (
    <>
      <Button
        as={Link}
        to={`/admin/product/edit/${product.id_group_product}`}
        variant="warning"
        size="sm"
        className="me-2"
      >
        Sửa
      </Button>

      {product.is_del === 1 ? (
        <Button
          variant="secondary"
          size="sm"
          onClick={() => handleToggleDelete(product.id_group_product, 1)}
        >
          Khôi phục
        </Button>
      ) : (
        <Button
          variant="danger"
          size="sm"
          onClick={() => handleToggleDelete(product.id_group_product, 0)}
        >
          Xóa
        </Button>
      )}
    </>
  )}
</td>


                  
                
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">Không có sản phẩm nào</td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default Product;