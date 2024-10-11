import { useAppDispatch } from "../../redux/hooks";
import { setActiveSurvey } from "../../redux/surveyList/surveysSlice";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import { StyledLinkButton } from "./SurveysHome.styled";

function ConfigureNewSurveyButton({ userProfile }: { userProfile?: any }) {
  const dispatch = useAppDispatch();

  const onConfigureNewSurvey = () => {
    dispatch(setActiveSurvey({}));
    localStorage.setItem("activeSurvey", JSON.stringify({}));
  };

  return (
    (userProfile.is_super_admin || userProfile.can_create_survey) && (
      <StyledLinkButton
        type="primary"
        icon={<PlusOutlined />}
        style={{
          marginLeft: "50px",
          backgroundColor: "#2F54EB",
        }}
        onClick={onConfigureNewSurvey}
        id="configure-new-survey-link"
        href="/new-survey-config"
      >
        Configure new survey
      </StyledLinkButton>
    )
  );
}

export default ConfigureNewSurveyButton;
