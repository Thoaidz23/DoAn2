import React, { useState } from "react";
import { Card, Form, Button, ListGroup, Image } from "react-bootstrap";

const CommentSection = ({ comments = [] }) => {
  const [newComment, setNewComment] = useState("");

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    // TODO: gọi API lưu comment

    setNewComment("");
  };

  return (
    <Card className="mt-5">
      <Card.Header as="h5">Bình luận ({comments.length})</Card.Header>
      <Card.Body>
        <ListGroup variant="flush" className="mb-4">
          {comments.map((c, idx) => (
            <ListGroup.Item key={idx}>
              <div className="d-flex mb-2">
                <Image
                  src={c.avatar}
                  roundedCircle
                  width={40}
                  height={40}
                  className="me-2"
                />
                <div>
                  <strong>{c.author}</strong>{" "}
                  <span className="text-muted" style={{ fontSize: "0.9rem" }}>
                    {c.date}
                  </span>
                  <p className="mt-1">{c.text}</p>
                </div>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>

        <Form onSubmit={handleAddComment}>
          <Form.Group controlId="commentTextarea">
            <Form.Label>Viết bình luận</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Nhập bình luận..."
            />
          </Form.Group>
          <Button type="submit" className="mt-3">
            Gửi bình luận
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default CommentSection;
