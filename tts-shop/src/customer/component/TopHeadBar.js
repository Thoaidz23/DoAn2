import React from "react";
import { Link } from "react-router-dom";

function TopHeadBar({ searchText, categoryName }) {
  return (
    <div className="container-detail_bar pt-2">
      <div className="container d-flex align-items-center gap-2">
        <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
          <i className="bi bi-house-door-fill"></i> Trang chủ
        </Link>
        <i className="bi bi-chevron-right breadcrumb-icon"></i>
        <p className="mb-0">{searchText || categoryName}</p>
      </div>
    </div>
  );
}

export default TopHeadBar;
