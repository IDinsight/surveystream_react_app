import { useLocation, useParams } from "react-router-dom";
import { ContactsOutlined, ShareAltOutlined } from "@ant-design/icons";

import { Menu, MenuProps } from "antd";

import { useEffect, useState } from "react";
import { useAppDispatch } from "../../../redux/hooks";
import {
  IconWrapper,
  MenuItem,
  SideMenuWrapper,
} from "../../../shared/SideMenu.styled";

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
          className={`${
            isActive(`/survey-information/user-roles/${survey_uid}`) ||
            isActive(`/survey-information/user-roles/roles/${survey_uid}`) ||
            isActive(`/survey-information/user-roles/add-role/${survey_uid}`) ||
            isActive(`/survey-information/user-roles/edit-role/${survey_uid}`)
          }`}
          to={`/survey-information/user-roles/roles/${survey_uid}`}
        >
          <IconWrapper>
            <ContactsOutlined />
          </IconWrapper>
          Roles
        </MenuItem>
      ),
      key: "surveyRoles",
    },
    {
      label: (
        <MenuItem
          className={`${
            isActive(`/survey-information/user-roles/users/${survey_uid}`) ||
            isActive(`/survey-information/user-roles/add-user/${survey_uid}`) ||
            isActive(`/survey-information/user-roles/edit-user/${survey_uid}`)
          }`}
          to={`/survey-information/user-roles/users/${survey_uid}`}
        >
          <IconWrapper>
            <ShareAltOutlined />
          </IconWrapper>
          Users
        </MenuItem>
      ),
      key: "surveyUsers",
    },
  ];
  const [current, setCurrent] = useState("mail");
  const [openKeys, setOpenKeys] = useState<string[]>([]);

  const onClick: MenuProps["onClick"] = (e) => {
    setCurrent(e.key);
  };

  const getPossibleKey = () => {
    const path = location.pathname;
    if (path.includes("user-roles/")) return "surveyFieldSupervisorRoles";

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
