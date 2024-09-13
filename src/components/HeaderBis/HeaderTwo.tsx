import {
  AppstoreAddOutlined,
  BookFilled,
  HomeFilled,
  MailOutlined,
} from "@ant-design/icons";

function HeaderTwo() {
  return (
    <div className="nav-menu flex">
      <div className="w-32 bg-geekblue-5">
        <HomeFilled className="flex items-center !text-[16px]" />
        <span>Home</span>
      </div>
      <div className="min-w-32">
        <BookFilled className="flex items-center !text-[16px]" />
        <span>
          <a
            target="_blank"
            rel="noreferrer"
            href="https://docs.surveystream.idinsight.io"
          >
            Documentation
          </a>
        </span>
      </div>
      <div className="min-w-32">
        <MailOutlined className="flex items-center !text-[16px]" />
        <span>
          <a
            target="_blank"
            rel="noreferrer"
            href="https://docs.google.com/forms/d/e/1FAIpQLSdNG2C4Dmtt4NiJGm05VxyAUakvfS8o_Hkgdc8vJhl3eKR1_g/viewform"
          >
            Contact Us
          </a>
        </span>
      </div>
      <div className="min-w-32">
        <AppstoreAddOutlined className="flex items-center !text-[16px]" />
        <span>
          <a
            target="_blank"
            rel="noreferrer"
            href="https://docs.google.com/spreadsheets/d/1WbmebjDLrbo6c15KZzbu1rkvNHlnBAy_p-nREz3OjNE/"
          >
            Roadmap
          </a>
        </span>
      </div>
    </div>
  );
}

export default HeaderTwo;
