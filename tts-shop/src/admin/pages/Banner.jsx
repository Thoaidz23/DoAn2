const Banner = () => {
    const banners = [
      {
        id: 1,
        image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:690:300/q:90/plain/https://dashboard.cellphones.com.vn/storage/iphone-16-pro-max-thu-cu-moi-home.jpg",
        name: "Iphone 16 Pro",
        date: "2025-04-11",
      },
      {
        id: 2,
        image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:690:300/q:90/plain/https://dashboard.cellphones.com.vn/storage/dien-thoai-samsung-galaxy-s25-ultra-ho-henie-home-xanh-duong.png",
        name: "Samsung S25 Ultra",
        date: "2025-04-09",
      },
    ];
  
    return (
      <div>
        <h3 className="mb-4">Quản lý Banner</h3>
  
        <div className="mb-3 text-end">
          <button className="btn btn-primary">
            <i className="bi bi-plus-lg"></i> Thêm banner
          </button>
        </div>
  
        <div className="table-responsive">
          <table className="table table-bordered table-dark table-hover align-middle">
            <thead>
              <tr>
                <th scope="col">Ảnh</th>
                <th scope="col">Tên</th>
                <th scope="col">Ngày</th>
                <th scope="col">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {banners.map((banner) => (
                <tr key={banner.id}>
                  <td className="text-center">
                  <img
                    src={banner.image}
                    alt={banner.name}
                    style={{ width: "450px", height: "200px" }}
                    />
                  </td>
                  <td>{banner.name}</td>
                  <td>{banner.date}</td>
                  <td>
                    <button className="btn btn-sm btn-warning me-2">Sửa</button>
                    <button className="btn btn-sm btn-danger">Xóa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };
  
  export default Banner;
  