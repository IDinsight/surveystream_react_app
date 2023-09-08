import React from "react";
import DdLogo from "./../../assets/dd-logo.svg";

function Footer() {
  return (
    <footer
      className="flex h-[44px] bg-geekblue-9 justify-center items-center"
      style={{ position: "fixed", bottom: 0, width: "100%" }}
    >
      <p
        className="font-inter font-normal text-sm leading-[22px] text-gray-1"
        style={{ display: "flex", alignItems: "center" }}
      >
        <img src={DdLogo} style={{ marginLeft: "6px", height: "18px" }} />{" "}
        <span style={{ fontSize: "16px", marginLeft: "6px" }}>&#169;</span>
      </p>
    </footer>
  );
}

export default Footer;
