import { useState, useEffect } from "react";

export default function useWindowDimensions() {
  const getWindowDimensions = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    return {
      width,
      height,
    };
  };

  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions(getWindowDimensions());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowDimensions;
}
