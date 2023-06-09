import { NavLink, useLocation } from "react-router-dom";
import {
  CalendarOutlined,
  CompassOutlined,
  NumberOutlined,
  ProfileOutlined,
  ShareAltOutlined,
  UnorderedListOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  SideMenuWrapper,
  MenuItem,
  IconWrapper,
} from "../../shared/SideMenu.styled";

function SideMenu() {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path ? "active" : "";
  };

  return (
    <SideMenuWrapper>
      <MenuItem className={isActive("/survey-information/")}>
        <IconWrapper>
          <UnorderedListOutlined />
        </IconWrapper>
        SurveyCTO information
      </MenuItem>
      <MenuItem className={isActive("/survey-information/field-supervisor")}>
        <IconWrapper>
          <CalendarOutlined />
        </IconWrapper>
        Field supervisor roles
      </MenuItem>
      <MenuItem className={isActive("/survey-information/survey-location")}>
        <IconWrapper>
          <CompassOutlined />
        </IconWrapper>
        Survey location
      </MenuItem>
      <MenuItem className={isActive("/survey-information/webapp-users")}>
        <IconWrapper>
          <UserOutlined />
        </IconWrapper>
        WebApp Users
      </MenuItem>
      <MenuItem className={isActive("/survey-information/enumerators")}>
        <IconWrapper>
          <ProfileOutlined />
        </IconWrapper>
        Enumerators
      </MenuItem>
      <MenuItem className={isActive("/survey-information/targets")}>
        <IconWrapper>
          <NumberOutlined />
        </IconWrapper>
        Targets
      </MenuItem>
      <MenuItem
        className={isActive("/survey-information/survey-cto-questions")}
      >
        <IconWrapper>
          <ShareAltOutlined />
        </IconWrapper>
        SurveyCTO Questions
      </MenuItem>
    </SideMenuWrapper>
  );
}

export default SideMenu;
