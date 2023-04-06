import { Button } from "antd";

function FooterBar() {
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "60px",
        backgroundColor: "#fff",
        paddingBottom: "10px",
        borderTop: "1px solid rgb(242, 242, 242)",
        zIndex: 9,
      }}
    >
      <Button
        style={{
          marginTop: 20,
          marginLeft: 315,
          float: "left",
          fontFamily: "Inter",
        }}
      >
        Save
      </Button>
      <Button
        style={{
          margin: 20,
          marginLeft: "55%",
          backgroundColor: "#597EF7",
          fontFamily: "Inter",
        }}
        type="primary"
      >
        Continue
      </Button>
    </div>
  );
}
export default FooterBar;
