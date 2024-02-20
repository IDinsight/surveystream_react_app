import {
  ApartmentOutlined,
  CaretDownOutlined,
  HomeFilled,
  IdcardOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import "./NavItems.css";
import { Link, useLocation } from "react-router-dom";
import { getCookie } from "../../utils/helper";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { RootState } from "../../redux/store";
import { performGetUserProfile } from "../../redux/auth/authActions";

const isAuthenticated = () => {
  // Return true if authenticated, false otherwise
  const rememberToken = getCookie("remember_token");
  return rememberToken !== "";
};

const NavItems = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();

  const userProfile = useAppSelector((state: RootState) => state.auth.profile);

  const isActiveItem = (path: string) => {
    return location.pathname.includes(path) ? "bg-geekblue-5" : "";
  };

  useEffect(() => {
    if (isAuthenticated() && !userProfile?.first_name) {
      dispatch(performGetUserProfile());
    }
  }, [dispatch]);

  return (
    <div className="nav-menu flex">
      <div className={"nav-menu-item  w-36 " + isActiveItem("surveys")}>
        <Link to="/surveys">
          <HomeFilled className="flex items-center !text-base !text-gray-2" />
          <span className="!text-gray-2">Surveys</span>
        </Link>
      </div>

      {userProfile?.is_super_admin && (
        <div className={"nav-menu-item " + isActiveItem("users")}>
          <div>
            <ApartmentOutlined className="flex items-center !text-base !text-gray-2" />
            <Link to="/users">
              <span className="!text-gray-2">User management</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavItems;
