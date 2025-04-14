import { Table, Button } from "react-bootstrap";

const PostCategory = () => {
  // Dữ liệu tĩnh về các danh mục bài viết
  const postCategories = [
    { id: 1, name: "Công nghệ", postCount: 25 },
    { id: 2, name: "Kinh doanh", postCount: 15 },
    { id: 3, name: "Sức khỏe", postCount: 10 },
    { id: 4, name: "Giải trí", postCount: 30 },
  ];

  return (
    <div>
      {/* Nút thêm danh mục bài viết */}
      <Button variant="primary" className="mt-4 mb-3">
        Thêm danh mục bài viết
      </Button>

      {/* Bảng danh mục bài viết */}
      <Table striped bordered hover responsive variant="dark">
        <thead>
          <tr>
            <th>#</th>
            <th>Tên danh mục bài viết</th>
            <th>Số lượng bài viết</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {postCategories.map((category, index) => (
            <tr key={category.id}>
              <td>{index + 1}</td>
              <td>{category.name}</td>
              <td>{category.postCount}</td>
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

export default PostCategory;
