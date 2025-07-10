import React, { useState } from "react";
import "../styles/QnASeciton.scss";

function QnASection() {
  const [showReplies, setShowReplies] = useState(null);
  const [question, setQuestion] = useState("");
  const [showAllComments, setShowAllComments] = useState(false);

  const comments = [
    {
      id: 1,
      name: "Thu Trang",
      time: "2 tuần trước",
      content: "đây là máy new đúng không ạ",
      replies: [
        {
          id: 1,
          name: "Quản Trị Viên",
          time: "2 tuần trước",
          content: `Dạ CellphoneS xin chào chị Trang
Máy mới 100% ạ
APPLE IPHONE 16 PLUS 128GB TRẮNG CHÍNH HÃNG VN/A (MXVV3) giá thời điểm hiện tại: 21.990.000 tại miền nam
Không biết mình ở quận nào em kiểm tra cửa hàng gần nhất hỗ trợ giữ hàng qua SDT
Thân Mến!`,
        },
      ],
    },
    {
      id: 2,
      name: "Hà Ngọc Yến",
      time: "3 tuần trước",
      content: "Iphone 16plus trả góp khi nào mới có hàng vậy ạ",
      replies: [],
    },
    {
      id: 3,
      name: "Trần Thị Phương Anh",
      time: "1 tháng trước",
      content: "ip16plus 128gb có UDSV hok ạ",
      replies: [
        {
          id: 1,
          name: "Quản Trị Viên",
          time: "1 tháng trước",
          content: `CellphoneS xin chào chị Phương Anh
Dạ iphone mới chưa có ưu đãi S-Student ạ
iPhone 16 Plus 128GB | Chính hãng VN/A hồng giá hiện tại giảm còn 22.390.000đ (giá tại miền nam) ạ
Dạ mình ở khu vực nào để em kiểm tra shop còn hàng gần mình nhất ạ
Thân mến !`,
        },
      ],
    },
    {
      id: 4,
      name: "Nguyễn Văn Hùng",
      time: "1 tháng trước",
      content: "Máy có hỗ trợ eSim không vậy shop?",
      replies: [],
    },
  ];

  const toggleReplies = (commentId) => {
    setShowReplies(prev => (prev === commentId ? null : commentId));
  };

  const visibleComments = showAllComments ? comments : comments.slice(0, 2);

  return (
    <div className="qna-container">
      <h2>Hỏi và đáp</h2>
      {/* 🔹 Hộp đặt câu hỏi */}
      <div className="ask-box">
        <img
          src="../assets/img/QnA.png"
          alt="Mascot"
          className="mascot"
        />
        <div className="ask-content">
          <h3>Hãy đặt câu hỏi cho chúng tôi</h3>
          <p>
            CellphoneS sẽ phản hồi trong vòng 1 giờ. Nếu Quý khách gửi câu hỏi sau 22h, chúng tôi sẽ trả lời vào sáng hôm sau.
            Thông tin có thể thay đổi theo thời gian, vui lòng đặt câu hỏi để nhận được cập nhật mới nhất!
          </p>
          <input
            type="text"
            placeholder="Viết câu hỏi của bạn tại đây"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <button>Gửi câu hỏi ✈</button>
        </div>
      </div>


   {/* 🔹 Danh sách bình luận */}
<div className="comment-list">
  {visibleComments.map((comment) => (
    <div className="item-comment" key={comment.id}>
      <div className="avatar">{comment.name.charAt(0)}</div>
      <div className="comment-body">
        <div className="comment-header">
          <strong>{comment.name}</strong>
          <span>· {comment.time}</span>
        </div>
        <p>{comment.content}</p>
        <span className="reply-action">💬 Phản hồi</span>
        <br />
        {/* 🔸 Toggle phản hồi nếu có */}
        {comment.replies.length > 0 && (
          <>
            <div
              className="toggle-reply"
              onClick={() => toggleReplies(comment.id)}
            >
              {showReplies === comment.id
                ? "Thu gọn phản hồi ⯅"
                : `Xem tất cả ${comment.replies.length} phản hồi ⯆`}
            </div>

            {showReplies === comment.id &&
              comment.replies.map((reply) => (
                <div className="reply" key={reply.id}>
                  <div className="admin-avatar">S</div>
                  <div className="reply-body">
                    <div className="reply-header">
                      <strong>{reply.name}</strong>
                      <span className="tag">QTV</span>
                      <span>· {reply.time}</span>
                    </div>
                    <p>
                      {reply.content.split("\n").map((line, index) => (
                        <React.Fragment key={index}>
                          {line}
                          <br />
                        </React.Fragment>
                      ))}
                    </p>
                    <span className="reply-action">💬 Phản hồi</span>
                  </div>
                </div>
              ))}
          </>
        )}
      </div>
    </div>
  ))}
     {/* 🔹 Nút xem thêm bình luận (ẩn sau khi nhấn) */}
      {comments.length > 2 && !showAllComments && (
        <div className="view-more-comments">
          <button onClick={() => setShowAllComments(true)}>
            {`Xem thêm ${comments.length - 2} bình luận ⯈`}
          </button>
        </div>
      )}
</div>
    </div>
  );
}

export default QnASection;
