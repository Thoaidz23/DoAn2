import React from "react";
import { Link } from "react-router-dom";

function TopHeadBar({ searchText, categoryName, brandName ,productname ,categoryID, brandID,}) {
  return (
    <div className="container-detail_bar pt-2">
      <div className="container d-flex align-items-center gap-2">
        <a href="/" style={{ textDecoration: "none", color: "inherit" }}>
          <i className="bi bi-house-door-fill" style={{ paddingBottom: "5px" }}></i> Trang chủ
        </a>
        
      {searchText=== "" ? (
        <>
        {categoryName && (
          <>
            <i className="bi bi-chevron-right breadcrumb-icon"></i>
            <a href={`/SearchProduct?category=${categoryID}`} style={{ textDecoration: "none", color: "inherit" }}>
              <p className="mb-0" style={{ paddingBottom: "5px" }}>{categoryName}</p>
            </a>
          </>
        )}

       {brandName && (
         <>
           <i className="bi bi-chevron-right breadcrumb-icon"></i>
           <a href={`/SearchProduct?category=${categoryID}&brand=${brandID}`} style={{ textDecoration: "none", color: "inherit" }}>
              <p className="mb-0" style={{ paddingBottom: "5px" }}>{brandName}</p>
            </a>
         </>
       )}
       {productname && (
        <>
        <i className="bi bi-chevron-right breadcrumb-icon"></i>
        <p className="mb-0" style={{ paddingBottom: "5px" }}>{productname}</p>
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
