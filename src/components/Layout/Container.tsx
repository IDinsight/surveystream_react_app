import React, { ReactNode } from "react";
import { BackArrow, BackLink } from "../../shared/Nav.styled";

interface IContainer {
  children?: ReactNode;
}

const Container: React.FC<IContainer> = ({ children }) => (
  <>
    <div style={{ backgroundColor: "#FFFFFF" }}>
      <div
        style={{
          height: "50px",
          display: "flex",
          alignItems: "center",
          marginLeft: 24,
        }}
      >
        <BackLink onClick={() => console.log("Back")}>
          <BackArrow />
        </BackLink>
        <p
          style={{
            color: "#000",
            fontFamily: "Inter",
            fontSize: "20px",
            fontWeight: 500,
            lineHeight: "28px",
          }}
        >
          TKPI
        </p>
      </div>
    </div>
  </>
);

export default Container;
