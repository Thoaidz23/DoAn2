import React from 'react';
import { Container, Row, Col, Image, Card, Button, Badge } from 'react-bootstrap';

import img1 from "../assets/img/baiviet1.jpg"

const PostDetail = () => {
  const post = {
    title: "Khám phá vẻ đẹp của Đà Lạt",
    date: "14/04/2025",
    author: "Nguyễn Văn A",
    content: `
      Đà Lạt – thành phố ngàn hoa, luôn là điểm đến lý tưởng của những ai yêu thích thiên nhiên, khí hậu mát mẻ và cảnh quan lãng mạn. 
      Bài viết này sẽ đưa bạn đến những địa điểm hấp dẫn như Hồ Xuân Hương, Thung Lũng Tình Yêu, Đồi chè Cầu Đất, và nhiều hơn nữa.
    `,
    image: img1,
  };

  return (
    <Container className="my-5">
  <Row className="justify-content-center">
    <Col md={8}>
      <div style={{ width: '100%', height: '300px', overflow: 'hidden', borderRadius: '10px', marginBottom: '1rem' }}>
        <Image 
          src={post.image}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>

      <h2 className="text-center">{post.title}</h2>
      <div className="mb-2 text-muted text-center">
        <small>
          Đăng bởi <strong>{post.author}</strong> | Ngày: {post.date}
        </small>
      </div>
      <p style={{ textAlign: "justify", lineHeight: "1.8" }}>{post.content}</p> 
    </Col>
  </Row>
</Container>

  );
};

export default PostDetail;
