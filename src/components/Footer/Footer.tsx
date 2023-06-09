import React from "react";

function Footer() {
  return (
    <footer
      className="flex h-[44px] bg-geekblue-9 justify-center items-center"
      style={{ position: "fixed", bottom: 0, width: "100%" }}
    >
      <p className="font-inter font-normal text-sm leading-[22px] text-gray-1">
        IDinsight 2023 &#169;
      </p>
    </footer>
  );
}

export default Footer;
