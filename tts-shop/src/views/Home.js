import React from "react";
import Navbar from "../component/NavBar";
import MenuBar from "../component/MenuBar";
import { Carousel, Row, Col, Card, Button } from "react-bootstrap";
import "../styles/home.scss";
import "../styles/index.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import banner1 from "../assets/img/xiaomi-14-web.jpg";
import banner2 from "../assets/img/banner2.jpg";
import banner3 from "../assets/img/banner3.jpg";

function Home() {
  const products = [
    { id: 1, name: "Xiaomi 14", price: "$799", image: banner1 },
    { id: 2, name: "Samsung Galaxy S24", price: "$999", image: banner2 },
    { id: 3, name: "iPhone 15 Pro", price: "$1099", image: banner3 },
    { id: 4, name: "OnePlus 12", price: "$699", image: banner1 },
    { id: 5, name: "Pixel 8 Pro", price: "$899", image: banner2 },
    { id: 6, name: "Sony Xperia 5", price: "$849", image: banner3 },
  ];
  return (
    <div>
      {/* Navbar */}
      <Navbar />

      {/* Layout chính */}
      <div className="container">
        {/* MenuBar */}
        <div className="menu-wrapper">
          <MenuBar />
        </div>

        {/* Nội dung chính (Banner) */}
        <div className="content">       
          <div className="banner">
            <Carousel>
              <Carousel.Item>
                <img src={banner1} alt="Banner 1" className="d-block w-100 banner-item" />
              </Carousel.Item>
              <Carousel.Item>
                <img src={banner2} alt="Banner 2" className="d-block w-100 banner-item" />
              </Carousel.Item>
              <Carousel.Item>
                <img src={banner3} alt="Banner 3" className="d-block w-100 banner-item" />
              </Carousel.Item>
            </Carousel>
          </div>
            </div>
            <div className="container mt-5">
      <Row>
        {products.map((product) => (
          <Col sm={12} md={6} lg={4} key={product.id} className="mb-4">
            <Card>
              <Card.Img variant="top" src={product.image} alt={product.name} />
              <Card.Body>
                <Card.Title>{product.name}</Card.Title>
                <Card.Text>{product.price}</Card.Text>
                <Button variant="primary">Add to Cart</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
        </div>
        
      </div>
 
  );
}

export default Home;
