import React from "react";
import "../styles/footer.scss";
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaFacebook, FaInstagram } from 'react-icons/fa';
import { SiZalo } from 'react-icons/si';

function Footer() {
  return (
    <footer className="footer">
      <div className="container-footer">
        <div className="footer-row">
          <div className="footer-col">
            <h5>TTS SHOP</h5>
            <p>Địa chỉ: Cần Thơ</p>
            <p>Email: ttshop@gmail.com</p>
          </div>
          <div className="footer-col">
            <h5>Thông tin và chính sách</h5>
            <p>Mua hàng và thanh toán Online</p>
            <p>Chính sách giao hàng</p>
          </div>
          <div className="footer-col">
            <h5>Dịch vụ và thông tin khác</h5>
            <p>Khách hàng doanh nghiệp (B2B)</p>
            <p>Ưu đãi thanh toán</p>
          </div>
          <div className="footer-col">
            <h5>Kết nối với Chúng tôi</h5>
            <div className="social-icons d-flex gap-3 mt-2">
              <a href="https://zalo.me" target="_blank" rel="noopener noreferrer">
                <SiZalo size={24} color="#0088cc" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <FaFacebook size={24} color="#4267B2" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <FaInstagram size={24} color="#C13584" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
