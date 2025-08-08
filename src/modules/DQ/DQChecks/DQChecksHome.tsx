import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import FullScreenLoader from "../../../components/Loaders/FullScreenLoader";
import { getSurveyCTOForm } from "../../../redux/surveyCTOInformation/surveyCTOInformationActions";
import { RootState } from "../../../redux/store";
import { message } from "antd";
function DQChecksHome() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { survey_uid } = useParams<any>() ?? {
    survey_uid: "",
  };

  // Get the form_uid parameter from the URL
  const [searchParam] = useSearchParams();
  const form_uid = searchParam.get("form_uid");

  if (!survey_uid) {
    navigate("/surveys");
  }

  const userProfile = useAppSelector((state: RootState) => state.auth.profile);

  const [formUID, setFormUID] = useState<null | string>(null);

  const handleFormUID = async () => {
    if (form_uid == "" || form_uid == undefined || form_uid == "undefined") {
      try {
        const sctoForm = await dispatch(
          getSurveyCTOForm({ survey_uid: survey_uid })
        );
        if (sctoForm?.payload[0]?.form_uid) {
          navigate(
            `/module-configuration/dq-checks/${survey_uid}/manage?form_uid=${sctoForm?.payload[0]?.form_uid}`
          );
        } else {
          message.error("Kindly configure SCTO Form to proceed");
          navigate(`/survey-information/survey-cto-information/${survey_uid}`);
        }
      } catch (error) {
        console.log("Error fetching sctoForm:", error);
      }
    }
  };

  useEffect(() => {
    dispatch(getSurveyCTOForm({ survey_uid }));
    handleFormUID();
  }, [dispatch, survey_uid]);

  return (
    <>
      <FullScreenLoader />
    </>
  );
}

export default DQChecksHome;
