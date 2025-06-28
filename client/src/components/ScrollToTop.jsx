// ScrollToTop.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    document.body.scrollTo(0, 0); // Scrolls to top-left corner
  }, [pathname]);

  return null;
};

export default ScrollToTop;
