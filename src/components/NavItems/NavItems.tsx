import {
  ApartmentOutlined,
  CaretDownOutlined,
  HomeFilled,
  IdcardOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import "./NavItems.css";
import { Link } from "react-router-dom";

const NavItems = () => {
  return (
    <div className="nav-menu flex">
      <div className="nav-menu-item w-36 bg-geekblue-5">
        <HomeFilled className="flex items-center !text-base !text-gray-2" />
        <span className="!text-gray-2">Surveys</span>
      </div>
      <div className="nav-menu-item">
        <div>
          <ApartmentOutlined className="flex items-center !text-base !text-gray-2" />
          <span className="!text-gray-2">User management</span>
          <CaretDownOutlined className="nav-dropdown-tooltip" />
        </div>
        <div className="nav-submenu">
          <Link to="/users">
            <UsergroupAddOutlined className="flex items-center" />
            <span>Users</span>
          </Link>
          <Link to="/surveys">
            <IdcardOutlined className="flex items-center" />
            <span>Roles</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NavItems;
