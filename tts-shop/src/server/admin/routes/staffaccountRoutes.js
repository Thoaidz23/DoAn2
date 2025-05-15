const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staffaccountController');

// Lấy danh sách nhân viên
router.get('/', staffController.getStaffs);

// Thêm mới nhân viên
router.post("/", staffController.addStaff);

// Lấy thông tin nhân viên theo ID để sửa
router.get("/edit/:id", staffController.getStaffById);

// Cập nhật thông tin nhân viên
router.put("/:id", staffController.editStaff);

// Xóa nhân viên
router.delete("/:id", staffController.deleteStaff);

module.exports = router;
