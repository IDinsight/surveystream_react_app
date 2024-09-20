import styled from "styled-components";
import { Dropdown, Menu, MenuProps } from "antd";
import { useAppDispatch } from "redux/hooks";

import { performLogout } from "redux/auth/authActions";

import { useNavigate } from "react-router-dom";

const ProfileWrapper = styled.div`
  color: white;
  font-family: "Lato", sans-serif;
  font-size: 18px;
  font-weight: 300;
  line-height: 28px;
  cursor: pointer;
`;

const AvatarWrapper = styled.div`
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background-color: #fb8c14;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-weight: 300;
  font-family: "Lato", sans-serif;
  font-size: 15px;
`;

function HeaderAvatarMenu({ userProfile }: { userProfile?: any }) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const logoutUser = async () => {
    const logoutResponse = await dispatch(performLogout());
    if (logoutResponse.payload.status) {
      navigate("/login");
    }
    return true;
  };

  const getUsernameText = (): string => {
    if (userProfile?.first_name !== null && userProfile?.last_name !== null) {
      return `${userProfile?.first_name} ${userProfile?.last_name}`;
    } else if (userProfile?.email !== null) {
      return userProfile?.email;
    }
    return "";
  };

  const getInitials = () => {
    const name = getUsernameText();
    const nameArray = name.split(" ");
    const initials = nameArray.map((word: string) =>
      word.charAt(0).toUpperCase()
    );
    return initials.join("");
  };

  const items: MenuProps["items"] = [
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

  return (
    <ProfileWrapper className="flex items-center ml-auto mr-6">
      <Dropdown menu={{ items }} trigger={["click"]}>
        <a id="user_profile_avatar">
          <AvatarWrapper>{getInitials()}</AvatarWrapper>
        </a>
      </Dropdown>
    </ProfileWrapper>
  );
}

export default HeaderAvatarMenu;
