import { message } from "antd";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

import { useEffect, useState } from "react";
import FullScreenLoader from "../../components/Loaders/FullScreenLoader";
import SuccessCard from "../../components/SuccessCard";
import { performResetPassword } from "../../redux/auth/authActions";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { RootState } from "../../redux/store";
import ResetPasswordComponent from "../../components/ResetPasswordComponent";
import { ResetParams, ResetPasswordData } from "../../redux/auth/types";
import { LockOutlined } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import { postCompleteRegistration } from "../../redux/userManagement/userManagementActions";

function CompleteRegistration() {
  const { token } = useParams<{ token?: string }>() ?? {
    token: "",
  };
  const [actionDone, setActionDone] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  const loading = useAppSelector((state: RootState) => state.auth.loading);

  const handleCompleteRegistration = async (values: ResetParams) => {
    if (!token || token.length < 2) {
      messageApi.open({
        type: "error",
        content: "Token is missing, kindly correct url to proceed.",
      });
      return;
    }

    const requestData: any = {
      new_password: values.password,
      confirm_password: values.confirmPassword,
      invite_code: token,
    };

    try {
      const completeRegistrationRes = await dispatch(
        postCompleteRegistration(requestData)
      );

      if (completeRegistrationRes.payload?.status === 200) {
        setActionDone(true);
        return;
      } else {
        // If it is Axios error then we will have the message
        messageApi.open({
          type: "error",
          content: completeRegistrationRes.payload?.message,
        });
        return;
      }
    } catch (error) {
      messageApi.open({
        type: "error",
        content: "Failed to complete user registration!",
      });
    }
  };

  const handleResetFailure = (errorInfo: any) => {
    messageApi.open({
      type: "error",
      content: "Failed to complete user registration!",
    });
  };

  return (
    <>
      <Header />
      {contextHolder}
      {loading ? (
        <FullScreenLoader />
      ) : (
        <>
          <div className="bg-[#F5F5F5] flex justify-center items-center min-h-[calc(100vh-114px)]">
            {actionDone != true ? (
              <>
                <div
                  style={{ boxSizing: "border-box" }}
                  className="pt-8 px-6 w-[400px] h-[409px] bg-gray-1 rounded-lg border border-solid
      border-[#F0F0F0] shadow-[0px_4px_4px_rgba(0,0,0,0.08)]"
                >
                  <div className="mt-[44px]">
                    <p className="font-inter font-normal font-medium text-[25px] leading-[38px] m-0 text-center">
                      Welcome to SurveyStream
                    </p>
                    <p className="font-inter font-normal font-medium text-sm leading-[22px] text-gray-9 text-center">
                      <LockOutlined className="text-[#434343] text-[18px] mr-2" />
                      Kindly reset your password to complete the registration
                      process.
                    </p>
                  </div>
                </div>
                <ResetPasswordComponent
                  handleResetSubmit={handleCompleteRegistration}
                  handleResetFailure={handleResetFailure}
                />
              </>
            ) : (
              <SuccessCard
                heading="Password has been updated successfully!"
                subheading=""
                link="/login"
                linktext="Login"
              />
            )}
          </div>
          <Footer />
        </>
      )}
    </>
  );
}

export default CompleteRegistration;
