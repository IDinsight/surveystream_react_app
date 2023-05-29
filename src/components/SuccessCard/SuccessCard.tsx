import React from "react";
import { CheckCircleOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { Link } from "react-router-dom";

interface SuccessCardProps {
  heading: string;
  subheading: string;
  link: string;
  linktext: string;
}

function SuccessCard({
  heading,
  subheading,
  link,
  linktext,
}: SuccessCardProps) {
  return (
    <div
      className="flex flex-col items-center w-[400px] h-[362px]
      bg-gray-1 rounded-lg shadow-[0px_4px_4px_rgba(0,0,0,0.16)]"
    >
      <CheckCircleOutlined className="mt-[80px] text-[#52C41A] text-[63px]" />
      <p
        className="mt-7 mb-0 mx-[5px] font-inter not-italic
        font-semibold text-[18px] leading-[24px] text-[#000000E0]"
      >
        {heading}
      </p>
      <p
        className="mt-1 mb-6 font-inter not-italic font-semibold
        text-[14px] leading-[22px] min-h-[22px] text-[#00000073]"
      >
        {subheading}
      </p>
      <Link to={link || "/"}>
        <Button
          type="primary"
          size="large"
          className="font-inter not-italic font-semibold !text-[14px] leading-[22px]
            bg-geekblue-5 !rounded-md w-[148px]"
        >
          {linktext}
        </Button>
      </Link>
    </div>
  );
}

export default SuccessCard;
