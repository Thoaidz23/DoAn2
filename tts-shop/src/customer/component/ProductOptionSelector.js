import React from "react";
import { Button, Form } from "react-bootstrap";
import "../styles/ProductOptionSelector.scss";

const ProductOptionSelector = ({ label, options, selected, onSelect }) => {
  return (
    <div className="mb-3">
      <Form.Label>{label}</Form.Label>
      <div className="d-flex gap-2 flex-wrap">
        {options.map((option, idx) => (
          <Button
            key={idx}
            variant="outline-secondary"
            className={`option-btn ${selected === option ? "selected" : ""}`}
            onClick={() => onSelect(option)}
          >
            {option}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default ProductOptionSelector;
