const pool = require("../../db");

const getAllQnA = (req, res) => {
  const productId = req.query.productId;

  pool.query(
    "SELECT * FROM tbl_qna_comments WHERE id_group_product = ? ORDER BY time DESC",
    [productId],
    (err, comments) => {
      if (err) {
        console.error("Lỗi khi lấy comment:", err);
        return res.status(500).json({ message: "Server error" });
      }

      pool.query(
        "SELECT * FROM tbl_qna_replies ORDER BY time ASC",
        (err2, replies) => {
          if (err2) {
            console.error("Lỗi khi lấy replies:", err2);
            return res.status(500).json({ message: "Server error" });
          }

          const result = comments.map((comment) => ({
            ...comment,
            replies: replies.filter((r) => r.comment_id === comment.id),
          }));

          res.json(result);
        }
      );
    }
  );
};



const postQuestion = (req, res) => {
  const { name, avatar, content, id_group_product } = req.body;

  pool.query(
    "INSERT INTO tbl_qna_comments (name, avatar, content, id_group_product) VALUES (?, ?, ?, ?)",
    [name, avatar, content, id_group_product],
    (err) => {
      if (err) {
        console.error("Lỗi khi gửi câu hỏi:", err);
        return res.status(500).json({ message: "Server error" });
      }
      res.json({ message: "Đã gửi câu hỏi" });
    }
  );
};


const postReply = (req, res) => {
  const { commentId, name, content, role, avatar } = req.body;

  pool.query(
    "INSERT INTO tbl_qna_replies (comment_id, name, content, role, avatar) VALUES (?, ?, ?, ?, ?)",
    [commentId, name, content, role, avatar],
    (err) => {
      if (err) {
        return res.status(500).json({ message: "Server error" });
      }
      res.json({ message: "✅ Đã gửi phản hồi" });
    }
  );
};

// Ẩn/hiện câu hỏi
const toggleLockComment = (req, res) => {
  const { id } = req.params;

  pool.query(
    "UPDATE tbl_qna_comments SET lock_comment = IF(lock_comment = 1, 0, 1) WHERE id = ?",
    [id],
    (err) => {
      if (err) {
        return res.status(500).json({ message: "Lỗi khi cập nhật trạng thái câu hỏi" });
      }
      res.json({ message: "✅ Đã thay đổi trạng thái hiển thị câu hỏi" });
    }
  );
};

// Ẩn/hiện phản hồi
const toggleLockReply = (req, res) => {
  const { id } = req.params;

  pool.query(
    "UPDATE tbl_qna_replies SET lock_reply = IF(lock_reply = 1, 0, 1) WHERE id = ?",
    [id],
    (err) => {
      if (err) {
        return res.status(500).json({ message: "Lỗi khi cập nhật trạng thái phản hồi" });
      }
      res.json({ message: "✅ Đã thay đổi trạng thái hiển thị phản hồi" });
    }
  );
};


module.exports = {
  getAllQnA,
  postQuestion,
  postReply,
  toggleLockComment,
  toggleLockReply,
};


