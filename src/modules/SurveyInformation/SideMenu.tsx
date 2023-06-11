import { useLocation } from "react-router-dom";
import {
  ApartmentOutlined,
  CalendarOutlined,
  CompassOutlined,
  NumberOutlined,
  ProfileOutlined,
  ShareAltOutlined,
  UnorderedListOutlined,
  UserOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import {
  SideMenuWrapper,
  MenuItem,
  IconWrapper,
} from "../../shared/SideMenu.styled";
import { Menu, MenuProps } from "antd";

import { useState } from "react";

function SideMenu() {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path ? "active" : "";
  };

  const items: MenuProps["items"] = [
    {
      label: (
        <MenuItem
          href="/survey-information/survey-cto-information"
          className={
            isActive("/survey-information/survey-cto-information") ||
            isActive("/survey-information/")
          }
        >
          <IconWrapper>
            <UnorderedListOutlined />
          </IconWrapper>
          SurveyCTO information
        </MenuItem>
      ),
      key: "surveyInformation",
    },

    {
      label: (
        <MenuItem
          className={`${
            isActive("/survey-information/field-supervisor-roles") ||
            isActive("/survey-information/field-supervisor-roles/add") ||
            isActive("/survey-information/field-supervisor-roles/hierarchy")
          }`}
          href="/survey-information/field-supervisor-roles"
        >
          <IconWrapper>
            <CalendarOutlined />
          </IconWrapper>
          Field supervisor roles
        </MenuItem>
      ),
      key: "surveyFieldSupervisorRoles",
      children: [
        {
          label: (
            <MenuItem
              className={isActive(
                "/survey-information/field-supervisor-roles/add-roles"
              )}
              href="/survey-information/field-supervisor-roles/add"
            >
              <IconWrapper>
                <UsergroupAddOutlined />
              </IconWrapper>
              Roles
            </MenuItem>
          ),
          key: "surveyFieldSupervisorRolesAdd",
        },
        {
          label: (
            <MenuItem
              className={isActive(
                "/survey-information/field-supervisor-roles/hierarchy"
              )}
              href="/survey-information/field-supervisor-roles/hierarchy"
            >
              <IconWrapper>
                <ApartmentOutlined />
              </IconWrapper>
              Role Hierarchy
            </MenuItem>
          ),
          key: "surveyFieldSupervisorRolesHierarchy",
        },
      ],
    },
    {
      label: (
        <MenuItem
          className={isActive("/survey-information/survey-location")}
          href="#"
        >
          <IconWrapper>
            <CompassOutlined />
          </IconWrapper>
          Survey location
        </MenuItem>
      ),
      key: "surveyLocation",
      disabled: true,
    },
    {
      label: (
        <MenuItem
          className={isActive("/survey-information/webapp-users")}
          href="#"
        >
          <IconWrapper>
            <UserOutlined />
          </IconWrapper>
          WebApp Users
        </MenuItem>
      ),
      key: "surveyWebAppUsers",
      disabled: true,
    },
    {
      label: (
        <MenuItem
          className={isActive("/survey-information/enumerators")}
          href="#"
        >
          <IconWrapper>
            <ProfileOutlined />
          </IconWrapper>
          Enumerators
        </MenuItem>
      ),
      key: "surveyEnumerators",
      disabled: true,
    },
    {
      label: (
        <MenuItem className={isActive("/survey-information/targets")} href="#">
          <IconWrapper>
            <NumberOutlined />
          </IconWrapper>
          Targets
        </MenuItem>
      ),
      key: "surveyTargets",
      disabled: true,
    },
    {
      label: (
        <MenuItem
          href="/survey-information/survey-cto-questions"
          className={isActive("/survey-information/survey-cto-questions")}
        >
          <IconWrapper>
            <ShareAltOutlined />
          </IconWrapper>
          SurveyCTO Questions
        </MenuItem>
      ),
      key: "surveyCTOQuestions",
    },
  ];
  const [current, setCurrent] = useState("mail");

  const onClick: MenuProps["onClick"] = (e) => {
    console.log("click ", e);
    setCurrent(e.key);
  };

  return (
    <SideMenuWrapper>
      <Menu
        onClick={onClick}
        selectedKeys={[current]}
        mode="inline"
        items={items}
      />
    </SideMenuWrapper>
  );
}

export default SideMenu;
