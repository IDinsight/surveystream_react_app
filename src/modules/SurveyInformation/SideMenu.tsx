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
  PushpinOutlined,
  MobileOutlined,
  ShareAltOutlined,
  UnorderedListOutlined,
  UploadOutlined,
  UserOutlined,
  UsergroupAddOutlined,
  SwapOutlined,
  DatabaseOutlined,
  TeamOutlined,
  ControlOutlined,
  BuildOutlined,
  HomeOutlined,
  InsertRowRightOutlined,
} from "@ant-design/icons";
import {
  SideMenuWrapper,
  MenuItem,
  IconWrapper,
} from "../../shared/SideMenu.styled";
import { Menu, MenuProps } from "antd";

import { useEffect, useState } from "react";
import { getSurveyCTOForm } from "../../redux/surveyCTOInformation/surveyCTOInformationActions";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { RootState } from "../../redux/store";

function SideMenu() {
  const location = useLocation();
  const dispatch = useAppDispatch();

  const { survey_uid } = useParams<{ survey_uid?: string }>() ?? {
    survey_uid: "",
  };
  const { form_uid } = useParams<{ form_uid?: string }>() ?? {
    form_uid: "",
  };
  const { role_uid } = useParams<{ role_uid?: string }>() ?? {
    role_uid: "",
  };

  const { loading: isSurveyCTOFormLoading, surveyCTOForm } = useAppSelector(
    (state: RootState) => state.surveyCTOInformation
  );

  const [formUID, setFormUID] = useState<string>("");

  const isActive = (path: string) => {
    const currentPath = location.pathname;
    return path.includes(currentPath) ? "active" : "";
  };

  const items: MenuProps["items"] = [
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
            <PushpinOutlined />
          </IconWrapper>
          Locations
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
              Add/edit location levels
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
              Location level hierarchy
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
          className={`${
            isActive(`/survey-information/survey-roles/roles/${survey_uid}`) ||
            isActive(`/survey-information/survey-roles/add/${survey_uid}`) ||
            isActive(
              `/survey-information/survey-roles/edit/${survey_uid}/${role_uid}`
            ) ||
            isActive(
              `/survey-information/survey-roles/duplicate/${survey_uid}/${role_uid}`
            ) ||
            isActive(
              `/survey-information/survey-roles/hierarchy/${survey_uid}`
            ) ||
            isActive(`/survey-information/survey-users/users/${survey_uid}`) ||
            isActive(`/survey-information/survey-users/add/${survey_uid}`) ||
            isActive(`/survey-information/survey-users/edit/${survey_uid}`)
          }`}
          to={`/survey-information/survey-roles/roles/${survey_uid}`}
        >
          <IconWrapper>
            <UserOutlined />
          </IconWrapper>
          User and role management
        </MenuItem>
      ),
      key: "surveyRolesAndUsers",
      children: [
        {
          label: (
            <MenuItem
              className={`${
                isActive(
                  `/survey-information/survey-roles/roles/${survey_uid}`
                ) ||
                isActive(
                  `/survey-information/survey-roles/add/${survey_uid}`
                ) ||
                isActive(
                  `/survey-information/survey-roles/edit/${survey_uid}/${role_uid}`
                ) ||
                isActive(
                  `/survey-information/survey-roles/duplicate/${survey_uid}/${role_uid}`
                ) ||
                isActive(
                  `/survey-information/survey-roles/hierarchy/${survey_uid}`
                )
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
                isActive(
                  `/survey-information/survey-users/users/${survey_uid}`
                ) ||
                isActive(
                  `/survey-information/survey-users/add/${survey_uid}`
                ) ||
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
      ],
    },
    {
      label: (
        <MenuItem
          className={`${
            isActive(
              `/survey-information/survey-cto-information/${survey_uid}`
            ) ||
            isActive(
              `/survey-information/survey-cto-questions/${survey_uid}/${formUID}`
            )
          }`}
          to={`/survey-information/survey-cto-information/${survey_uid}`}
        >
          <IconWrapper>
            <MobileOutlined />
          </IconWrapper>
          SurveyCTO information
        </MenuItem>
      ),
      key: "surveyInformation",
      children: [
        {
          label: (
            <MenuItem
              className={isActive(
                `/survey-information/survey-cto-information/${survey_uid}`
              )}
              to={`/survey-information/survey-cto-information/${survey_uid}`}
            >
              <IconWrapper>
                <DatabaseOutlined />
              </IconWrapper>
              SurveyCTO main form
            </MenuItem>
          ),
          key: "surveyCTOInformation",
        },
        {
          label: (
            <MenuItem
              className={isActive(
                `/survey-information/survey-cto-questions/${survey_uid}/${formUID}`
              )}
              to={`/survey-information/survey-cto-questions/${survey_uid}/${formUID}`}
            >
              <IconWrapper>
                <ShareAltOutlined />
              </IconWrapper>
              SurveyCTO questions
            </MenuItem>
          ),
          key: "surveyCTOQuestions",
        },
      ],
    },
    {
      label: (
        <MenuItem
          className={`${
            isActive(
              `/survey-information/enumerators/upload/${survey_uid}/${formUID}`
            ) ||
            isActive(
              `/survey-information/enumerators/map/${survey_uid}/${formUID}`
            ) ||
            isActive(`/survey-information/enumerators/${survey_uid}/${formUID}`)
          }`}
          to={`/survey-information/enumerators/${survey_uid}/${formUID}`}
        >
          <IconWrapper>
            <InsertRowRightOutlined />
          </IconWrapper>
          Enumerators
        </MenuItem>
      ),
      key: "surveyEnumerators",
    },
    {
      label: (
        <MenuItem
          className={`${
            isActive(
              `/survey-information/targets/upload/${survey_uid}/${formUID}`
            ) ||
            isActive(
              `/survey-information/targets/map/${survey_uid}/${formUID}`
            ) ||
            isActive(`/survey-information/targets/${survey_uid}/${formUID}`)
          }`}
          to={`/survey-information/targets/${survey_uid}/${formUID}`}
        >
          <IconWrapper>
            <HomeOutlined />
          </IconWrapper>
          Targets
        </MenuItem>
      ),
      key: "surveyTargets",
    },
    {
      label: (
        <MenuItem
          className={`${
            isActive(`/survey-information/mapping/${survey_uid}`) ||
            isActive(`/survey-information/mapping/surveyor/${survey_uid}`) ||
            isActive(`/survey-information/mapping/target/${survey_uid}`)
          }`}
          to={`/survey-information/mapping/surveyor/${survey_uid}`}
        >
          <IconWrapper>
            <ControlOutlined />
          </IconWrapper>
          Supervisor mapping
        </MenuItem>
      ),
      key: "supervisorMapping",
      children: [
        {
          label: (
            <MenuItem
              className={`${
                isActive(`/survey-information/mapping/${survey_uid}`) ||
                isActive(`/survey-information/mapping/surveyor/${survey_uid}`)
              }`}
              to={`/survey-information/mapping/surveyor/${survey_uid}`}
            >
              <IconWrapper>
                <UsergroupAddOutlined />
              </IconWrapper>
              Surveyors &lt;&gt; Supervisors
            </MenuItem>
          ),
          key: "surveyorSupervisor",
        },
        {
          label: (
            <MenuItem
              className={isActive(
                `/survey-information/mapping/target/${survey_uid}`
              )}
              to={`/survey-information/mapping/target/${survey_uid}`}
            >
              <IconWrapper>
                <NumberOutlined />
              </IconWrapper>
              Targets &lt;&gt; Supervisors
            </MenuItem>
          ),
          key: "targetSupervisor",
        },
      ],
    },
    {
      label: (
        <MenuItem
          className={isActive(
            `/survey-information/survey/status-mapping/${survey_uid}`
          )}
          to={`/survey-information/survey/status-mapping/${survey_uid}`}
        >
          <IconWrapper>
            <BuildOutlined />
          </IconWrapper>
          Target status mapping
        </MenuItem>
      ),
      key: "targetStatusMapping",
    },
  ];
  const [current, setCurrent] = useState("mail");
  const [openKeys, setOpenKeys] = useState<string[]>([]);

  const onClick: MenuProps["onClick"] = (e) => {
    setCurrent(e.key);
  };

  const getPossibleKey = () => {
    const path = location.pathname;
    if (path.includes("location/")) return "surveyLocation";
    if (path.includes("enumerators/")) return "surveyEnumerators";
    if (path.includes("targets/")) return "surveyTargets";
    if (path.includes("survey-cto-information")) return "surveyInformation";
    if (path.includes("survey-cto-questions")) return "surveyInformation";
    if (path.includes("survey/status-mapping")) return "targetStatusMapping";
    if (path.includes("survey-roles/")) return "surveyRolesAndUsers";
    if (path.includes("survey-users/")) return "surveyRolesAndUsers";
    if (path.includes("mapping/")) return "supervisorMapping";
    return "";
  };

  const handleFormUID = async () => {
    if (form_uid == "" || form_uid == undefined) {
      try {
        // TODO: Investigate more on this
        if (isSurveyCTOFormLoading) return;

        if (surveyCTOForm.form_uid) {
          setFormUID(surveyCTOForm.form_uid);
        }
      } catch (error) {
        console.log("Error fetching sctoForm:", error);
      }
    } else {
      setFormUID(form_uid);
    }
  };

  useEffect(() => {
    handleFormUID();
    const key: string = getPossibleKey();
    setOpenKeys([key]);
  }, [setOpenKeys, surveyCTOForm, form_uid]);

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
