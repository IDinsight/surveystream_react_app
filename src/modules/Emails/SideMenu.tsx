import { useLocation, useParams } from "react-router-dom";
import {
  CalendarOutlined,
  ContactsOutlined,
  MailFilled,
  ShareAltOutlined,
} from "@ant-design/icons";

import { Menu, MenuProps } from "antd";

import { useEffect, useState } from "react";
import { useAppDispatch } from "../../redux/hooks";
import {
  IconWrapper,
  MenuItem,
  SideMenuWrapper,
} from "../../shared/SideMenu.styled";

function SideMenu() {
  const location = useLocation();
  const dispatch = useAppDispatch();

  const { survey_uid } = useParams<{ survey_uid?: string }>() ?? {
    survey_uid: "",
  };

  const isActive = (path: string) => {
    const currentPath = location.pathname;
    return path.includes(currentPath) ? "active" : "";
  };

  const items: MenuProps["items"] = [
    {
      label: (
        <MenuItem
          className={`${isActive(
            `/module-configuration/emails/schedule/${survey_uid}` ||
              `/module-configuration/emails/${survey_uid}`
          )}`}
          to={`/module-configuration/emails/manual/${survey_uid}`}
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
            `/module-configuration/emails/manual/${survey_uid}`
          )}`}
          to={`/module-configuration/emails/manual/${survey_uid}`}
        >
          <IconWrapper>
            <MailFilled />
          </IconWrapper>
          Manual Triggers
        </MenuItem>
      ),
      key: "manualTriggers",
    },
  ];
  const [current, setCurrent] = useState("mail");
  const [openKeys, setOpenKeys] = useState<string[]>([]);

  const onClick: MenuProps["onClick"] = (e) => {
    setCurrent(e.key);
  };

  const getPossibleKey = () => {
    const path = location.pathname;
    if (path.includes("manual/")) return "manualTriggers";
    if (path.includes("schedules/")) return "emailSchedules";

    return "";
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
