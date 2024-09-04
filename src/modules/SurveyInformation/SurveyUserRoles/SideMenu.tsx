import { useLocation, useParams } from "react-router-dom";
import { TeamOutlined, ApartmentOutlined } from "@ant-design/icons";

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
            isActive(`/survey-information/survey-roles/roles/${survey_uid}`) ||
            isActive(
              `/survey-information/survey-roles/roles/add/${survey_uid}`
            ) ||
            isActive(
              `/survey-information/survey-roles/roles/edit/${survey_uid}`
            ) ||
            isActive(`/survey-information/survey-roles/hierarchy/${survey_uid}`)
          }`}
          to={`/survey-information/survey-roles/roles/${survey_uid}`}
        >
          <IconWrapper>
            <ApartmentOutlined />
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
            isActive(`/survey-information/survey-users/users/${survey_uid}`) ||
            isActive(`/survey-information/survey-users/add/${survey_uid}`) ||
            isActive(`/survey-information/survey-users/edit/${survey_uid}`)
          }`}
          to={`/survey-information/survey-users/users/${survey_uid}`}
        >
          <IconWrapper>
            <TeamOutlined />
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
    if (path.includes("survey-roles/hierarchy/")) return "surveyRolesHierarchy";
    if (path.includes("survey-roles/roles/")) return "surveyRoles";
    if (path.includes("survey-users/")) return "surveyUsers";

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
