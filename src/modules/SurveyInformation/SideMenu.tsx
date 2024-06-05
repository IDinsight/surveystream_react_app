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

import { useEffect, useState } from "react";
import { getSurveyCTOForm } from "../../redux/surveyCTOInformation/surveyCTOInformationActions";
import { AsyncThunkAction } from "@reduxjs/toolkit";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { RootState } from "../../redux/store";
import { is } from "cypress/types/bluebird";

function SideMenu() {
  const location = useLocation();
  const dispatch = useAppDispatch();

  const { survey_uid } = useParams<{ survey_uid?: string }>() ?? {
    survey_uid: "",
  };
  const { form_uid } = useParams<{ form_uid?: string }>() ?? {
    form_uid: "",
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
            <ProfileOutlined />
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
            <NumberOutlined />
          </IconWrapper>
          Targets
        </MenuItem>
      ),
      key: "surveyTargets",
    },
    {
      label: (
        <MenuItem
          to={`/survey-information/survey-cto-questions/${survey_uid}/${formUID}`}
          className={isActive(
            `/survey-information/survey-cto-questions/${survey_uid}/${formUID}`
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
  const [openKeys, setOpenKeys] = useState<string[]>([]);

  const onClick: MenuProps["onClick"] = (e) => {
    setCurrent(e.key);
  };

  const getPossibleKey = () => {
    const path = location.pathname;
    if (path.includes("location/")) return "surveyLocation";
    if (path.includes("enumerators/")) return "surveyEnumerators";
    if (path.includes("targets/")) return "surveyTargets";

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
