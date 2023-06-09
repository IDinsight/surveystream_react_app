import { BellOutlined, DownOutlined } from "@ant-design/icons";
import { Dropdown, Menu, message } from "antd";
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

const ProfileWrapper = styled.div`
  color: white;
  font-family: Inter;
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

  const userProfile = useAppSelector(
    (state: RootState) => state.reducer.auth.profile
  );

  const logoutUser = async () => {
    const logoutRes = await dispatch(performLogout());
    if (logoutRes.payload.message) {
      navigate("/login");
    }
    return true;
  };

  useEffect(() => {
    if (isAuthenticated() && !userProfile?.first_name) {
      dispatch(performGetUserProfile());
    }
  }, [dispatch]);

  const avatarMenu = (
    <Menu>
      <Menu.Item key="profile">
        {`${userProfile?.first_name} ${userProfile?.last_name}`}
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout">
        <a onClick={logoutUser}>Logout</a>
      </Menu.Item>
    </Menu>
  );

  const helpMenu = <Menu>{/* TODO: add help menu */}</Menu>;

  return (
    <header className="flex h-[70px] bg-geekblue-9">
      <div className="flex items-center">
        <img className="pl-6 pr-12" src={Logo} alt="SurveyStream Logo" />
      </div>
      {items ? <NavItems /> : null}

      {userProfile?.first_name && (
        <ProfileWrapper className="flex items-center ml-auto mr-6">
          <Dropdown overlay={helpMenu} trigger={["click"]}>
            <div className="mr-4">
              <span>Help</span>
              <DownOutlined style={{ marginLeft: "4px" }} />
            </div>
          </Dropdown>

          <div className="mr-4">
            <BellOutlined style={{ color: "white" }} />
          </div>

          <Dropdown overlay={avatarMenu} trigger={["click"]}>
            <a>
              <UserAvatar
                name={`${userProfile?.first_name} ${userProfile?.last_name}`}
              />
            </a>
          </Dropdown>
        </ProfileWrapper>
      )}
    </header>
  );
}

export default Header;
