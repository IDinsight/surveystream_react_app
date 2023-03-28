import "./FullScreenLoader.css";

const FullScreenLoader = () => {
  return (
    <div
      className="flex justify-center items-center absolute inset-0 "
      style={{ backgroundColor: "#0003" }}
    >
      <div className="loader">
        <div className="circle c1"></div>
        <div className="circle c2"></div>
        <div className="circle c3"></div>
        <div className="circle c4"></div>
      </div>
    </div>
  );
};

export default FullScreenLoader;
