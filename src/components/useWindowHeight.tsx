import { useEffect, useState } from "react";

export default function useWindowHeight() {
  const [height, setHeight] = useState(window.innerHeight - 100);
  const setWindowHeight = () => {
    setHeight(window.innerHeight - 100);
  };

  useEffect(() => {
    setWindowHeight();
    window.addEventListener("resize", setWindowHeight);
    return () => {
      window.removeEventListener("resize", setWindowHeight);
    };
  }, []);

  return height;
}
