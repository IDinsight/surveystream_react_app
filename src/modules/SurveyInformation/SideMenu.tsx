import { useLocation, useParams } from "react-router-dom";
import {
  ApartmentOutlined,
  CalendarOutlined,
  CompassOutlined,
  NumberOutlined,
  PlusSquareOutlined,
  ProfileOutlined,
  ShareAltOutlined,
  UnorderedListOutlined,
  UploadOutlined,
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
    const pathParts = currentPath.split("/");
    const middlePart =
      pathParts.length > 3 ? pathParts[3] : pathParts[pathParts.length - 1];
    return path.includes(middlePart) ? "active" : "";
  };

  const items: MenuProps["items"] = [
    {
      label: (
        <MenuItem
          to={`/survey-information/survey-cto-information/${survey_uid}`}
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
                "/survey-information/field-supervisor-roles/add"
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
                "/survey-information/field-supervisor-roles/hierarchy"
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
          className={`${
            isActive("/survey-information/location/add") ||
            isActive("/survey-information/location/hierarchy") ||
            isActive("/survey-information/location/upload")
          }`}
          to={`/survey-information/location/add`}
        >
          <IconWrapper>
            <CompassOutlined />
          </IconWrapper>
          Survey location
        </MenuItem>
      ),
      key: "surveyLocation",
      children: [
        {
          label: (
            <MenuItem
              className={isActive("/survey-information/location/add")}
              to={`/survey-information/location/add`}
            >
              <IconWrapper>
                <PlusSquareOutlined />
              </IconWrapper>
              Location labels
            </MenuItem>
          ),
          key: "surveyLocationAdd",
        },
        {
          label: (
            <MenuItem
              className={isActive("/survey-information/location/hierarchy")}
              to={`/survey-information/location/hierarchy`}
            >
              <IconWrapper>
                <ApartmentOutlined />
              </IconWrapper>
              Location hierarchy
            </MenuItem>
          ),
          key: "surveyLocationHierarchy",
        },
        {
          label: (
            <MenuItem
              className={isActive("/survey-information/location/upload")}
              to={`/survey-information/location/upload`}
            >
              <IconWrapper>
                <UploadOutlined />
              </IconWrapper>
              Upload locations
            </MenuItem>
          ),
          key: "surveyLocationUpload",
        },
      ],
    },
    {
      label: (
        <MenuItem
          className={isActive("/survey-information/webapp-users")}
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
          className={isActive("/survey-information/enumerators")}
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
        <MenuItem className={isActive("/survey-information/targets")} to="#">
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
