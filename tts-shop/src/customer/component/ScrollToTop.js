import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Cuộn về đầu trang nhanh hơn bằng cách sử dụng scroll trực tiếp
    window.scrollTo({ top: 0, behavior: 'instant' });  // 'instant' giúp cuộn nhanh
  }, [pathname]);

  return null;
};

export default ScrollToTop;
