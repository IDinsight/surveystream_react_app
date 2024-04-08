import { useEffect, useState } from "react";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import ResetPasswordComponent from "../../../components/ResetPasswordComponent";
import SuccessCard from "../../../components/SuccessCard";
import { ResetParams, ResetPasswordData } from "../../../redux/auth/types";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { message } from "antd";
import { performResetPassword } from "../../../redux/auth/authActions";
import { RootState } from "../../../redux/store";
import FullScreenLoader from "../../../components/Loaders/FullScreenLoader";
import { GlobalStyle } from "../../../shared/Global.styled";

function ResetPassword() {
  const [urlArr, setUrlARr] = useState<string[]>();
  const [actionDone, setActionDone] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  const loading = useAppSelector((state: RootState) => state.auth.loading);

  const handleResetSubmit = async (values: ResetParams) => {
    if (!urlArr || urlArr.length < 2) {
      return;
    }

    const requestData: ResetPasswordData = {
      new_password: values.password,
      confirm: values.confirmPassword,
      rpt_id: urlArr[2],
      rpt_token: urlArr[3],
    };

    try {
      const resetPasswordResp = await dispatch(
        performResetPassword(requestData)
      );

      if (resetPasswordResp.payload?.message === "Success: password reset") {
        setActionDone(true);
        return;
      } else {
        // If it is Axios error then we will have the message
        if (resetPasswordResp.payload?.name === "AxiosError") {
          messageApi.open({
            type: "error",
            content: resetPasswordResp.payload?.response?.data?.message,
          });
          return;
        }

        messageApi.open({
          type: "error",
          content: "Forgot password failed!",
        });
      }
    } catch (error) {
      messageApi.open({
        type: "error",
        content: "Reset password failed!",
      });
    }
  };

  const handleResetFailure = (errorInfo: any) => {
    messageApi.open({
      type: "error",
      content: "Reset password failed!",
    });
  };

  useEffect(() => {
    setUrlARr(window.location.pathname.split("/"));
  }, []);

  return (
    <>
      <GlobalStyle />

      <Header />
      {contextHolder}
      {loading ? (
        <FullScreenLoader />
      ) : (
        <>
          <div className="bg-[#F5F5F5] flex justify-center items-center min-h-[calc(100vh-114px)]">
            {actionDone != true ? (
              <ResetPasswordComponent
                handleResetSubmit={handleResetSubmit}
                handleResetFailure={handleResetFailure}
              />
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

export default ResetPassword;
