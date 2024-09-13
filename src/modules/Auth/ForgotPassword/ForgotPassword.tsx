import { useState } from "react";
import Footer from "../../../components/Footer";
import Header from "../../../components/Header.OLD";
import ForgotPasswordComponent from "../../../components/ForgotPasswordComponent";
import SuccessCard from "../../../components/SuccessCard";
import { performForgotPassword } from "../../../redux/auth/authActions";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { message } from "antd";
import FullScreenLoader from "../../../components/Loaders/FullScreenLoader";
import { RootState } from "../../../redux/store";
import { GlobalStyle } from "../../../shared/Global.styled";

function ForgotPassword() {
  const [actionDone, setActionDone] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  const loading = useAppSelector((state: RootState) => state.auth.loading);

  const handleForgotSubmit = async (values: { email: string }) => {
    try {
      const forgotPasswordResp = await dispatch(performForgotPassword(values));
      if (forgotPasswordResp.payload?.message === "Request processed") {
        setActionDone(true);
      } else {
        // If it is Axios error then we will have the message
        if (forgotPasswordResp.payload?.name === "AxiosError") {
          messageApi.open({
            type: "error",
            content: forgotPasswordResp.payload?.response?.data?.message,
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
        content: "Forgot password failed!",
      });
    }
  };

  const handleForgotFailure = (errorInfo: any) => {
    messageApi.open({
      type: "error",
      content: "Forgot password failed!",
    });
  };

  return (
    <>
      <GlobalStyle />

      {/* <Header /> */}
      {contextHolder}
      {loading ? (
        <FullScreenLoader />
      ) : (
        <>
          <div className="bg-[#F5F5F5] flex justify-center items-center min-h-[calc(100vh-114px)]">
            {!actionDone ? (
              <ForgotPasswordComponent
                handleForgotSubmit={handleForgotSubmit}
                handleForgotFailure={handleForgotFailure}
              />
            ) : (
              <SuccessCard
                heading="Email has been sent successfully!"
                subheading="Please check your inbox."
                link="/login"
                linktext="Back to login page"
              />
            )}
          </div>
          <Footer />
        </>
      )}
    </>
  );
}

export default ForgotPassword;
