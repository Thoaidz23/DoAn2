import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Image } from 'react-bootstrap';
import axios from 'axios';
import { Breadcrumb } from "react-bootstrap";
import { Link } from "react-router-dom";

import "../styles/PostDetail.scss";
import TopHeadBar from '../component/TopHeadBar';

const PostDetail = () => {
  const { id_post } = useParams(); // Lấy id từ URL
  const [post, setPost] = useState(null); // state để lưu bài viết
  console.log(id_post)
  useEffect(() => {
    // Kiểm tra id_post có hợp lệ trước khi gọi API
    if (id_post) {
      axios.get(`http://localhost:5000/api/posts/${id_post}`)

        .then(response => {
          setPost(response.data); // Lưu dữ liệu vào state
        })
        .catch(error => {
          console.error("Lỗi khi lấy bài viết:", error);
        });
    }
  }, [id_post]); // Chạy lại khi id_post thay đổi

  if (!post) return <div>Đang tải...</div>; // Nếu chưa có dữ liệu
  const formatDate = (isoDateStr) => {
    const date = new Date(isoDateStr);
    const vnTime = new Date(date.getTime()); // Cộng 7 tiếng
  
    const day = vnTime.getDate().toString().padStart(2, '0');
    const month = (vnTime.getMonth() + 1).toString().padStart(2, '0');
    const year = vnTime.getFullYear();
    const hours = vnTime.getHours().toString().padStart(2, '0');
    const minutes = vnTime.getMinutes().toString().padStart(2, '0');
  
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };
  return (
    <div>
     
    <Container className="my-1">
       <div className='headNewsbar' style={{ marginBottom: "10%",marginLeft: "9%"}} >
    <Breadcrumb>
  <Breadcrumb.Item
    linkAs={Link}
    linkProps={{ to: "/" }}
    style={{ textDecoration: "none", color: "inherit" }} // ← bỏ gạch chân + giữ màu
  >
    Trang chủ
  </Breadcrumb.Item>
  <Breadcrumb.Item
    linkAs={Link}
    linkProps={{ to: "/catalognews" }}
    style={{ textDecoration: "none", color: "inherit" }}
  >
    Bài viết
  </Breadcrumb.Item>
  <Breadcrumb.Item active>{post?.title}</Breadcrumb.Item>
</Breadcrumb>

      </div>
      <Row className="justify-content-center"  style={{width:"100%"}}>
        <Col md={8} className='container-pd'>
          <div style={{ width: '100%', height: '300px', overflow: 'hidden', borderRadius: '10px', marginBottom: '1rem' }}>
            <Image
              src={`http://localhost:5000/images/post/${post.image}`} // Đảm bảo đường dẫn đúng
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          <h2 className="text-center">{post.title}</h2>
          <div className="mb-2 text-muted text-center">
            <small>
              Đăng bởi <strong>{post.author}</strong> | Ngày: {formatDate(post.date)}
            </small>
          </div>
          <div  className="post-content" style={{ textAlign: "justify", lineHeight: "1.8",fontWeight : "400",width:"100%"}} dangerouslySetInnerHTML={{ __html: post.content }} />
        </Col>
      </Row>
    </Container>
    </div>
  );
};

export default PostDetail;