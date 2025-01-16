import { useAppDispatch, useAppSelector } from "redux/hooks";
import { RootState } from "redux/store";

import { useEffect, useState } from "react";
import { getCookie } from "utils/helper";

import { performGetUserProfile } from "redux/auth/authActions";

import { setUserProfile } from "redux/auth/authSlice";

import HeaderAvatarMenu from "./HeaderAvatarMenu";

import { Link, useLocation } from "react-router-dom";

import Logo from "assets/logo.svg";

import {
  ApartmentOutlined,
  HomeFilled,
  MailOutlined,
  AppstoreAddOutlined,
} from "@ant-design/icons";
import { getAllNotifications } from "./../../redux/notifications/notificationActions";

import "./Header.css";
import NotificationBell from "../NotificationBell";
import { message } from "antd";

const Header = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();

  /* 
  Determine if user is signed and if so retrieve the user profile
  */
  const storedProfile = localStorage.getItem("userProfile");
  const reduxProfile = useAppSelector((state: RootState) => state.auth.profile);
  const userProfile = storedProfile ? JSON.parse(storedProfile) : reduxProfile;
  const {
    loading: isNotificationLoading,
    error: notificationError,
    notifications,
  } = useAppSelector((state: RootState) => state.notifications);

  const isAuthenticated = () => {
    // Return true if authenticated, false otherwise
    const rememberToken = getCookie("remember_token");
    return rememberToken !== "";
  };

  const isUserAuthenticatedButProfileNotAvailable = () => {
    return isAuthenticated() && !userProfile?.first_name;
  };

  useEffect(() => {
    if (isUserAuthenticatedButProfileNotAvailable()) {
      dispatch(performGetUserProfile());
    }
    if (storedProfile) {
      dispatch(setUserProfile({ ...userProfile }));
    }
  }, []);

  /* 
  Define the navigation items in this section and determine which ones to show or not depending on the user, if user
  */
  const [navItems, setNavItems] = useState<any[]>([]);
  const isSignedIn = () => userProfile?.user_uid;

  const isUsersOrSurveysPage = () => {
    const found = location.pathname.match(/^\/(users|surveys)(\/.+)*/g);
    return found && found.length > 0;
  };

  useEffect(() => {
    const items = [
      {
        url: "/surveys",
        label: "Surveys",
        icon: HomeFilled,
        show: isSignedIn() && isUsersOrSurveysPage(),
        isActive: location.pathname.includes("surveys"),
        external: false,
      },
      {
        url: "/users",
        label: "User management",
        icon: ApartmentOutlined,
        show:
          isSignedIn() && isUsersOrSurveysPage() && userProfile?.is_super_admin,
        isActive: location.pathname.includes("users"),
        external: false,
      },
      {
        url: "https://docs.google.com/forms/d/e/1FAIpQLSdNG2C4Dmtt4NiJGm05VxyAUakvfS8o_Hkgdc8vJhl3eKR1_g/viewform",
        label: "Contact Us",
        icon: MailOutlined,
        show: !isSignedIn(),
        external: true,
      },
      {
        url: "https://docs.google.com/spreadsheets/d/1WbmebjDLrbo6c15KZzbu1rkvNHlnBAy_p-nREz3OjNE/",
        label: "Roadmap",
        icon: AppstoreAddOutlined,
        show: !isSignedIn(),
        external: true,
      },
    ];
    const filteredItems = items.filter((item: any) => item?.show);

    setNavItems(filteredItems);
  }, [location]);

  useEffect(() => {
    if (userProfile?.user_uid) {
      const fetchNotifications = async () => {
        try {
          await dispatch(getAllNotifications());
        } catch (error) {
          message.error("Failed to fetch notifications");
        }
      };

      fetchNotifications();
      const intervalId = setInterval(fetchNotifications, 15000);

      return () => {
        clearInterval(intervalId);
      };
    }
  }, [userProfile?.user_uid, dispatch]);

  return (
    <header className="flex h-[70px] bg-geekblue-9">
      <div className="flex items-center">
        <Link to={isSignedIn() ? "/surveys" : "/"}>
          <img
            className="pr-2 w-36"
            style={{ margin: "0 1.5rem" }}
            src={Logo}
            alt="SurveyStream Logo"
          />
        </Link>
      </div>
      <div className="nav-menu flex flex-1">
        {navItems.map((item: any, index) => {
          if (item.external) {
            return (
              <div className="min-w-32 justify-center w-40" key={index}>
                <span>
                  <a target="_blank" rel="noreferrer" href={item.url}>
                    {item.label}
                  </a>
                </span>
              </div>
            );
          }
          return (
            <div
              className={`nav-menu-item justify-center w-40 px-2 ${
                item.isActive ? "bg-geekblue-5" : ""
              }`}
              key={index}
            >
              <Link to={item.url}>
                <span className="!text-gray-2">{item.label}</span>
              </Link>
            </div>
          );
        })}
      </div>
      <div className="nav-menu flex mr-2">
        <div className="nav-menu-item justify-center w-40">
          <Link to="https://docs.surveystream.idinsight.io">
            <span className="!text-gray-2">Documentation</span>
          </Link>
        </div>
        <div className="w-16">
          {isSignedIn() ? (
            <>
              <NotificationBell notifications={notifications} />
            </>
          ) : null}
        </div>
      </div>
      {isSignedIn() ? <HeaderAvatarMenu userProfile={userProfile} /> : null}
    </header>
  );
};

export default Header;
