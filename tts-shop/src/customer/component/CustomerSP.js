import React, { useState } from "react";
import { Modal, Button, Form, Image } from "react-bootstrap";
import { FaComments } from "react-icons/fa";

const CustomerSupport = () => {
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([
    {
      sender: "agent",
      message:
        "Dạ CellphoneS xin chào anh Nguyễn Mạnh Sang. Em chân thành xin lỗi anh vì đã để mình đợi lâu trong quá trình cần hỗ trợ. Dạ không biết mình cần tư vấn thông tin gì vậy ạ?",
    },
  ]);

  const handleSend = () => {
    if (message.trim() !== "") {
      setChat((prev) => [...prev, { sender: "user", message }]);
      setMessage("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
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
          onClick={() => setShow(true)}
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
            onKeyDown={handleKeyPress}
            style={{width:"80%"}}
          />
          <Button variant="danger" onClick={handleSend}>
          <i class="bi bi-send"></i>
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CustomerSupport;
