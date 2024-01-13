import {
  ApartmentOutlined,
  CaretDownOutlined,
  HomeFilled,
  IdcardOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import "./NavItems.css";
import { Link, useLocation } from "react-router-dom";

const NavItems = () => {
  const location = useLocation();

  const isActiveItem = (path: string) => {
    return location.pathname.includes(path) ? "bg-geekblue-5" : "";
  };

  return (
    <div className="nav-menu flex">
      <div className={"nav-menu-item  w-36 " + isActiveItem("surveys")}>
        <Link to="/surveys">
          <HomeFilled className="flex items-center !text-base !text-gray-2" />
          <span className="!text-gray-2">Surveys</span>
        </Link>
      </div>
      <div className={"nav-menu-item " + isActiveItem("users")}>
        <div>
          <ApartmentOutlined className="flex items-center !text-base !text-gray-2" />
          <Link to="/users">
            <span className="!text-gray-2">User management</span>
            {/* <CaretDownOutlined className="nav-dropdown-tooltip" /> */}
          </Link>
        </div>
        {/* <div className="nav-submenu">
          <Link to="/users">
            <UsergroupAddOutlined className="flex items-center" />
            <span>Users</span>
          </Link>
          <Link to="/surveys">
            <IdcardOutlined className="flex items-center" />
            <span>Roles</span>
          </Link>
        </div> */}
      </div>
    </div>
  );
};

export default NavItems;
