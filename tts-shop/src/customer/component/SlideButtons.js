// src/component/SlideButtons.jsx
import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "../styles/slideButtons.scss"; // tuỳ chọn nếu muốn custom CSS

function SlideButtons({ onPrev, onNext }) {
  return (
    <>
      <div className="slide-btn prev-btn" onClick={onPrev}>
        <FaChevronLeft />
      </div>
      <div className="slide-btn next-btn" onClick={onNext}>
        <FaChevronRight />
      </div>
    </>
  );
}

export default SlideButtons;
