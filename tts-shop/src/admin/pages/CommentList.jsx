import React, { useContext } from "react";
import { useParams } from "react-router-dom"; // thêm dòng này
import { AuthContext } from "../../customer/context/AuthContext";
import AdminQnASection from "../../customer/component/QnASection";

const AdminQnAPage = () => {
  const { user } = useContext(AuthContext); // lấy thông tin người dùng
  const { id_group_product } = useParams(); // lấy id sản phẩm từ URL

  return (
    <div className=" mt-4\">
      <h3 className="text-center mb-4" style={{width:"1200px"}}>Quản lý hỏi đáp sản phẩm</h3>
      <AdminQnASection
        nameuser={user.name}
        roleuser={user.role}
        avataruser={user.avatar}
        id_group_product={id_group_product} // truyền đúng biến này
      />
    </div>
  );
};

export default AdminQnAPage;
