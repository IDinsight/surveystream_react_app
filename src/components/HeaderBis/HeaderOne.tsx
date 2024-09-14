import { ApartmentOutlined, HomeFilled } from "@ant-design/icons";

import { Link, useLocation } from "react-router-dom";

import HeaderAvatarMenu from "./HeaderOneAvatarMenu";


function HeaderOne({ userProfile }: { userProfile?: any }) {

  const location = useLocation();


  const isActiveItem = (path: string) => {
    return location.pathname.includes(path) ? "bg-geekblue-5" : "";
  };

  return (
    <>
      <div className="nav-menu flex justify-end">
        <div
          className={
            "nav-menu-item justify-center w-40 " + isActiveItem("surveys")
          }
        >
          <Link to="/surveys">
            {/* <HomeFilled className="flex items-center !text-base !text-gray-2" /> */}
            <span className="!text-gray-2">Surveys</span>
          </Link>
        </div>

        {userProfile?.is_super_admin && (
          <div
            className={
              "nav-menu-item justify-center w-40 " + isActiveItem("users")
            }
          >
            <div>
              {/* <ApartmentOutlined className="flex items-center !text-base !text-gray-2" /> */}
              <Link to="/users">
                <span className="!text-gray-2">User management</span>
              </Link>
            </div>
          </div>
        )}
      </div>
      <HeaderAvatarMenu userProfile={ userProfile } />
    </>
  );
}

export default HeaderOne;
