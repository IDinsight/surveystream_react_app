import { useAppDispatch, useAppSelector } from "redux/hooks";
import { RootState } from "redux/store";

import { useEffect } from "react";
import { getCookie } from "utils/helper";

import { performGetUserProfile } from "redux/auth/authActions";

import { setUserProfile } from "redux/auth/authSlice";

import HeaderOne from "./HeaderOne";
import HeaderTwo from "./HeaderTwo";

import { Link, useLocation } from "react-router-dom";

import Logo from "assets/logo.svg";

import "./NavItems.css";

const Header = () => {
  const dispatch = useAppDispatch();

  const location = useLocation();

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

  const isSignedIn = () => userProfile?.user_uid;

  const shouldDisplayHeaderOne = () => {
    if (location.pathname.includes("users")) {
      return true;
    }
    if (location.pathname.includes("surveys")) {
      return true;
    }
    return false;
  };

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
      {isSignedIn() ? (
        shouldDisplayHeaderOne() ? (
          <HeaderOne userProfile={userProfile} />
        ) : null
      ) : (
        <HeaderTwo />
      )}
    </header>
  );
};

export default Header;
