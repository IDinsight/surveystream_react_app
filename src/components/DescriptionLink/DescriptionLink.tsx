import { SelectOutlined } from "@ant-design/icons";

interface IDescriptionLinkProps {
  link: string;
  text?: string;
}

function DescriptionLink({ link, text }: IDescriptionLinkProps) {
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        color: "#2F80ED",
        fontSize: "14px",
        fontFamily: '"Lato", sans-serif',
      }}
    >
      {text ? text : "Learn more"}{" "}
      <SelectOutlined
        rotate={90}
        style={{
          marginLeft: "3px",
          padding: "0px",
          fontSize: "15px",
        }}
      />{" "}
    </a>
  );
}

export default DescriptionLink;
