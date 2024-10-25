import { useLocation, useParams } from "react-router-dom";
import {
  CalendarOutlined,
  MailOutlined,
  SendOutlined,
  RightOutlined,
  LeftOutlined,
} from "@ant-design/icons";
import { Menu, MenuProps, Layout, Button } from "antd";
import { Link, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { StyledSlider } from "./Emails.styled";

const { Sider } = Layout;
function SideMenu() {
  const location = useLocation();

  const [searchParams, setSearchParams] = useSearchParams();
  const [collapsed, setCollapsed] = useState(
    searchParams.get("collapsed") === "true"
  );
  useEffect(() => {
    setSearchParams({ collapsed: collapsed + "" });
  }, [collapsed]);

  const { survey_uid } = useParams<{ survey_uid?: string }>() ?? {
    survey_uid: "",
  };

  const isActive = (path: string) => {
    const currentPath = location.pathname;
    return path.includes(currentPath) ? "active" : "";
  };

  const items: MenuProps["items"] = [
    {
      icon: <CalendarOutlined />,
      label: (
        <Link
          className={`${isActive(
            isActive(`/module-configuration/emails/${survey_uid}/schedules`) ||
              isActive(`/module-configuration/emails/${survey_uid}`)
          )}`}
          to={`/module-configuration/emails/${survey_uid}/schedules?collapsed=${collapsed}`}
        >
          Email Schedules
        </Link>
      ),
      key: "emailSchedules",
    },
    {
      icon: <SendOutlined />,
      label: (
        <Link
          className={`${isActive(
            `/module-configuration/emails/${survey_uid}/manual`
          )}`}
          to={`/module-configuration/emails/${survey_uid}/manual?collapsed=${collapsed}`}
        >
          Manual Triggers
        </Link>
      ),
      key: "manualTriggers",
    },
    {
      icon: <MailOutlined />,
      label: (
        <Link
          className={`${isActive(
            `/module-configuration/emails/${survey_uid}/templates`
          )}`}
          to={`/module-configuration/emails/${survey_uid}/templates?collapsed=${collapsed}`}
        >
          Email Templates
        </Link>
      ),
      key: "emailTemplates",
    },
  ];
  const [currentKey, setCurrentKey] = useState("emailSchedules");

  const onClick: MenuProps["onClick"] = (e) => {
    setCurrentKey(e.key);
  };

  const getCurrentKey = () => {
    const path = location.pathname;
    if (path.includes("/manual")) return "manualTriggers";
    if (path.includes("/schedules")) return "emailSchedules";
    if (path.includes("/templates")) return "emailTemplates";

    return "emailSchedules";
  };

  useEffect(() => {
    const key = getCurrentKey();
    setCurrentKey(key);
  }, []);

  const toggle = () => {
    setCollapsed(!collapsed);
  };

  return (
    <StyledSlider
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      theme="light"
      trigger={null}
    >
      <div className="my-sider-button-container">
        <Button
          type="text"
          color="primary"
          onClick={toggle}
          shape="circle"
          icon={collapsed ? <RightOutlined /> : <LeftOutlined />}
        />
      </div>
      <Menu
        onClick={onClick}
        selectedKeys={[currentKey]}
        mode="inline"
        items={items}
      />
    </StyledSlider>
  );
}

export default SideMenu;
