import React, { useState, useEffect,useContext } from "react";
import "../styles/QnASeciton.scss";
import mascotImg from "../assets/img/QnA.png";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";


function QnASection({ id_group_product}) {
  const [comments, setComments] = useState([]);
  const [showReplies, setShowReplies] = useState(null);
  const [question, setQuestion] = useState("");
  const [showAllComments, setShowAllComments] = useState(false);
  const [activeReplyInput, setActiveReplyInput] = useState(null);
  const [replyTexts, setReplyTexts] = useState({});
  const { user} = useContext(AuthContext);
  const avatar = `https://ui-avatars.com/api/?name=Ad&background=random&color=fff&rounded=true&size=40`;
  const fetchComments = () => {
    axios.get(`http://localhost:5000/api/qna?productId=${id_group_product}`).then((res) => {
      setComments(res.data);
    });
  };

  useEffect(() => {
    if(id_group_product){
      fetchComments();
    }
    
  }, [id_group_product]);

  const handleToggleLockComment = (id) => {
  axios.put(`http://localhost:5000/api/qna/comment/${id}/lock`).then(() => {
    fetchComments();
  });
};

const handleToggleLockReply = (id) => {
  axios.put(`http://localhost:5000/api/qna/reply/${id}/lock`).then(() => {
    fetchComments();
  });
};



  const handleSendQuestion = () => {
    if (!question.trim()) return;
    axios.post("http://localhost:5000/api/qna/question", {
      name: user.name || "Khách",
      avatar: user.avatar || avatar,
      content: question,
      id_group_product,
    }).then(() => {
      setQuestion("");
      fetchComments();
    });
  };

  const handleSendReply = (commentId, replyIdKey) => {
    const content = replyTexts[replyIdKey];
    if (!content?.trim()) return;
    axios.post("http://localhost:5000/api/qna/reply", {
      commentId,
      name: user.name || "Khách",
      avatar:  user.avatar || avatar,
      content,
      role: user.role || 0,
    }).then(() => {
      setReplyTexts((prev) => ({ ...prev, [replyIdKey]: "" }));
      setActiveReplyInput(null);
      fetchComments();
    });
  };

  const toggleReplies = (commentId) => {
    setShowReplies((prev) => (prev === commentId ? null : commentId));
  };

  const visibleComments = showAllComments ? comments : comments.slice(0, 2);

  const getDisplayName = (user) => {
    if (user.role === 1) return "Quản trị viên";
    if (user.role === 2) return "Quản trị viên";
    return user.name;
  };

  const renderAvatar = (user) => {
    return user.avatar ? (
      <img src={user.avatar} alt="avatar" />
    ) : (
      <div className="avatar-fallback">{user.name?.charAt(0) || "?"}</div>
    );
  };

  return (
    <div className="qna-container" style={{color:"black"}}>
      <h2>Hỏi và đáp</h2>
{(!user || user?.role === 3) && (
  <div className="ask-box">
    <img src={mascotImg} alt="Mascot" className="mascot" />
    <div className="ask-content">
      <h3>Hãy đặt câu hỏi cho chúng tôi</h3>
      <p>
        TTSShop sẽ phản hồi trong vòng 1 giờ. Nếu quý khách gửi câu hỏi hãy hỏi và chúng tôi sẽ giải đáp thắc mắc cho quý khách sớm nhất. TTS trân trọng cảm ơn!
      </p>

      {user ? (
        <>
          <input
            type="text"
            placeholder="Viết câu hỏi của bạn tại đây"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <button onClick={handleSendQuestion}>Gửi câu hỏi ✈</button>
        </>
      ) : (
        <p style={{ fontWeight: "bold", color: "red" }}>
          Vui lòng <a href="/login">đăng nhập</a> để đặt câu hỏi.
        </p>
      )}
    </div>
  </div>
)}



      <div className="comment-list">
        {visibleComments
  .filter(comment => {
    // User thường thì ẩn comment bị khóa
    if (user?.role === 3 && comment.lock_comment === 1) return false;
    return true;
  })
  .map((comment) => (
    <div 
      className={`item-comment ${comment.lock_comment === 1 ? "locked" : ""}`} 
      key={comment.id}
    >
      <div className="avatar">{renderAvatar(comment)}</div>
      <div className="comment-body">
        <div className="comment-header">
          <strong>{getDisplayName(comment)}</strong>
          <span>· {new Date(comment.time).toLocaleDateString()}</span>
        </div>
        <p>{comment.content}</p>
        <span className="reply-action" onClick={() => setActiveReplyInput(`comment-${comment.id}`)}>💬 Phản hồi</span>
        {(user?.role === 1 || user?.role === 2) && (
          <span className="reply-action" onClick={() => handleToggleLockComment(comment.id)}>
            🚫 Ẩn/Hiện
          </span>
        )}

        {activeReplyInput === `comment-${comment.id}` && (
          <div className="reply-input-box">
            <input
              type="text"
              placeholder="Nhập phản hồi của bạn..."
              value={replyTexts[`comment-${comment.id}`] || ""}
              onChange={(e) =>
                setReplyTexts((prev) => ({ ...prev, [`comment-${comment.id}`]: e.target.value }))
              }
            />
            <button onClick={() => handleSendReply(comment.id, `comment-${comment.id}`)}>Gửi</button>
          </div>
        )}

        {comment.replies.length > 0 && (
  <>
    {(user?.role === 1 || user?.role === 2 || 
      comment.replies.some(r => r.lock_reply === 0)) && (
      <div className="toggle-reply" onClick={() => toggleReplies(comment.id)}>
        {showReplies === comment.id 
          ? "Thu gọn phản hồi ⯅" 
          : `Xem tất cả ${comment.replies.length} phản hồi ⯆`}
      </div>
    )}

    {showReplies === comment.id &&
      comment.replies
        .filter(reply => {
          if (user?.role === 3 && reply.lock_reply === 1) return false;
          return true;
        })
        .map((reply) => (
          <div className={`reply ${reply.lock_reply === 1 ? "locked" : ""}`} key={reply.id}>
            <div className="admin-avatar">{renderAvatar(reply)}</div>
            <div className="reply-body">
              <div className="reply-header">
                <strong>{getDisplayName(reply)}</strong>
                {reply.role === 1 && <span className="tag admin">Quản trị viên</span>}
                {reply.role === 2 && <span className="tag staff">Nhân viên</span>}
                <span>· {new Date(reply.time).toLocaleDateString()}</span>
              </div>
              <p>{reply.content}</p>
              <span
                className="reply-action"
                onClick={() => setActiveReplyInput(`reply-${comment.id}-${reply.id}`)}
              >
                💬 Phản hồi
              </span>
              {(user?.role === 1 || user?.role === 2) && (
                <span className="reply-action" onClick={() => handleToggleLockReply(reply.id)}>
                  🚫 Ẩn/Hiện
                </span>
              )}

              {activeReplyInput === `reply-${comment.id}-${reply.id}` && (
                <div className="reply-input-box">
                  <input
                    type="text"
                    placeholder="Nhập phản hồi..."
                    value={replyTexts[`reply-${comment.id}-${reply.id}`] || ""}
                    onChange={(e) =>
                      setReplyTexts((prev) => ({
                        ...prev,
                        [`reply-${comment.id}-${reply.id}`]: e.target.value,
                      }))
                    }
                  />
                  <button
                    onClick={() => handleSendReply(comment.id, `reply-${comment.id}-${reply.id}`)}
                  >
                    Gửi
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
  </>
)}

      </div>
    </div>
  ))}


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
