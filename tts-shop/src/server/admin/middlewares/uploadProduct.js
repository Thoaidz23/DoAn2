const multer = require("multer");
const path = require("path");

// Định nghĩa nơi lưu ảnh và tên ảnh
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./images/product");  // Đường dẫn lưu trữ ảnh
  },
  filename: (req, file, cb) => {
    const originalName = path.parse(file.originalname).name.replace(/\s+/g, '-'); // Xử lý khoảng trắng
    const ext = path.extname(file.originalname);
    const timestamp = Date.now();
    cb(null, `${originalName}_${timestamp}${ext}`);
  }
});

// Tạo middleware upload với multer
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },  // Giới hạn kích thước file 10MB
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Chỉ hỗ trợ các định dạng ảnh: jpeg, jpg, png, gif"));
    }
  },
});

// Expose middleware để sử dụng trong các route
module.exports = upload;
