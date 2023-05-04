import { useEffect, useState } from "react";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import ResetPasswordComponent from "../../../components/ResetPasswordComponent";
import SuccessCard from "../../../components/SuccessCard";

// TODO: Moved these type while integration
type ResetPasswordData = {
  rpt_id: string;
  rpt_token: string;
  new_password: string;
  confirm: string;
};

type ResetParams = {
  new_password: string;
  confirm: string;
};

function ResetPassword() {
  const [urlArr, setUrlARr] = useState<string[]>();
  const [actionDone, setActionDone] = useState<boolean>(false);

  const handleResetSubmit = (values: ResetParams) => {
    if (urlArr && urlArr?.length >= 2) {
      const requestData: ResetPasswordData = {
        ...values,
        rpt_id: urlArr[2],
        rpt_token: urlArr[3],
      };
      // TODO: Add Dispatch here
      console.log(requestData);
      setActionDone(true);
      return;
    }
  };

  const handleResetFailure = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  useEffect(() => {
    setUrlARr(window.location.pathname.split("/"));
  }, []);

  return (
    <>
      <Header />
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
  );
}

export default ResetPassword;
