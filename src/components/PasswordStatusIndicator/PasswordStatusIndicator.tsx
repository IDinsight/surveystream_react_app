import classNames from "classnames";
import { CheckCircleFilled } from "@ant-design/icons";

function PasswordStatusIndicator({
  text,
  success,
}: {
  text: string;
  success: boolean;
}) {
  return (
    <div
      className={classNames("flex items-center text-[#00000040] h-[22px]", {
        "text-[#52C41A]": success === true,
      })}
    >
      <CheckCircleFilled className="text-[14px]" />
      <span className="ml-[5px] text-[12px] leading-[22px">{text}</span>
    </div>
  );
}

export default PasswordStatusIndicator;
