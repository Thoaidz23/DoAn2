import React, { useState,useContext } from "react";
import { Modal, Button, Form, Image } from "react-bootstrap";
import { FaComments } from "react-icons/fa";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
const CustomerSupport = () => {
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState("");
  const { user } = useContext(AuthContext); 
  const [chat, setChat] = useState([
    {
      sender: "agent",
      message:
        `Dạ CellphoneS xin chào anh ${user.name}. Em chân thành xin lỗi anh vì đã để mình đợi lâu trong quá trình cần hỗ trợ. Dạ không biết mình cần tư vấn thông tin gì vậy ạ?`,
    },
  ]);
  const [chatId, setChatId] = useState(null); // Giả sử chatId sẽ được trả về từ API khi bắt đầu chat

  // Khi người dùng bắt đầu chat, gọi API để tạo cuộc trò chuyện
  const startChat = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/chat/start", {
        user_id: user.id, // Giả sử user_id của người dùng
      });
      setChatId(response.data.chat_id); // Lưu chatId khi tạo cuộc trò chuyện thành công
      setShow(true);
    } catch (error) {
      console.error("Lỗi khi tạo cuộc trò chuyện:", error);
    }
  };

  // Gửi tin nhắn từ người dùng
  const handleSend = async () => {
    if (message.trim() !== "") {
      setChat((prev) => [
        ...prev,
        { sender: "user", message: message },
      ]);
      try {
        await axios.post("http://localhost:5000/api/chat/send", {
          chat_id: chatId,
          user_id: user.id, // Giả sử user_id của người dùng
          sender: "user",
          message: message,
        });
      } catch (error) {
        console.error("Lỗi khi gửi tin nhắn:", error);
      }
      setMessage("");
    }
  };

  // Gửi tin nhắn từ nhân viên
  const handleAgentReply = async (replyMessage) => {
    setChat((prev) => [
      ...prev,
      { sender: "agent", message: replyMessage },
    ]);
    try {
      await axios.post("http://localhost:5000/api/chat/send", {
        chat_id: chatId,
        user_id: 1, // Giả sử user_id của người dùng
        sender: "agent",
        message: replyMessage,
      });
    } catch (error) {
      console.error("Lỗi khi gửi tin nhắn từ nhân viên:", error);
    }
  };

  return (
    <>
      {/* Nút Chat nổi */}
      <div
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          zIndex: 9999,
        }}
      >
        <Button
          variant="danger"
          onClick={startChat}
          className="rounded-circle p-3 shadow"
        >
          <FaComments size={24} />
        </Button>
      </div>

      {/* Modal */}
      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header
          closeButton
          style={{ backgroundColor: "#d32f2f", color: "white" }}
        >
          <Modal.Title>Gia Nguyễn CellphoneS</Modal.Title>
        </Modal.Header>

        <Modal.Body style={{ maxHeight: "300px", overflowY: "auto" }}>
          {chat.map((item, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent:
                  item.sender === "user" ? "flex-end" : "flex-start",
                marginBottom: "10px",
              }}
            >
              {item.sender === "agent" && (
                <Image
                  src="https://cdn-icons-png.flaticon.com/512/219/219986.png"
                  alt="avatar"
                  roundedCircle
                  style={{ width: "32px", height: "32px", marginRight: "8px" }}
                />
              )}
              <div
                style={{
                  padding: "10px",
                  borderRadius: "12px",
                  backgroundColor:
                    item.sender === "user" ? "#DCF8C6" : "#F1F0F0",
                  maxWidth: "80%",
                  whiteSpace: "pre-wrap",
                }}
              >
                {item.message}
              </div>
            </div>
          ))}
        </Modal.Body>

        <Modal.Footer className="d-flex gap-2">
          <Form.Control
            type="text"
            placeholder="Nhập tin nhắn..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            style={{ width: "80%" }}
          />
          <Button variant="danger" onClick={handleSend}>
            <i className="bi bi-send"></i>
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Dưới đây là phần demo để nhân viên trả lời */}
      <div>
        <Button onClick={() => handleAgentReply("Xin chào, tôi là nhân viên hỗ trợ.")}>
          Nhân viên trả lời
        </Button>
      </div>
    </>
  );
};

export default CustomerSupport;
