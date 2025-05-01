import React from "react";
import { Button, Form } from "react-bootstrap";
import "../styles/ProductOptionSelector.scss";

// const ProductOptionSelector = ({ label, options, selected, onSelect }) => {
//   return (
//     <div className="mb-3">
//       <Form.Label>{label}</Form.Label>
//       <div className="d-flex gap-2 flex-wrap">
//       {options.map((option) => (
//           <Button
//             key={option.id}
//             variant={selected === option.id ? "secondary" : "outline-secondary"}
//             onClick={() => onSelect(option.id)}
//             className={`option-btn ${selected === option.id ? "selected" : ""}`}
//           >
//             {option.label}
//           </Button>
//         ))}

//       </div>
//     </div>
//   );
// };
const ProductOptionSelector = ({ label, options, selected, onSelect, disabledOptions = [] }) => {
  return (
    <div className="mb-3">
      <Form.Label>{label}</Form.Label>
      <div className="d-flex gap-2 flex-wrap">
        {options.map((option) => {
          const isDisabled = disabledOptions.includes(option.id);
          return (
            <Button
              key={option.id}
              className={`option-btn ${selected === option.id ? "selected" : ""}`}
              type="button"
              variant={selected === option.id ? "primary" : "outline-secondary"}
              name={label}
              value={option.id}
              disabled={isDisabled}
              onClick={() => !isDisabled && onSelect(option.id)}
            >
              {option.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
};



export default ProductOptionSelector;
