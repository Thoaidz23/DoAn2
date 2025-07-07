import React, { useState , useRef, useEffect } from "react";
import { FaRobot, FaTimes } from "react-icons/fa";

function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Xin chào! Tôi là trợ lý AI của TTSShop. Bạn cần gì?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  const API_KEY = process.env.REACT_APP_OPENROUTER_API_KEY;

  useEffect(() => {
  scrollToBottom();
}, [messages]);


  const handleSend = async () => {
    if (!input.trim()) return;

    const newUserMessage = { from: "user", text: input };
    setMessages((prev) => [...prev, newUserMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
          "HTTP-Referer": "http://localhost:3000", // sửa lại domain thật nếu cần
          "X-Title": "TTS-Shop AI Chat",
        },
        body: JSON.stringify({
          model: "anthropic/claude-3-haiku",
          messages: [
            { role: "system", content: "Bạn là trợ lý AI chuyên tư vấn mua hàng, hỗ trợ khách." },
            ...messages.map((msg) => ({
              role: msg.from === "user" ? "user" : "assistant",
              content: msg.text,
            })),
            { role: "user", content: input },
          ],
        }),
      });

      const data = await response.json();
      console.log("Phản hồi từ OpenRouter:", data);
      const reply = data.choices?.[0]?.message?.content || "Xin lỗi, tôi không hiểu câu hỏi.";
      setMessages((prev) => [...prev, { from: "bot", text: reply }]);
    } catch (error) {
      console.error("Lỗi gọi API:", error);
      setMessages((prev) => [...prev, { from: "bot", text: "Lỗi khi gọi AI. Vui lòng thử lại sau." }]);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
  messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
};


  const styles = {
    widget: {
      position: "fixed",
      bottom: "20px",
      right: "20px",
      zIndex: 9999,
    },
    toggle: {
      backgroundColor: "#007bff",
      color: "white",
      border: "none",
      borderRadius: "50%",
      width: "50px", // 👈 thêm width & height cố định
      height: "50px",
      display: "flex", // 👈 thêm để căn giữa icon
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
    },
    box: {
      width: "320px",
      height: "420px",
      background: "white",
      border: "1px solid #ddd",
      borderRadius: "10px",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
    },
    header: {
      background: "#007bff",
      color: "white",
      padding: "10px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      fontWeight: "bold",
    },
    body: {
      flex: 1,
      padding: "10px",
      overflowY: "auto",
      background: "#f9f9f9",
    },
    message: {
      marginBottom: "10px",
      padding: "8px 12px",
      borderRadius: "15px",
      maxWidth: "80%",
      wordWrap: "break-word",
    },
    user: {
      backgroundColor: "#d1e7dd",
      alignSelf: "flex-end",
      marginLeft: "auto",
    },
    bot: {
      backgroundColor: "#f8d7da",
      alignSelf: "flex-start",
      marginRight: "auto",
    },
    inputArea: {
      display: "flex",
      padding: "10px",
      borderTop: "1px solid #ddd",
    },
    input: {
      flex: 1,
      padding: "8px",
      border: "1px solid #ccc",
      borderRadius: "20px",
      marginRight: "8px",
    },
    button: {
      padding: "8px 16px",
      backgroundColor: "#007bff",
      color: "white",
      border: "none",
      borderRadius: "20px",
      cursor: "pointer",
    },
  };

  return (
    <div style={styles.widget}>
      {open ? (
        <div style={styles.box}>
          <div style={styles.header}>
            <span>Trợ lý AI</span>
            <FaTimes onClick={() => setOpen(false)} style={{ cursor: "pointer" }} />
          </div>
          <div style={styles.body}>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  ...styles.message,
                  ...(msg.from === "user" ? styles.user : styles.bot),
                }}
              >
                {msg.text}
              </div>
            ))}
            {loading && <div style={{ ...styles.message, ...styles.bot }}>Đang trả lời...</div>}
            <div ref={messagesEndRef} />
          </div>
          <div style={styles.inputArea}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Nhập nội dung..."
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              style={styles.input}
            />
            <button onClick={handleSend} style={styles.button}>
              Gửi
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => {
            setOpen(true);
            setTimeout(scrollToBottom, 100); // delay để chờ chat box render xong
          }}
          style={styles.toggle}
        >
          <FaRobot size={20} />
      </button>
      )}
    </div>
  );
}

export default ChatWidget;
