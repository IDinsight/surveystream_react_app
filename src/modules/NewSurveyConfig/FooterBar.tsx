import { Button } from "antd";

function FooterBar() {
  return (
    <div
      style={{
        display: "flex",
        width: "105%",
        marginLeft: "-1.55%",
        height: "60px",
        backgroundColor: "#fff",
        paddingBottom: "20px",
        borderTop: "1px solid rgb(242, 242, 242)",
        zIndex: 9,
      }}
    >
      <Button style={{ margin: 20, marginLeft: "25%", float: "left" }}>
        Save
      </Button>
      <Button
        style={{ margin: 20, marginLeft: "45%", backgroundColor: "#597EF7" }}
        type="primary"
      >
        Continue
      </Button>
    </div>
  );
}
export default FooterBar;
