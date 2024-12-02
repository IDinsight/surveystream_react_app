import { useEffect, useState } from "react";
import Container from "../../../components/Layout/Container";
import FullScreenLoader from "../../../components/Loaders/FullScreenLoader";
import { HeaderContainer, Title } from "../../../shared/Nav.styled";
import { BodyContainer } from "./DQChecks.styled";
import { useNavigate, useParams } from "react-router-dom";
import { fetchDQCheckTypes } from "../../../redux/dqChecks/apiService";
import DQCheckGroup1 from "./DQCheckGroup1";

function DQChecksEdit() {
  const navigate = useNavigate();

  const { survey_uid, form_uid, type_id } = useParams<any>() ?? {
    survey_uid: "",
    form_uid: "",
    type_id: "",
  };

  const [loading, setLoading] = useState<boolean>(false);
  const [checkName, setCheckName] = useState<string>("");

  useEffect(() => {
    if (type_id) {
      setLoading(true);
      fetchDQCheckTypes().then((res: any) => {
        if (res?.data?.success) {
          setLoading(false);
          const allChecks = res.data.data;
          const selectedCheck = allChecks.find(
            (check: any) => check.type_id === Number(type_id)
          );
          setCheckName(selectedCheck?.name);
        }
      });
    }
  }, [type_id]);

  const isLoading = loading;

  if (!survey_uid || !form_uid || !type_id) {
    navigate("/surveys");
  }

  return (
    <>
      {isLoading ? (
        <FullScreenLoader />
      ) : (
        <>
          <Container />
          <HeaderContainer>
            <Title>{checkName} Checks</Title>
          </HeaderContainer>
          <BodyContainer>
            {["Missing", "Don't know", "Refusal"].includes(checkName) && (
              <DQCheckGroup1
                surveyUID={survey_uid || ""}
                formUID={form_uid || ""}
                typeID={type_id || ""}
              />
            )}
          </BodyContainer>
        </>
      )}
    </>
  );
}

export default DQChecksEdit;
