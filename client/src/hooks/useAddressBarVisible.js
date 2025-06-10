import { useEffect, useState } from "react";

const useAddressBarVisible = () => {
  const [addressBarVisible, setAddressBarVisible] = useState(true);
  const [initialHeight, setInitialHeight] = useState(window.innerHeight);

  useEffect(() => {
    const handleResize = () => {
      const currentHeight = window.innerHeight;
      setAddressBarVisible(currentHeight < initialHeight - 50); // 50px threshold
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleResize); // optional

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleResize);
    };
  }, [initialHeight]);

  return addressBarVisible;
};

export default useAddressBarVisible;