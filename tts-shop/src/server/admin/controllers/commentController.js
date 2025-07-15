// const db = require("../../db");

// // Lấy tất cả bình luận theo id_group_product
// exports.getCommentsByProduct = async (req, res) => {
//   const { id_group_product } = req.params;
//   try {
//     const [comments] = await db.execute(`
//       SELECT c.*, u.name AS user_name
//       FROM tbl_comments c
//       LEFT JOIN tbl_users u ON c.id_user = u.id
//       WHERE c.id_group_product = ?
//       ORDER BY c.created_at ASC
//     `, [id_group_product]);

//     res.json(comments);
//   } catch (err) {
//     console.error("Lỗi getCommentsByProduct:", err);
//     res.status(500).json({ error: "Lỗi server" });
//   }
// };

// // Thêm bình luận mới hoặc phản hồi
// exports.addComment = async (req, res) => {
//   const { id_group_product, id_user, comment, parent_id = null } = req.body;
//   try {
//     await db.execute(
//       `INSERT INTO tbl_comments (id_group_product, id_user, comment, parent_id) VALUES (?, ?, ?, ?)`,
//       [id_group_product, id_user, comment, parent_id]
//     );
//     res.json({ message: "Thêm bình luận thành công" });
//   } catch (err) {
//     console.error("Lỗi addComment:", err);
//     res.status(500).json({ error: "Lỗi khi thêm bình luận" });
//   }
// };

// // Xóa bình luận và các phản hồi con
// exports.deleteComment = async (req, res) => {
//   const { id } = req.params;
//   try {
//     await db.execute(`DELETE FROM tbl_comments WHERE id = ? OR parent_id = ?`, [id, id]);
//     res.json({ message: "Xóa bình luận thành công" });
//   } catch (err) {
//     console.error("Lỗi deleteComment:", err);
//     res.status(500).json({ error: "Lỗi khi xóa bình luận" });
//   }
// };
