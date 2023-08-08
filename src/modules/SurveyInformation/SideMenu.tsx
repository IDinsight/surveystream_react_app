import { useLocation, useParams } from "react-router-dom";
import {
  ApartmentOutlined,
  CalendarOutlined,
  CompassOutlined,
  FormOutlined,
  NumberOutlined,
  PlusSquareOutlined,
  ProfileOutlined,
  SelectOutlined,
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
  const { form_uid } = useParams<{ form_uid?: string }>() ?? {
    form_uid: "",
  };
  const isActive = (path: string) => {
    const currentPath = location.pathname;
    return path.includes(currentPath) ? "active" : "";
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
          className={`${
            isActive(`/survey-information/location/add/${survey_uid}`) ||
            isActive(`/survey-information/location/hierarchy/${survey_uid}`) ||
            isActive(`/survey-information/location/upload/${survey_uid}`)
          }`}
          to={`/survey-information/location/add/${survey_uid}`}
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
              className={isActive(
                `/survey-information/location/add/${survey_uid}`
              )}
              to={`/survey-information/location/add/${survey_uid}`}
            >
              <IconWrapper>
                <PlusSquareOutlined />
              </IconWrapper>
              Add location types
            </MenuItem>
          ),
          key: "surveyLocationAdd",
        },
        {
          label: (
            <MenuItem
              className={isActive(
                `/survey-information/location/hierarchy/${survey_uid}`
              )}
              to={`/survey-information/location/hierarchy/${survey_uid}`}
            >
              <IconWrapper>
                <ApartmentOutlined />
              </IconWrapper>
              Location type hierarchy
            </MenuItem>
          ),
          key: "surveyLocationHierarchy",
        },
        {
          label: (
            <MenuItem
              className={isActive(
                `/survey-information/location/upload/${survey_uid}`
              )}
              to={`/survey-information/location/upload/${survey_uid}`}
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
          className={`${
            isActive(`/survey-information/enumerators/upload/${survey_uid}`) ||
            isActive(`/survey-information/enumerators/map/${survey_uid}`) ||
            isActive(`/survey-information/enumerators/manage/${survey_uid}`)
          }`}
          to={`/survey-information/enumerators/upload/${survey_uid}`}
        >
          <IconWrapper>
            <ProfileOutlined />
          </IconWrapper>
          Enumerators
        </MenuItem>
      ),
      key: "surveyEnumerators",
      children: [
        {
          label: (
            <MenuItem
              className={isActive(
                `/survey-information/enumerators/upload/${survey_uid}`
              )}
              to={`/survey-information/enumerators/upload/${survey_uid}`}
            >
              <IconWrapper>
                <UploadOutlined />
              </IconWrapper>
              Upload csv
            </MenuItem>
          ),
          key: "surveyEnumeratorsUpload",
        },
        {
          label: (
            <MenuItem
              className={isActive(
                `/survey-information/enumerators/map/${survey_uid}`
              )}
              to={`/survey-information/enumerators/map/${survey_uid}`}
            >
              <IconWrapper>
                <SelectOutlined />
              </IconWrapper>
              Map csv columns
            </MenuItem>
          ),
          key: "surveyEnumeratorsMap",
        },
        {
          label: (
            <MenuItem
              className={isActive(
                `/survey-information/enumerators/manage/${survey_uid}`
              )}
              to={`/survey-information/enumerators/manage/${survey_uid}`}
            >
              <IconWrapper>
                <FormOutlined />
              </IconWrapper>
              Manage enumerators
            </MenuItem>
          ),
          key: "surveyEnumeratorsManage",
        },
      ],
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
          to={`/survey-information/survey-cto-questions/${survey_uid}/${form_uid}`}
          className={isActive(
            `/survey-information/survey-cto-questions/${survey_uid}/${form_uid}`
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
