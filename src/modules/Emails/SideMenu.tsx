import { useLocation, useParams } from "react-router-dom";
import {
  CalendarOutlined,
  MailOutlined,
  SendOutlined,
} from "@ant-design/icons";

import { Menu, MenuProps } from "antd";

import { useEffect, useState } from "react";
import {
  IconWrapper,
  MenuItem,
  SideMenuWrapper,
} from "../../shared/SideMenu.styled";

function SideMenu() {
  const location = useLocation();

  const { survey_uid } = useParams<{ survey_uid?: string }>() ?? {
    survey_uid: "",
  };
  const { tabId } = useParams<{ tabId?: string }>() ?? {
    tabId: "",
  };

  const isActive = (path: string) => {
    const currentPath = location.pathname;
    return path.includes(currentPath) ? "active" : "";
  };

  const items: MenuProps["items"] = [
    {
      label: (
        <MenuItem
          className={
            isActive(`/module-configuration/emails/${survey_uid}/schedules`) ||
            isActive(`/module-configuration/emails/${survey_uid}`)
          }
          to={`/module-configuration/emails/${survey_uid}/schedules`}
        >
          <IconWrapper>
            <CalendarOutlined />
          </IconWrapper>
          Email Schedules
        </MenuItem>
      ),
      key: "emailSchedules",
    },
    {
      label: (
        <MenuItem
          className={`${isActive(
            `/module-configuration/emails/${survey_uid}/manual`
          )}`}
          to={`/module-configuration/emails/${survey_uid}/manual`}
        >
          <IconWrapper>
            <SendOutlined />
          </IconWrapper>
          Manual Triggers
        </MenuItem>
      ),
      key: "manualTriggers",
    },
    {
      label: (
        <MenuItem
          className={`${isActive(
            `/module-configuration/emails/${survey_uid}/templates`
          )}`}
          to={`/module-configuration/emails/${survey_uid}/templates`}
        >
          <IconWrapper>
            <MailOutlined />
          </IconWrapper>
          Email Templates
        </MenuItem>
      ),
      key: "emailTemplates",
    },
  ];
  const [current, setCurrent] = useState("mail");
  const [openKeys, setOpenKeys] = useState<string[]>([]);

  const onClick: MenuProps["onClick"] = (e) => {
    setCurrent(e.key);
  };

  const getPossibleKey = () => {
    const path = location.pathname;
    if (path.includes("/manual")) return "manualTriggers";
    if (path.includes("/schedules")) return "emailSchedules";

    return "schedules";
  };

  useEffect(() => {
    const key: string = getPossibleKey();
    setOpenKeys([key]);
  }, [setOpenKeys]);

  return (
    <SideMenuWrapper>
      <Menu
        onClick={onClick}
        selectedKeys={[current]}
        openKeys={openKeys}
        onOpenChange={(key) => setOpenKeys(key)}
        mode="inline"
        items={items}
      />
    </SideMenuWrapper>
  );
}

export default SideMenu;
