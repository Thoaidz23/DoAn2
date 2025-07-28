import React, { useState, useEffect,useContext } from "react";
import "../styles/QnASeciton.scss";
import mascotImg from "../assets/img/QnA.png";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";


function QnASection({ nameuser, roleuser, avataruser ,id_group_product}) {
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

  const handleDeleteQuestion = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa câu hỏi này?")) {
      axios.delete(`http://localhost:5000/api/qna/question/${id}`).then(() => {
        fetchComments();
      });
    }
  };

  const handleDeleteReply = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa phản hồi này?")) {
      axios.delete(`http://localhost:5000/api/qna/reply/${id}`).then(() => {
        fetchComments();
      });
    }
  };


  const handleSendQuestion = () => {
    if (!question.trim()) return;
    axios.post("http://localhost:5000/api/qna/question", {
      name: nameuser || "Khách",
      avatar,
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
      name: nameuser || "Khách",
      avatar,
      content,
      role: roleuser || 0,
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

  const getDisplayName = (item) => {
    if (item.role === 1) return "Quản trị viên";
    if (item.role === 2) return "Quản trị viên";
    return item.name;
  };

  const renderAvatar = (item) => {
    return item.avatar ? (
      <img src={item.avatar} alt="avatar" />
    ) : (
      <div className="avatar-fallback">{item.name?.charAt(0) || "?"}</div>
    );
  };

  return (
    <div className="qna-container" style={{color:"black"}}>
      {user.role == 3 && (
        <>
        <h2>Hỏi và đáp</h2>

      <div className="ask-box">
        <img src={mascotImg} alt="Mascot" className="mascot" />
        <div className="ask-content">
          <h3>Hãy đặt câu hỏi cho chúng tôi</h3>

          <p>
            TTSShop sẽ phản hồi trong vòng 1 giờ. Nếu quý khách gửi câu hỏi hãy hỏi và chúng tôi sẽ giải đáp thắt mắc cho quý khách sớm nhất. TTS trân trọng cảm ơn!
            
          </p>

          <input
            type="text"
            placeholder="Viết câu hỏi của bạn tại đây"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <button onClick={handleSendQuestion}>Gửi câu hỏi ✈</button>
        </div>
      </div>
        </>
      )}
      

      <div className="comment-list">
        {visibleComments.map((comment) => (
          <div className="item-comment" key={comment.id}>
            <div className="avatar">{renderAvatar(comment)}</div>
            <div className="comment-body">
              <div className="comment-header">
                <strong>{getDisplayName(comment)}</strong>
                <span>· {new Date(comment.time).toLocaleDateString()}</span>
              </div>
              <p>{comment.content}</p>
                <span className="reply-action" onClick={() => setActiveReplyInput(`comment-${comment.id}`)}>💬 Phản hồi</span>
                {(roleuser === 1 || roleuser === 2) && (
                  <span className="reply-action" onClick={() => handleDeleteQuestion(comment.id)}>
                    🗑️ Xóa
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
                  <div className="toggle-reply" onClick={() => toggleReplies(comment.id)}>
                    {showReplies === comment.id ? "Thu gọn phản hồi ⯅" : `Xem tất cả ${comment.replies.length} phản hồi ⯆`}
                  </div>

                  {showReplies === comment.id &&
                    comment.replies.map((reply) => (
                      <div className="reply" key={reply.id}>
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
                          {(roleuser === 1 || roleuser === 2) && (
                              <span className="reply-action" onClick={() => handleDeleteReply(reply.id)}>
                                🗑️ Xóa
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
