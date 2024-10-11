import { useLocation, useParams } from "react-router-dom";
import {
  CalendarOutlined,
  MailOutlined,
  SendOutlined,
} from "@ant-design/icons";
import { Menu, MenuProps, Layout } from "antd";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const { Sider } = Layout;
function SideMenu() {
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(false);

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
          to={`/module-configuration/emails/${survey_uid}/schedules`}
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
          to={`/module-configuration/emails/${survey_uid}/manual`}
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
          to={`/module-configuration/emails/${survey_uid}/templates`}
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

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      theme="light"
    >
      <Menu
        onClick={onClick}
        selectedKeys={[currentKey]}
        mode="inline"
        items={items}
      />
    </Sider>
  );
}

export default SideMenu;
