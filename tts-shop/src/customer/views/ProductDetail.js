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
import ProductReview from "../component/ProductReview";
import QnASection from "../component/QnASection";
import CompareModal from './../component/CompareModal';
import "../styles/ProductReview.scss"

const ProductDetail = () => {
  const [compareSelected, setCompareSelected] = useState([]);
   const [showModal, setShowModal] = useState(false);

  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [defaultProduct, setDefaultProduct] = useState(null);
  const [specifications, setSpecifications] = useState([]);
  const [post, setPost] = useState([]);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const { user} = useContext(AuthContext);
  console.log(user)
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
  const [filter, setFilter] = useState('Tất cả');

    const reviews = [
  {
    name: 'Tăng Quốc Anh',
    initials: 'T',
    rating: 5,
    comment: 'Dạ cho em hỏi là bản đã kích hoạt thì bị lỗi so với chưa kích hoạt k ạ',
    tags: [
      'Hiệu năng Siêu mạnh mẽ',
      'Thời lượng pin Cực khủng',
      'Chất lượng camera Chụp đẹp, chuyên nghiệp',
    ],
    time: '6 tháng trước',
  },
  {
    name: 'Nhan',
    initials: 'N',
    rating: 5,
    comment: 'Rất hài lòng!',
    tags: [],
    time: '8 tháng trước',
  },
  {
    name: 'Lê Hoàng',
    initials: 'L',
    rating: 4,
    comment: 'Máy đẹp, hiệu năng ổn định nhưng hơi nóng khi chơi game lâu.',
    tags: ['Hiệu năng ổn', 'Thiết kế đẹp'],
    time: '3 tháng trước',
  },
  {
    name: 'Nguyễn Thị Mai',
    initials: 'M',
    rating: 3,
    comment: 'Chất lượng camera chưa đúng kỳ vọng, pin dùng được 1 ngày.',
    tags: ['Camera trung bình', 'Pin tạm ổn'],
    time: '2 tháng trước',
  },
  {
    name: 'Phạm Văn Bình',
    initials: 'B',
    rating: 2,
    comment: 'Mua về được 1 tuần thì máy bị đơ, phải mang bảo hành.',
    tags: ['Hiệu năng kém', 'Lỗi phần mềm'],
    time: '1 tháng trước',
  },
];
const getFilteredReviews = () => {
  switch (filter) {
    case 'Có hình ảnh':
      return reviews.filter((r) => r.hasImage);
    case 'Đã mua hàng':
      return reviews.filter((r) => r.purchased);
    case '5 sao':
    case '4 sao':
    case '3 sao':
    case '2 sao':
    case '1 sao':
      return reviews.filter((r) => r.rating === parseInt(filter));
    default:
      return reviews;
  }
};

const filteredReviews = getFilteredReviews();
const displayedReviews = showAllReviews ? filteredReviews : filteredReviews.slice(0, 3);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/group-route/${id}`)
      .then((res) => {
        const data = res.data;        
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
    
    setSuccess(true); // Nếu chưa đăng nhập, hiển thị thông báo lỗi
    // Tắt thông báo sau 3 giây
    setTimeout(() => {
      setSuccess(false); // Ẩn thông báo sau 3 giây
    }, 3000);
    try {
      await axios.post("http://localhost:5000/api/cart/add", {
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
  const { id_color, id_ram } = selectedProduct;

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
  
   const isDisabled = quantity > selectedProduct.quantity;
  console.log(selectedProduct?.name_category_brand)
  return (
    
    <div>
   <TopHeadBar
  searchText=""
  categoryName={selectedProduct?.name_category_product}
  brandName={selectedProduct?.name_category_brand}
  productname={selectedProduct?.name_group_product}
/>

    <div className="Product-detail-content">
    <div className="product-detail">
      
      <Container fluid>
        {showBuyNowError && (
  <div className="error-message" style={{width: "350px", left: "75%", backgroundColor: "#dc3545" }}>
    <p>Vui lòng đăng nhập để mua ngay!</p>
  </div>
)}

              {/* Nơi bạn muốn hiển thị thông báo lớn */}
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
            <div className="price_compare">
           <h4>
              {selectedProduct.sale > 0 ? (
                <>
                  <span className="old-price">
                    {selectedProduct.price.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </span>{" "}
                  <span className="new-price">
                    {selectedProduct.saleprice.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </span>{" "}
                  <span className="sale-badge">Giảm {selectedProduct.sale}%</span>
                </>
              ) : (
                <span className="new-price">
                  {selectedProduct.price.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </span>
              )}
            
              {selectedProduct.quantity === 0 && (
                <span
                  className="sold-out-badge"
                  onClick={() => alert("Sản phẩm đã hết hàng!")}
                >
                  Hết hàng
                </span>
              )}
            </h4>
            
              <div onClick={() => setShowModal(true)}  style={{ cursor: "pointer" }}>
                    <svg id="Compare--Streamline-Carbon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" height="20" width="20">
                      <desc>
                        Compare Streamline Icon: https://streamlinehq.com
                      </desc>
                      <defs></defs>
                      <title>compare</title>
                      <path d="M17.5 3.75H11.25V2.5a1.25 1.25 0 0 0 -1.25 -1.25H2.5a1.25 1.25 0 0 0 -1.25 1.25v12.5a1.25 1.25 0 0 0 1.25 1.25h6.25v1.25a1.25 1.25 0 0 0 1.25 1.25h7.5a1.25 1.25 0 0 0 1.25 -1.25V5a1.25 1.25 0 0 0 -1.25 -1.25ZM2.5 9.375h3.85625l-1.6125 1.61875L5.625 11.875l3.125 -3.125 -3.125 -3.125 -0.88125 0.88125L6.35625 8.125H2.5V2.5h7.5v12.5H2.5Zm7.5 8.125v-1.25a1.25 1.25 0 0 0 1.25 -1.25V5h6.25v5.625h-3.85625l1.6125 -1.61875L14.375 8.125l-3.125 3.125 3.125 3.125 0.88125 -0.88125L13.643749999999999 11.875H17.5v5.625Z" fill="#0000ff" stroke-width="0.625"></path>
                      <path id="_Transparent_Rectangle_" d="M0 0h20v20H0Z" fill="none" stroke-width="0.625"></path>
                    </svg>
                <p>So sánh</p>
                
              </div>
            </div>
        {showModal && (
            <CompareModal
              onClose={() => setShowModal(false)}
              selected={compareSelected}
              setSelected={setCompareSelected}
              currentGroupId={selectedProduct.id_group_product}
              currentCategoryId={selectedProduct.name_category_product} // ✅ thêm dòng này
            />
          )}


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
                    !isDisabled ? (
                      <Button className="cart-btn" onClick={handleAddToCart}>
                        <CartPlus className="me-2" /> Thêm vào giỏ hàng
                      </Button>
                    ) : (
                      <Button className="cart-btn btn-disabled" disabled>
                        <CartPlus className="me-2" /> Thêm vào giỏ hàng
                      </Button>
                    )
                  ) : (
                    !isDisabled ? (
                      <Button className="cart-btn">
                        <CartPlus className="me-2" /> Thêm vào giỏ hàng
                      </Button>
                    ) : (
                      <Button className="cart-btn btn-disabled" disabled>
                        <CartPlus className="me-2" /> Thêm vào giỏ hàng
                      </Button>
                    )
                  )
                ) : (
                  !isDisabled ? (
                    <Button className="cart-btn" onClick={handleAddToCartFaile}>
                      <CartPlus className="me-2" /> Thêm vào giỏ hàng
                    </Button>
                  ) : (
                    <Button className="cart-btn btn-disabled" disabled>
                      <CartPlus className="me-2" /> Thêm vào giỏ hàng
                    </Button>
                  )
                )}
              </Col>
            
            </Row>
            <div className="d-grid gap-2 mb-4">
              {selectedProduct.quantity === 0 || selectedProduct.quantity < quantity  ? (
                <Button
                className="buy-btn"
                size="lg"
                onClick={handleBuyNow}
               style={{opacity: "0.5", pointerEvents: "none" }}
              >
                <BagCheck className="me-2" /> Mua ngay
              </Button>
            ):(
                <Button
                className="buy-btn"
                size="lg"
                onClick={handleBuyNow}
              >
                <BagCheck className="me-2" /> Mua ngay
              </Button>   
            )}
              
              
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
                <div dangerouslySetInnerHTML={{ __html: selectedProduct.content }} />
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

       <Row className="mt-5 mb-5 position-relative"></Row>
       <ProductReview productId={selectedProduct.id_group_product} />
        <Row className="mt-5 mb-5 position-relative"></Row>

{/* Hoi dap */}
<QnASection
  nameuser={user.name}
  avataruser={user.avatar}
  roleuser={user.role}
  id_group_product={selectedProduct.id_group_product}
/>


           

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
