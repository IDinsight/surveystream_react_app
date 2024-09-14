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
  BookFilled,
  MailOutlined,
  AppstoreAddOutlined,
} from "@ant-design/icons";

import "./Header.css";

const Header = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();

  /* 
  Determine if user is signed and if so retrieve the user profile
  */
  const storedProfile = localStorage.getItem("userProfile");
  const reduxProfile = useAppSelector((state: RootState) => state.auth.profile);
  const userProfile = storedProfile ? JSON.parse(storedProfile) : reduxProfile;

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

  useEffect(() => {
    const items = [
      {
        url: "/surveys",
        label: "Surveys",
        icon: HomeFilled,
        show:
          isSignedIn() &&
          (location.pathname.includes("surveys") ||
            location.pathname.includes("users")),
        isActive: location.pathname.includes("surveys"),
        external: false,
      },
      {
        url: "/users",
        label: "User management",
        icon: ApartmentOutlined,
        show:
          isSignedIn() &&
          (location.pathname.includes("surveys") ||
            location.pathname.includes("users")) &&
          userProfile?.is_super_admin,
        isActive: location.pathname.includes("users"),
        external: false,
      },
      {
        url: "/",
        label: "Home",
        icon: HomeFilled,
        show: !isSignedIn(),
        home: true,
      },
      {
        url: "https://docs.surveystream.idinsight.io",
        label: "Documentation",
        icon: BookFilled,
        show: true,
        external: true,
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
      <div className="nav-menu flex">
        {navItems.map((item: any, index) => {
          if (item.home) {
            return (
              <div
                className="bg-geekblue-5 justify-center min-w-40"
                key={index}
              >
                <HomeFilled className="flex items-center !text-[16px]" />
                <span>Home</span>
              </div>
            );
          }
          if (item.external) {
            return (
              <div className="min-w-32 justify-center w-40" key={index}>
                {/* <item.icon className="flex items-center !text-[16px]" /> */}
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
                {/* <item.icon className="flex items-center !text-base !text-gray-2 mx-1" /> */}
                <span className="!text-gray-2">{item.label}</span>
              </Link>
            </div>
          );
        })}
      </div>
      <HeaderAvatarMenu userProfile={userProfile} />
    </header>
  );
};

export default Header;
