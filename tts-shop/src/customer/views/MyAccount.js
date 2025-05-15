import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import "../styles/MyAccount.scss";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "bootstrap-icons/font/bootstrap-icons.css";
import AccountBar from "../component/AccountBar";
import { AuthContext } from "../context/AuthContext";

function AccountOverview() {
  const [activeMenu, setActiveMenu] = useState("Tài khoản của bạn");
  const { user } = useContext(AuthContext);
  const [userInfo, setUserInfo] = useState(null);
  console.log(user )
  useEffect(() => {
    if (user && user.id) {
      const fetchUserInfo = async () => {
        try {
          const res = await axios.get(`http://localhost:5000/api/account/${user.id}`);
          setUserInfo(res.data);
        } catch (err) {
          console.error("Lỗi khi lấy thông tin người dùng:", err);
        }
      };

      fetchUserInfo();
    }
  }, [user]);

  // Trả về giao diện với thông tin tài khoản nếu có userInfo
  return (
    <div className="account-overview-container">
      <div className="container">
        <AccountBar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
        <div className="account-content p-4 bg-white shadow rounded-4">
          {userInfo ? (
            <>
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYsg3Tin2fFUDV0y54btyW_XrZpqXENGJUWw&s" alt="Avatar" className="avatar" />
              <div className="mb-3">
                <strong>Họ và tên:</strong> {userInfo.name}
              </div>
              <div className="mb-3">
                <strong>Email:</strong> {userInfo.email}
              </div>
              <div className="mb-3">
                <strong>Số điện thoại:</strong> {userInfo.phone}
              </div>
              <div className="mb-3">
                <strong>Địa chỉ:</strong> {userInfo.address}
              </div>
            </>
          ) : (
            <h1>Đang tải thông tin người dùng...</h1>
          )}
        </div>
      </div>
    </div>
  );
}

export default AccountOverview;