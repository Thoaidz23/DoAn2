import { Table, Button} from "react-bootstrap";

const BrandCategory = () => {
  // Dữ liệu tĩnh về các thương hiệu
  const brands = [
    { id: 1, name: "Apple", productCount: 50 },
    { id: 2, name: "Samsung", productCount: 30 },
    { id: 3, name: "Dell", productCount: 20 },
    { id: 4, name: "Xiaomi", productCount: 40 },
  ];


  return (
    <div>

      {/* Nút thêm thương hiệu */}
      <Button variant="primary" className="mt-4 mb-3">
        Thêm thương hiệu
      </Button>

      {/* Bảng thương hiệu sản phẩm */}
      <Table striped bordered hover responsive variant="dark">
        <thead>
          <tr>
            <th>#</th>
            <th>Tên thương hiệu</th>
            <th>Số lượng sản phẩm</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {brands.map((brand, index) => (
            <tr key={brand.id}>
              <td>{index + 1}</td>
              <td>{brand.name}</td>
              <td>{brand.productCount}</td>
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

export default BrandCategory;
