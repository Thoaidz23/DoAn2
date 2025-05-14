import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/footer.scss";
import 'bootstrap/dist/css/bootstrap.min.css';


function Footer() {
  const [footerData, setFooterData] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/footer")
      .then((res) => {
        if (Array.isArray(res.data)) {
          setFooterData(res.data);
        } else {
          setFooterData([res.data]); // Fallback nếu API chỉ trả 1 object
        }
      })
      .catch((err) => {
        console.error("Lỗi khi lấy footer:", err);
      });
  }, []);

  return (
    <footer className="footer">
      <div className="container-footer">
        <div className="footer-row">
          {footerData.map((item) => (
            <div className="footer-col" key={item.id_footer}>
              <h5>{item.title}</h5>
              <div
                className="footer-content"
                dangerouslySetInnerHTML={{ __html: item.content }}
              />
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}

export default Footer;