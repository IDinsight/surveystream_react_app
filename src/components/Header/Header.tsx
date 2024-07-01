import { Dropdown, Menu, MenuProps } from "antd";
import Logo from "./../../assets/logo.svg";
import UserAvatar from "./UserAvatar";
import styled from "styled-components";
import { getCookie } from "../../utils/helper";
import {
  performGetUserProfile,
  performLogout,
} from "../../redux/auth/authActions";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { useEffect } from "react";
import { RootState } from "../../redux/store";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { setUserProfile } from "../../redux/auth/authSlice";

const ProfileWrapper = styled.div`
  color: white;
  font-family: "Lato", sans-serif;
  font-size: 18px;
  font-weight: 300;
  line-height: 28px;
`;

const isAuthenticated = () => {
  // Return true if authenticated, false otherwise
  const rememberToken = getCookie("remember_token");
  return rememberToken !== "";
};

function Header({ items }: { items?: any }) {
  const NavItems: any = items;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const storedProfile = localStorage.getItem("userProfile");
  const reduxProfile = useAppSelector((state: RootState) => state.auth.profile);
  const userProfile = storedProfile ? JSON.parse(storedProfile) : reduxProfile;

  const getUsernameText = (): string => {
    if (userProfile?.first_name !== null && userProfile?.last_name !== null) {
      return `${userProfile?.first_name} ${userProfile?.last_name}`;
    } else if (userProfile?.email !== null) {
      return userProfile?.email;
    }
    return "";
  };

  const logoutUser = async () => {
    const logoutRes = await dispatch(performLogout());
    if (logoutRes.payload.status) {
      navigate("/login");
    }
    return true;
  };

  useEffect(() => {
    if (isAuthenticated() && !userProfile?.first_name) {
      dispatch(performGetUserProfile());
    }

    if (storedProfile) {
      dispatch(setUserProfile({ ...userProfile }));
    }
  }, [storedProfile]);

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

  const helpMenu: MenuProps["items"] = [];
  return (
    <header className="flex h-[70px] bg-geekblue-9">
      <div className="flex items-center">
        <Link to={userProfile?.user_uid ? "/surveys" : "/"}>
          <img
            className="pr-2"
            style={{ margin: "0 1.5rem" }}
            src={Logo}
            alt="SurveyStream Logo"
          />
        </Link>
      </div>
      {items ? <NavItems /> : null}

      {userProfile?.user_uid && (
        <ProfileWrapper className="flex items-center ml-auto mr-6">
          {/* <Dropdown menu={{ items: helpMenu }} trigger={["hover", "click"]}>
            <div className="mr-4">
              <span>Help</span>
              <DownOutlined style={{ marginLeft: "4px" }} />
            </div>
          </Dropdown>

          <div className="mr-4">
            <BellOutlined style={{ color: "white" }} />
          </div> */}

          <Dropdown menu={{ items: avatarMenu }} trigger={["hover", "click"]}>
            <a id="user_profile_avatar">
              <UserAvatar name={getUsernameText()} />
            </a>
          </Dropdown>
        </ProfileWrapper>
      )}
    </header>
  );
}

export default Header;
