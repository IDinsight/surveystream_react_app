import { BackArrow, BackLink } from "../../shared/Nav.styled";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";

const HandleBack = () => {
  const { survey_uid } = useParams<{ survey_uid: string }>() ?? {
    survey_uid: "",
  };
  const navigate = useNavigate();

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(`/survey-configuration/${survey_uid}`);
    }
  };

  return (
    <BackLink onClick={handleGoBack}>
      <BackArrow />
    </BackLink>
  );
};

export default HandleBack;
