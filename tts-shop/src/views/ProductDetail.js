import React, { useState, useRef } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Image,
  Form,
  ListGroup,
  Tabs,
  Tab,
  Table,
  Carousel,
} from "react-bootstrap";
import { CartPlus, BagCheck } from "react-bootstrap-icons";
import Navbar from "../component/NavBar";
import "../styles/ProductDetail.scss"; // <-- import SCSS

// Import ảnh sản phẩm
import img1 from "../assets/img/img1.png";
import img2 from "../assets/img/img2.webp";
import img3 from "../assets/img/img3.webp";

const ProductDetail = () => {
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [index, setIndex] = useState(0);

  // Ref và state cho drag-to-scroll
  const thumbRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const productImages = [img1, img2, img3,img1, img2, img3,img1, img2, img3,img1, img2, img3];

  const product = {
    id: 1,
    name: "Tai nghe không dây Sony WH-1000XM4",
    price: 5990000,
    fullDescription: `
      - Công nghệ chống ồn thông minh với bộ xử lý QN1.
      - Chất lượng âm thanh Hi-Res với LDAC, hỗ trợ 360 Reality Audio.
      - Thời lượng pin lên đến 30 giờ, sạc nhanh 10 phút cho 5 giờ sử dụng.
      - Kết nối không dây Bluetooth 5.0, hỗ trợ NFC, USB-C.
      - Thiết kế nhẹ, thoải mái khi đeo trong thời gian dài.`,
    specifications: [
      { key: "Thương hiệu", value: "Sony" },
      { key: "Loại tai nghe", value: "Over-ear, Không dây" },
      { key: "Công nghệ chống ồn", value: "ANC (Chủ động)" },
      { key: "Kết nối", value: "Bluetooth 5.0, NFC, USB-C" },
      { key: "Thời lượng pin", value: "30 giờ" },
      { key: "Hỗ trợ âm thanh", value: "LDAC, AAC, SBC" },
      { key: "Trọng lượng", value: "254g" },
    ],
  };

  const relatedArticles = [
    { id: 1, title: "Hướng dẫn chọn tai nghe chống ồn tốt nhất", link: "#" },
    { id: 2, title: "Đánh giá Sony WH-1000XM4: Có đáng mua không?", link: "#" },
    { id: 3, title: "So sánh Sony WH-1000XM4 và Bose 700", link: "#" },
  ];

  const handleAddToCart = () => {
    alert(`Đã thêm ${quantity} sản phẩm vào giỏ hàng!`);
  };
  const handleBuyNow = () => {
    alert(`Bạn đã mua ${quantity} sản phẩm!`);
  };

  // Handlers drag-to-scroll
  const onMouseDown = (e) => {
    const slider = thumbRef.current;
    setIsDragging(true);
    setStartX(e.clientX);
    setScrollLeft(slider.scrollLeft);
  };
  const onMouseUp = () => setIsDragging(false);
  const onMouseLeave = () => setIsDragging(false);
  const onMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const slider = thumbRef.current;
    const walk = e.clientX - startX;
    slider.scrollLeft = scrollLeft - walk;
  };

  return (
    <>
      <Navbar />
      <div className="product-detail">
        <Container fluid>
          <Row className="mt-4">
            {/* Hình + thumbnail */}
            <Col md={7}>
              <Carousel activeIndex={index} onSelect={(i) => setIndex(i)}>
                {productImages.map((img, idx) => (
                  <Carousel.Item key={idx}>
                    <Image
                      className="d-block w-100 rounded mb-3"
                      src={img}
                      alt={`Ảnh ${idx + 1}`}
                    />
                  </Carousel.Item>
                ))}
              </Carousel>

              <div
                className={`thumbnail-container ${isDragging ? "dragging" : ""} mt-3`}
                ref={thumbRef}
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
                onMouseLeave={onMouseLeave}
              >
                {productImages.map((img, idx) => (
                  <Image
                    key={idx}
                    src={img}
                    thumbnail
                    draggable={false}
                    onDragStart={(e) => e.preventDefault()}
                    onClick={() => setIndex(idx)}
                    className={`thumbnail-img ${index === idx ? "active" : ""}`}
                  />
                ))}
              </div>
            </Col>

            {/* Thông tin + nút */}
            <Col md={5}>
              <h2>{product.name}</h2>
              <h4 className="text-danger">
                {product.price.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </h4>

              <Row className="align-items-end mb-3">
                <Col xs={4}>
                  <Form.Group controlId="quantity">
                    <Form.Label>Số lượng</Form.Label>
                    <Form.Control
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(Math.max(1, Number(e.target.value)))
                      }
                    />
                  </Form.Group>
                </Col>
                <Col xs={8}>
                  <Button className="cart-btn" onClick={handleAddToCart}>
                    <CartPlus className="me-2" /> Thêm vào giỏ hàng
                  </Button>
                </Col>
              </Row>

              <div className="d-grid gap-2 mb-4">
                <Button className="buy-btn" size="lg" onClick={handleBuyNow}>
                  <BagCheck className="me-2" /> Mua ngay
                </Button>
              </div>
            </Col>
          </Row>

          {/* Tabs mô tả và thông số */}
          <Row className="mt-5">
            <Col>
              <Tabs
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k)}
                className="mb-3"
              >
                <Tab eventKey="description" title="Mô tả sản phẩm">
                  <p>{product.fullDescription}</p>
                </Tab>
                <Tab eventKey="specifications" title="Thông số kỹ thuật">
                  <Table striped bordered hover>
                    <tbody>
                      {product.specifications.map((spec, idx) => (
                        <tr key={idx}>
                          <td>
                            <strong>{spec.key}</strong>
                          </td>
                          <td>{spec.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Tab>
              </Tabs>
            </Col>
          </Row>

          {/* Bài viết liên quan */}
          <Row className="mt-5 mb-5">
            <Col>
              <h4>Bài viết liên quan</h4>
              <ListGroup>
                {relatedArticles.map((article) => (
                  <ListGroup.Item key={article.id}>
                    <a href={article.link} className="text-decoration-none">
                      {article.title}
                    </a>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default ProductDetail;
