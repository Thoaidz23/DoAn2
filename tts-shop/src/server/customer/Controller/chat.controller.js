const db = require('../../db');

// Controller bắt đầu cuộc trò chuyện
exports.startChat = (req, res) => {
  const { user_id } = req.body; // Lấy user_id từ req.body

  if (!user_id) {
    return res.status(400).send({ message: 'Thiếu user_id' });
  }

  // Tạo một cuộc trò chuyện mới trong bảng `chats`
  const query = 'INSERT INTO chats (user_id) VALUES (?)';
  db.query(query, [user_id], (err, result) => {
    if (err) {
      console.error('Lỗi khi tạo cuộc trò chuyện:', err);
      return res.status(500).send({ message: 'Lỗi khi tạo cuộc trò chuyện' });
    }

    // Trả về ID cuộc trò chuyện vừa tạo
    res.status(200).send({ message: 'Cuộc trò chuyện đã được bắt đầu', chat_id: result.insertId });
  });
};

// Controller gửi tin nhắn
exports.sendMessage = (req, res) => {
  const { chat_id, user_id, message, sender } = req.body;

  if (!chat_id || !user_id || !message || !sender) {
    return res.status(400).send({ message: 'Thiếu thông tin cuộc trò chuyện hoặc tin nhắn' });
  }

  // Lưu tin nhắn vào bảng `messages`
  const query = 'INSERT INTO messages (chat_id, sender, message) VALUES (?, ?, ?)';
  db.query(query, [chat_id, sender, message], (err, result) => {
    if (err) {
      console.error('Lỗi khi gửi tin nhắn:', err);
      return res.status(500).send({ message: 'Lỗi khi gửi tin nhắn' });
    }

    res.status(200).send({ message: 'Tin nhắn đã được gửi', message_id: result.insertId });
  });
};
