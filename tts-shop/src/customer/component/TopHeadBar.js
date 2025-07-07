import React from "react";
import { Link } from "react-router-dom";

function TopHeadBar({ searchText, categoryName, brandName }) {
  return (
    <div className="container-detail_bar pt-2">
      <div className="container d-flex align-items-center gap-2">
        <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
          <i className="bi bi-house-door-fill" style={{ paddingBottom: "5px" }}></i> Trang chủ
        </Link>
      {searchText=== "" ? (
        <>
        {categoryName && (
          <>
            <i className="bi bi-chevron-right breadcrumb-icon"></i>
            <p className="mb-0" style={{ paddingBottom: "5px" }}>{categoryName}</p>
          </>
        )}

       {brandName && (
         <>
           <i className="bi bi-chevron-right breadcrumb-icon"></i>
           <p className="mb-0" style={{ paddingBottom: "5px" }}>{brandName}</p>
         </>
       )}
       </>
      ):(
        <>
          {searchText && (
          <>
            <i className="bi bi-chevron-right breadcrumb-icon"></i>
            <p className="mb-0" style={{ paddingBottom: "5px" }}>
              Kết quả tìm kiếm cho "<strong>{searchText}</strong>"
            </p>
          </>
        )}
     </>
      )}
        

        
      </div>
    </div>
  );
}

export default TopHeadBar;
