import React, { useState } from "react";
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

// Import ảnh sản phẩm
import img1 from "../assets/img/img1.png";
import img2 from "../assets/img/img2.webp";
import img3 from "../assets/img/img3.webp";

const ProductDetail = () => {
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [index, setIndex] = useState(0); // Chỉ mục ảnh trong Carousel

  // Danh sách ảnh sản phẩm
  const productImages = [img1, img2, img3];

  // Thông tin sản phẩm
  const product = {
    id: 1,
    name: "Tai nghe không dây Sony WH-1000XM4",
    price: 5990000,
    description: `Tai nghe Sony WH-1000XM4 là một trong những tai nghe chống ồn tốt nhất hiện nay.`,
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

  // Bài viết liên quan
  const relatedArticles = [
    { id: 1, title: "Hướng dẫn chọn tai nghe chống ồn tốt nhất", link: "#" },
    { id: 2, title: "Đánh giá Sony WH-1000XM4: Có đáng mua không?", link: "#" },
    { id: 3, title: "So sánh Sony WH-1000XM4 và Bose 700", link: "#" },
  ];

  // Xử lý thêm vào giỏ hàng
  const handleAddToCart = () => {
    alert(`Đã thêm ${quantity} sản phẩm vào giỏ hàng!`);
  };

  // Xử lý mua ngay
  const handleBuyNow = () => {
    alert(`Bạn đã mua ${quantity} sản phẩm!`);
  };

  return (
    <Container>
      <Navbar />
      <Row className="mt-4">
        {/* Ảnh sản phẩm - chiếm 7/12 */}
        <Col md={7}>
          {/* Carousel hiển thị ảnh sản phẩm */}
          <Carousel activeIndex={index} onSelect={(selectedIndex) => setIndex(selectedIndex)}>
            {productImages.map((img, idx) => (
              <Carousel.Item key={idx}>
                <Image className="d-block w-100 rounded mb-3" src={img} alt={`Ảnh ${idx + 1}`} />
              </Carousel.Item>
            ))}
          </Carousel>
            
          {/* Danh sách ảnh thumbnail */}
          <Row className="mt-3">
            {productImages.map((img, idx) => (
              <Col xs={4} key={idx} className="mb-2">
                <Image
                  src={img}
                  thumbnail
                  className="w-100 cursor-pointer"
                  onClick={() => setIndex(idx)} // Cập nhật ảnh trong Carousel khi chọn thumbnail
                  style={{
                    border: index === idx ? "2px solid red" : "none",
                  }}
                />
              </Col>
            ))}
          </Row>
        </Col>

        {/* Thông tin sản phẩm - chiếm 5/12 */}
        <Col md={5}>
          <h2>{product.name}</h2>
          <h4 className="text-danger">{product.price.toLocaleString()} VND</h4>
          <p>{product.description}</p>

          {/* Số lượng + Thêm vào giỏ hàng */}
          <Row className="align-items-center mb-3">
            <Col xs={4}>
              <Form.Group controlId="quantity">
                <Form.Label>Số lượng</Form.Label>
                <Form.Control
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                />
              </Form.Group>
            </Col>
            <Col xs={8} className="mt-4">
              <Button variant="success" onClick={handleAddToCart}>
                <CartPlus className="me-2" /> Thêm vào giỏ hàng
              </Button>
            </Col>
          </Row>

          {/* Mua ngay */}
          <div className="d-grid gap-2 mb-4">
            <Button variant="danger" size="lg" onClick={handleBuyNow}>
              <BagCheck className="me-2" /> Mua ngay
            </Button>
          </div>
        </Col>
      </Row>

      {/* Tabs: Mô tả sản phẩm & Thông số kỹ thuật */}
      <Row className="mt-5">
        <Col>
          <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-3">
            <Tab eventKey="description" title="Mô tả sản phẩm">
              <p>{product.fullDescription}</p>
            </Tab>

            <Tab eventKey="specifications" title="Thông số kỹ thuật">
              <Table striped bordered hover>
                <tbody>
                  {product.specifications.map((spec, index) => (
                    <tr key={index}>
                      <td><strong>{spec.key}</strong></td>
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
      <Row className="mt-5">
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
  );
};

export default ProductDetail;
