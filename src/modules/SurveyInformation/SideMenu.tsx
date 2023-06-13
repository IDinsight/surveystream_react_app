import { useLocation, useParams } from "react-router-dom";
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
  const { survey_uid } = useParams<{ survey_uid?: string }>() ?? {
    survey_uid: "",
  };
  const isActive = (path: string) => {
    const currentPath = location.pathname;
    return path == currentPath ? "active" : "";
  };

  const items: MenuProps["items"] = [
    {
      label: (
        <MenuItem
          to={`/survey-information/survey-cto-information/${survey_uid}`}
          className={
            isActive(
              `/survey-information/survey-cto-information/${survey_uid}`
            ) || isActive("/survey-information/")
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
            isActive(
              `/survey-information/field-supervisor-roles/${survey_uid}`
            ) ||
            isActive(
              `/survey-information/field-supervisor-roles/add/${survey_uid}`
            ) ||
            isActive(
              `/survey-information/field-supervisor-roles/hierarchy/${survey_uid}`
            )
          }`}
          to={`/survey-information/field-supervisor-roles/add/${survey_uid}`}
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
                `/survey-information/field-supervisor-roles/add/${survey_uid}`
              )}
              to={`/survey-information/field-supervisor-roles/add/${survey_uid}`}
            >
              <IconWrapper>
                <UsergroupAddOutlined />
              </IconWrapper>
              Add Roles
            </MenuItem>
          ),
          key: "surveyFieldSupervisorRolesAdd",
        },
        {
          label: (
            <MenuItem
              className={isActive(
                `/survey-information/field-supervisor-roles/hierarchy/${survey_uid}`
              )}
              to={`/survey-information/field-supervisor-roles/hierarchy/${survey_uid}`}
            >
              <IconWrapper>
                <ApartmentOutlined />
              </IconWrapper>
              Define role Hierarchy
            </MenuItem>
          ),
          key: "surveyFieldSupervisorRolesHierarchy",
        },
      ],
    },
    {
      label: (
        <MenuItem
          className={isActive(
            `/survey-information/survey-location/${survey_uid}`
          )}
          to="#"
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
          className={isActive(`/survey-information/webapp-users/${survey_uid}`)}
          to="#"
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
          className={isActive(`/survey-information/enumerators/${survey_uid}`)}
          to="#"
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
        <MenuItem
          className={isActive(`/survey-information/targets/${survey_uid}`)}
          to="#"
        >
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
          to={`/survey-information/survey-cto-questions/${survey_uid}`}
          className={isActive(
            `/survey-information/survey-cto-questions/${survey_uid}`
          )}
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
