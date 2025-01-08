import { useEffect, useState } from "react";
import Container from "../../../components/Layout/Container";
import FullScreenLoader from "../../../components/Loaders/FullScreenLoader";
import { HeaderContainer } from "../../../shared/Nav.styled";
import { DQFormWrapper } from "./DQChecks.styled";
import { useNavigate, useParams } from "react-router-dom";
import { fetchDQCheckTypes } from "../../../redux/dqChecks/apiService";
import DQCheckGroup1 from "./DQCheckGroup1";
import DQCheckGroup2 from "./DQCheckGroup2";
import { Breadcrumb } from "antd";
import SideMenu from "./../SideMenu";
import DQCheckGroup3 from "./DQCheckGroup3";

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
          <Container surveyPage={true} />
          <HeaderContainer>
            <Breadcrumb
              separator=">"
              style={{ fontSize: "16px", color: "#000" }}
              items={[
                {
                  title: "Data quality checks",
                  href: `/module-configuration/dq-checks/${survey_uid}/manage?form_uid=${form_uid}`,
                },
                {
                  title: `${checkName} checks`,
                },
              ]}
            />
          </HeaderContainer>
          <div style={{ display: "flex" }}>
            <SideMenu></SideMenu>
            <DQFormWrapper>
              {["Missing", "Don't know", "Refusal"].includes(checkName) && (
                <DQCheckGroup1
                  surveyUID={survey_uid || ""}
                  formUID={form_uid || ""}
                  typeID={type_id || ""}
                />
              )}
              {["Mismatch", "Protocol violation", "Spotcheck score"].includes(
                checkName
              ) && (
                <DQCheckGroup3
                  surveyUID={survey_uid || ""}
                  formUID={form_uid || ""}
                  typeID={type_id || ""}
                />
              )}
              {["Constraint", "Outlier"].includes(checkName) && (
                <DQCheckGroup2
                  surveyUID={survey_uid || ""}
                  formUID={form_uid || ""}
                  typeID={type_id || ""}
                />
              )}
            </DQFormWrapper>
          </div>
        </>
      )}
    </>
  );
}

export default DQChecksEdit;
