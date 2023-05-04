import { useState } from "react";
import Footer from "../../../components/Footer";
import Header from "../../../components/Header";
import ForgotPasswordComponent from "../../../components/ForgotPasswordComponent";
import SuccessCard from "../../../components/SuccessCard";

function ForgotPassword() {
  const [actionDone, setActionDone] = useState<boolean>(false);

  const handleForgotSubmit = (values: { email: string }) => {
    // TODO: Add dispatch
    console.log(values);
    setActionDone(true);
  };

  const handleForgotFailure = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <>
      <Header />
      <div className="bg-[#F5F5F5] flex justify-center items-center min-h-[calc(100vh-114px)]">
        {actionDone !== true ? (
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
  );
}

export default ForgotPassword;
