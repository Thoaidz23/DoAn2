import React, { useEffect, useState, useRef ,useContext} from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Container, Row, Col, Button, Image, Form,
  ListGroup, Tabs, Tab, Carousel, Table
} from "react-bootstrap";
import { CartPlus, BagCheck } from "react-bootstrap-icons";
import "../styles/ProductDetail.scss";
import ProductOptionSelector from "../component/ProductOptionSelector";
import { AuthContext } from "../context/AuthContext";
import TopHeadBar from "../component/TopHeadBar";
import { useNavigate } from "react-router-dom";
const ProductDetail = () => {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [defaultProduct, setDefaultProduct] = useState(null);
  const [specifications, setSpecifications] = useState([]);
  const [post, setPost] = useState([]);

  const { user} = useContext(AuthContext);

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [showError, setShowError] = useState(false); 
  const [showSuccess ,setSuccess ] = useState(false);
  const [showBuyNowError, setShowBuyNowError] = useState(false);

  const [index, setIndex] = useState(0);

  const thumbRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const navigate = useNavigate();


  useEffect(() => {
    axios.get(`http://localhost:5000/api/group-route/${id}`)
      .then((res) => {
        const data = res.data;        
        console.log("dataproduct",data)
        setProducts(data.product);
        setPost(data.post)
        setSpecifications(data.specifications);
        setDefaultProduct(data.product[0]);
        setSelectedProduct(data.product[0]);
      })  
      .catch((err) => {
        console.error("Lỗi khi lấy chi tiết sản phẩm:", err);
      });
  }, [id]);
  if (!selectedProduct || !defaultProduct) return <div className="text-center p-5">Đang tải...</div>;

  const fullProductInfo = selectedProduct;

  const productImages = fullProductInfo?.images
    ? fullProductInfo.images.split(",")
    : ["http://localhost:5000/images/product/dt1.jpg"];

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

  const handleAddToCart = async () => {
    console.log({
      id_user: user.id,
      id_product: selectedProduct.id_product,
      quantity,
      price: selectedProduct.price * quantity,
      id_group_product: selectedProduct.id_group_product,
    });
    setSuccess(true); // Nếu chưa đăng nhập, hiển thị thông báo lỗi
    // Tắt thông báo sau 3 giây
    setTimeout(() => {
      setSuccess(false); // Ẩn thông báo sau 3 giây
    }, 3000);
    try {
      const res = await axios.post("http://localhost:5000/api/cart/add", {
        id_user: user.id,
        id_product: selectedProduct.id_product,
        quantity,
        price:selectedProduct.price*quantity,
        id_group_product:selectedProduct.id_group_product,
      }
      
    );
    } catch (err) {
      console.error("Lỗi khi thêm vào giỏ hàng:", err);
    }
  };
  
  const handleAddToCartFaile = () => {
    if (!user) {
      setShowError(true); // Nếu chưa đăng nhập, hiển thị thông báo lỗi
      // Tắt thông báo sau 3 giây
      setTimeout(() => {
        setShowError(false); // Ẩn thông báo sau 3 giây
      }, 3000); // 3000ms = 3 giây
    } else {
      // Xử lý thêm vào giỏ hàng
      alert("Đã thêm sản phẩm vào giỏ hàng!");
    }
  };

  const handleBuyNow = () => {

  if (!user) {
    setShowBuyNowError(true);
    setTimeout(() => setShowBuyNowError(false), 3000);
    return;
  }
  navigate(`/cartpage`);
  handleAddToCart();
};



  const getUniqueOptions = (fieldId, labelField) => {
    const uniqueMap = new Map();
    products.forEach((product) => {
      if (product[fieldId]) {
        uniqueMap.set(product[fieldId], product[labelField]);
      }
    });
  
    return Array.from(uniqueMap.entries()).map(([id, label]) => ({ id, label }));
  };
  
  
  const handleOptionSelect = (field, id) => {
  let filtered;

  if (field === "id_color") {
    filtered = products.filter(p => p.id_color === id);
  } else if (field === "id_ram") {
    filtered = products.filter(p => p.id_ram === id && p.id_color === selectedProduct.id_color);
  } else if (field === "id_rom") {
    filtered = products.filter(p => p.id_rom === id && p.id_color === selectedProduct.id_color && p.id_ram === selectedProduct.id_ram);
  }

  if (filtered.length > 0) {
    setSelectedProduct(filtered[0]);
  } else {
    console.warn("Không tìm thấy biến thể phù hợp với lựa chọn.");
  }
};

const getAvailableOptions = (field) => {
  const { id_color, id_ram, id_rom } = selectedProduct;

  return products
    .filter((product) => {
      if (field === "id_color") {
        return true; // tất cả màu đều có thể chọn
      }

      if (field === "id_ram") {
        return product.id_color === id_color;
      }

      if (field === "id_rom") {
        return product.id_color === id_color && product.id_ram === id_ram;
      }

      return false;
    })
    .map((product) => ({
      id: product[field],
      label:
        field === "id_color" ? product.name_color :
        field === "id_ram"   ? product.name_ram   :
        field === "id_rom"   ? product.name_rom   : "",
    }))
    .filter((item, index, self) =>
      index === self.findIndex((t) => t.id === item.id)
    );
};

  const allRamOptions = getUniqueOptions("id_ram", "name_ram");
  const availableRamOptions = getAvailableOptions("id_ram");
  const availableRamIds = new Set(availableRamOptions.map(o => o.id));

  const allRomOptions = getUniqueOptions("id_rom", "name_rom");
  const availableRomOptions = getAvailableOptions("id_rom");
  const availableRomIds = new Set(availableRomOptions.map(o => o.id));
  
   
  return (
    
    <div>
   <TopHeadBar
  searchText=""
  categoryName={selectedProduct?.name_group_product}
/>

    <div className="Product-detail-content">
    <div className="product-detail">
      
      <Container fluid>
        {showBuyNowError && (
  <div className="error-message" style={{ width: "350px", left: "75%", backgroundColor: "#dc3545" }}>
    <p>Vui lòng đăng nhập để mua ngay!</p>
  </div>
)}

              {/* Nơi bạn muốn hiển thị thông báo lớn */}
            {showError && (
              <div className="error-message" style={{width : "350px" ,left: "75%"  }}>
                <p>Vui lòng đăng nhập để thêm vào giỏ hàng!</p>
              </div>
              
            )}
             {showError && (
              <div className="error-message" style={{width : "350px" ,left: "75%"  }}>
                <p>Vui lòng đăng nhập để thêm vào giỏ hàng!</p>
              </div>
              
            )}
            {showSuccess && (
              <div className="error-message" style={{background:"green"}}>
                <p>Đã thêm vào giỏ hàng.</p>
              </div>
            )}
            
        <Row className="mt-4">
          <Col md={7}>
            <Carousel activeIndex={index} onSelect={(i) => setIndex(i)}>
              {productImages.map((img, idx) => (
                <Carousel.Item key={idx} className="image-container">
                  <Image
                    className="d-block w-100 rounded mb-3"
                    src={img}
                    alt={selectedProduct.name_group_product}
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
                  onClick={() => setIndex(idx)}
                  className={`thumbnail-img ${index === idx ? "active" : ""}`}
                />
              ))}
            </div>
          </Col>

          <Col md={5}>
            <h2>{selectedProduct.name_group_product}</h2>
            <h4 className="text-danger">
              {selectedProduct.price.toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })}
            </h4>
              
            {selectedProduct.name_color && (
                <ProductOptionSelector
                  label="Màu sắc"
                  options={getUniqueOptions("id_color","name_color")}
                  selected={selectedProduct.id_color}
                  onSelect={(id) => handleOptionSelect("id_color", id)}
                />
              )}
            
          {selectedProduct.name_ram&&(
            <ProductOptionSelector
              label="RAM"
              options={allRamOptions}
              selected={selectedProduct.id_ram}
              onSelect={(id) => handleOptionSelect("id_ram", id)}
              disabledOptions={allRamOptions.filter(o => !availableRamIds.has(o.id)).map(o => o.id)}
            />
          )}
            
          {selectedProduct.name_rom&&(
           <ProductOptionSelector
           label="ROM"
           options={allRomOptions}
           selected={selectedProduct.id_rom}
           onSelect={(id) => handleOptionSelect("id_rom", id)}
           disabledOptions={allRomOptions.filter(o => !availableRomIds.has(o.id)).map(o => o.id)}
         />
         )}
            

            <Row className="align-items-end mb-3">
              <Col xs={4}>
                <Form.Group>
                  <Form.Label>Số lượng</Form.Label>
                  <Form.Control
                    type="number"
                    min="1"
                    max="5"
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(Math.max(1, Number(e.target.value)))
                    }
                  />
                </Form.Group>
              </Col>

              <Col xs={8}>
              {user ? (
                quantity <= 5 ? (
                  <>
                    <Button className="cart-btn" onClick={handleAddToCart}>
                      <CartPlus className="me-2" /> Thêm vào giỏ hàng
                    </Button>
                  </>
                ) : (
                  <>
                    <Button className="cart-btn">
                      <CartPlus className="me-2" /> Thêm vào giỏ hàng
                    </Button>
                  </>
                )
              ) : (
                <Button className="cart-btn" onClick={handleAddToCartFaile}>
                  <CartPlus className="me-2" /> Thêm vào giỏ hàng
                </Button>
              )}
            </Col>
            
            </Row>
            <div className="d-grid gap-2 mb-4">
              <Button className="buy-btn" size="lg" onClick={handleBuyNow}>
                <BagCheck className="me-2" /> Mua ngay
              </Button>
            </div>
          </Col>
        </Row>

        <Row className="mt-5">
          <Col>
            <Tabs
              activeKey={activeTab}
              onSelect={(k) => setActiveTab(k)}
              className="mb-3"
            >
              <Tab eventKey="description" title="Mô tả sản phẩm">
                <p>{selectedProduct.content}</p>
              </Tab>
              <Tab eventKey="specifications" title="Thông số kỹ thuật">
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Thông số kỹ thuật</th>
                      <th>Giá trị</th>
                    </tr>
                  </thead>
                  <tbody>
                    {specifications.map((spec, index) => (
                      <tr key={index}>
                        <td><strong>{spec.attribute}</strong></td>
                        <td>{spec.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Tab>
            </Tabs>
          </Col>
        </Row>

        <Row className="mt-5 mb-5 position-relative">
  <Col>
    <h4>Bài viết liên quan</h4>
    <div className="position-relative">
      <ListGroup className="position-relative">
        {/* Kiểm tra xem 'post' có tồn tại và là một mảng không */}
        {Array.isArray(post) && post.length > 0 ? (
              post.slice(0, 5).map((article, idx) => (
                <ListGroup.Item key={article.id} className="d-flex align-items-center">
                  <Image
                    src={`http://localhost:5000/images/post/${article.image}`}
                    alt={article.title}
                    width={80}
                    height={80} 
                    className="me-3 rounded"
                  />
                  <div>
                    <a href={article.link} className="text-decoration-none fw-bold text-dark">
                      {article.title}
                    </a>
                  </div>
                </ListGroup.Item>
              ))
            ) : (
              <p>Không có bài viết liên quan.</p>
            )}

      </ListGroup>

      <div className="see-more-btn">
        <a href="/catalognews " className="btn custom-see-more">
          - Xem thêm bài viết -
        </a>
      </div>
    </div>
  </Col>
</Row>

        
      </Container>
    </div>
    </div>
      </div>
  );
};

export default ProductDetail;
