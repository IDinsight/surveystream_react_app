import { SelectOutlined } from "@ant-design/icons";

interface IDescriptionDocsLinkProps {
  link: string;
  text?: string;
}

function DescriptionDocsLink({ link, text }: IDescriptionDocsLinkProps) {
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

export default DescriptionDocsLink;
