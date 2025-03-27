import { useLocation, useParams } from "react-router-dom";
import { AuditOutlined, FilterOutlined } from "@ant-design/icons";
import { Menu, MenuProps } from "antd";
import { useEffect, useState } from "react";
import {
  IconWrapper,
  MenuItem,
  SideMenuWrapper,
} from "../../shared/SideMenu.styled";

function SideMenu() {
  const location = useLocation();

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
          className={isActive(`/module-configuration/dq-forms/${survey_uid}`)}
          to={`/module-configuration/dq-forms/${survey_uid}`}
        >
          <IconWrapper>
            <AuditOutlined />
          </IconWrapper>
          Data Quality Forms
        </MenuItem>
      ),
      key: "dqForms",
    },
    {
      label: (
        <MenuItem
          className={`${isActive(
            `/module-configuration/dq-checks/${survey_uid}`
          )}`}
          to={`/module-configuration/dq-checks/${survey_uid}`}
        >
          <IconWrapper>
            <FilterOutlined />
          </IconWrapper>
          Data Quality Checks
        </MenuItem>
      ),
      key: "dqChecks",
    },
  ];
  const [openKeys, setOpenKeys] = useState<string[]>([]);

  const onClick: MenuProps["onClick"] = (e) => {
    setCurrent(e.key);
  };

  const getPossibleKey = () => {
    const path = location.pathname;
    if (path.includes("/dq-forms")) return "dqForms";
    if (path.includes("/dq-checks")) return "dqChecks";

    return "dqForms";
  };
  const [current, setCurrent] = useState<string>(getPossibleKey());

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
