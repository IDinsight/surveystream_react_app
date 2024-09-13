import styled from "styled-components";
import { Dropdown, Menu, MenuProps } from "antd";

import { ApartmentOutlined, HomeFilled } from "@ant-design/icons";

import { Link, useLocation } from "react-router-dom";

import UserAvatar from "./UserAvatar";
import { useAppDispatch } from "redux/hooks";

import { performLogout } from "redux/auth/authActions";

import { useNavigate } from "react-router-dom";

const ProfileWrapper = styled.div`
  color: white;
  font-family: "Lato", sans-serif;
  font-size: 18px;
  font-weight: 300;
  line-height: 28px;
`;

function HeaderOne({ userProfile }: { userProfile?: any }) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const location = useLocation();

  const getUsernameText = (): string => {
    if (userProfile?.first_name !== null && userProfile?.last_name !== null) {
      return `${userProfile?.first_name} ${userProfile?.last_name}`;
    } else if (userProfile?.email !== null) {
      return userProfile?.email;
    }
    return "";
  };

  const logoutUser = async () => {
    const logoutResponse = await dispatch(performLogout());
    if (logoutResponse.payload.status) {
      navigate("/login");
    }
    return true;
  };

  const avatarMenu: MenuProps["items"] = [
    {
      label: <Menu.Item key="profile">{getUsernameText()}</Menu.Item>,
      key: "1",
    },
    {
      type: "divider",
    },
    {
      label: (
        <Menu.Item key="logout" onClick={logoutUser}>
          Logout
        </Menu.Item>
      ),
      key: "3",
    },
  ];

  const isActiveItem = (path: string) => {
    return location.pathname.includes(path) ? "bg-geekblue-5" : "";
  };

  return (
    <>
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
      <ProfileWrapper className="flex items-center ml-auto mr-6">
        <Dropdown menu={{ items: avatarMenu }} trigger={["hover", "click"]}>
          <a id="user_profile_avatar">
            <UserAvatar name={getUsernameText()} />
          </a>
        </Dropdown>
      </ProfileWrapper>
    </>
  );
}

export default HeaderOne;
