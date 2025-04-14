import { Table, Button } from "react-bootstrap";

const ProductCategory = () => {
  // Dữ liệu tĩnh về các danh mục sản phẩm
  const categories = [
    { id: 1, name: "Điện thoại", productCount: 20 },
    { id: 2, name: "Laptop", productCount: 15 },
    { id: 3, name: "Máy tính bảng", productCount: 10 },
    { id: 4, name: "Phụ kiện", productCount: 30 },
  ];


  return (
    <div>
      

      {/* Nút thêm danh mục */}
      <Button variant="primary" className="mt-4 mb-3">
        Thêm danh mục
      </Button>

      {/* Bảng danh mục sản phẩm */}
      <Table striped bordered hover responsive variant="dark">
        <thead>
          <tr>
            <th>#</th>
            <th>Tên danh mục</th>
            <th>Số lượng sản phẩm</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category, index) => (
            <tr key={category.id}>
              <td>{index + 1}</td>
              <td>{category.name}</td>
              <td>{category.productCount}</td>
              <td>
                <Button variant="info" size="sm" className="me-2">
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

export default ProductCategory;
