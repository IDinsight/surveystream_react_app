import { useLocation } from "react-router-dom";
import {
  ApartmentOutlined,
  CalendarOutlined,
  CompassOutlined,
  DownOutlined,
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
import { useState } from "react";

function SideMenu() {
  const location = useLocation();
  const [openSubMenu, setOpenSubMenu] = useState("");

  const isActive = (path: string) => {
    return location.pathname === path ? "active" : "";
  };
  const toggleSubMenu = (submenu: string) => {
    if (openSubMenu === submenu) {
      setOpenSubMenu("");
    } else {
      setOpenSubMenu(submenu);
    }
  };

  const isSubMenuOpen = (submenu: string) => {
    return openSubMenu === submenu ? "open" : "";
  };

  return (
    <SideMenuWrapper>
      <MenuItem className={isActive("/survey-information/")}>
        <IconWrapper>
          <UnorderedListOutlined />
        </IconWrapper>
        SurveyCTO information
      </MenuItem>

      <MenuItem
        className={`${isActive(
          "/survey-information/field-supervisor-roles"
        )} ${isSubMenuOpen("field-supervisor-roles")}`}
        onClick={() => toggleSubMenu("field-supervisor-roles")}
      >
        <IconWrapper>
          <CalendarOutlined />
        </IconWrapper>
        Field supervisor roles
        <IconWrapper>
          <DownOutlined />
        </IconWrapper>
      </MenuItem>
      {openSubMenu === "field-supervisor-roles" && (
        <div style={{ marginLeft: "15px" }}>
          <MenuItem
            className={isActive(
              "/survey-information/field-supervisor-roles/add-roles"
            )}
          >
            <IconWrapper>
              <UsergroupAddOutlined />
            </IconWrapper>
            Roles
          </MenuItem>
          <MenuItem
            className={isActive(
              "/survey-information/field-supervisor-roles/role-hierarchy"
            )}
          >
            <IconWrapper>
              <ApartmentOutlined />
            </IconWrapper>
            Role Hierarchy
          </MenuItem>
        </div>
      )}

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
