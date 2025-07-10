import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import Container from "../../../components/Layout/Container";
import FullScreenLoader from "../../../components/Loaders/FullScreenLoader";
import { HeaderContainer, Title } from "../../../shared/Nav.styled";
import { getSurveyCTOForm } from "../../../redux/surveyCTOInformation/surveyCTOInformationActions";
import { RootState } from "../../../redux/store";
import { Col, Row, Select, Tag, Tooltip } from "antd";
import { properCase, userHasPermission } from "../../../utils/helper";
import { FormItemLabel } from "./Mapping.styled";
import { CustomBtn } from "../../../shared/Global.styled";
import { QuestionCircleOutlined } from "@ant-design/icons";
import SurveyorMapping from "./SurveyorMapping";
import { getSurveyModuleQuestionnaire } from "../../../redux/surveyConfig/surveyConfigActions";
import TargetMapping from "./TargetMapping";
import SideMenu from "../SideMenu";
import { MappingWrapper } from "./Mapping.styled";
import MappingError from "../../../components/MappingError";

function MappingManage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { survey_uid, mapping_name } = useParams<any>() ?? {
    survey_uid: "",
    mapping_name: "",
  };

  // Get the form_uid parameter from the URL
  const [searchParam] = useSearchParams();
  const form_uid = searchParam.get("form_uid");
  const pageNumber = parseInt(searchParam.get("page") || "1");

  if (!survey_uid) {
    navigate("/surveys");
  }

  const userProfile = useAppSelector((state: RootState) => state.auth.profile);
  const canUserWrite = userHasPermission(
    userProfile,
    survey_uid,
    "WRITE Mapping"
  );

  const { loading: isSurveyCTOFormLoading, surveyCTOForm } = useAppSelector(
    (state: RootState) => state.surveyCTOInformation
  );

  const { loading: surveyConfigLoading, moduleQuestionnaire } = useAppSelector(
    (state: RootState) => state.surveyConfig
  );

  const { loading: isSideMenuLoading } = useAppSelector(
    (state: RootState) => state.surveyConfig
  );

  const [formUID, setFormUID] = useState<null | string>(null);
  const [criteria, setCriteria] = useState<string[]>([]);

  const handleLoadButton = () => {
    if (formUID) {
      navigate(
        `/survey-information/mapping/${mapping_name}/${survey_uid}?form_uid=${formUID}&page=1`
      );
    }
  };

  useEffect(() => {
    dispatch(getSurveyCTOForm({ survey_uid }));
    dispatch(getSurveyModuleQuestionnaire({ survey_uid }));
  }, [dispatch, survey_uid]);

  useEffect(() => {
    if (moduleQuestionnaire) {
      if (mapping_name === "surveyor") {
        setCriteria(moduleQuestionnaire.surveyor_mapping_criteria);
      } else if (mapping_name === "target") {
        setCriteria(moduleQuestionnaire.target_mapping_criteria);
      }
    } else {
      setCriteria([]);
    }
  }, [moduleQuestionnaire, mapping_name]);

  const isLoading =
    isSurveyCTOFormLoading || surveyConfigLoading || isSideMenuLoading;

  return (
    <>
      {isLoading ? (
        <FullScreenLoader />
      ) : (
        <>
          <Container surveyPage={true} />
          {criteria.length > 0 ? (
            <>
              {!form_uid ? (
                <>
                  <HeaderContainer>
                    <Title>
                      {mapping_name === "surveyor"
                        ? "Surveyors <> Supervisors"
                        : "Targets <> Supervisors"}{" "}
                      Mapping
                    </Title>
                  </HeaderContainer>
                  <div style={{ display: "flex" }}>
                    <SideMenu />
                    <MappingWrapper>
                      <p>
                        Map {mapping_name}s to supervisors based on{" "}
                        <Tooltip title="As per mapping criteria selected under module questionnaire">
                          <QuestionCircleOutlined />
                        </Tooltip>{" "}
                        :{" "}
                        {
                          // Display in tag format
                          criteria.map((c) => (
                            <Tag key={c}>{properCase(c)}</Tag>
                          ))
                        }
                      </p>
                      <Row
                        align="middle"
                        style={{ marginBottom: 6, marginTop: 12 }}
                      >
                        <Col span={5}>
                          <FormItemLabel>
                            <span style={{ color: "red" }}>*</span> SurveyCTO
                            form ID{" "}
                            <Tooltip title="Select the SurveyCTO main form ID">
                              <QuestionCircleOutlined />
                            </Tooltip>{" "}
                            :
                          </FormItemLabel>
                        </Col>
                        <Col span={8}>
                          <Select
                            style={{ width: "100%" }}
                            placeholder="Select the SCTO form"
                            value={formUID}
                            disabled={!canUserWrite}
                            onSelect={(val) => {
                              setFormUID(val as string);
                            }}
                          >
                            {surveyCTOForm?.scto_form_id && (
                              <Select.Option value={surveyCTOForm?.form_uid}>
                                {surveyCTOForm?.scto_form_id}
                              </Select.Option>
                            )}
                          </Select>
                        </Col>
                      </Row>
                      <Row style={{ marginTop: 12 }}>
                        <CustomBtn onClick={handleLoadButton}>Load</CustomBtn>
                      </Row>
                    </MappingWrapper>
                  </div>
                </>
              ) : mapping_name === "surveyor" ? (
                <SurveyorMapping
                  formUID={form_uid ?? ""}
                  SurveyUID={survey_uid ?? ""}
                  mappingName={mapping_name}
                  criteria={criteria}
                  pageNumber={pageNumber}
                />
              ) : mapping_name === "target" ? (
                <TargetMapping
                  formUID={form_uid ?? ""}
                  SurveyUID={survey_uid ?? ""}
                  mappingName={mapping_name}
                  criteria={criteria}
                  pageNumber={pageNumber}
                />
              ) : null}
            </>
          ) : (
            <>
              <HeaderContainer>
                <Title>
                  Mapping -{" "}
                  {mapping_name === "surveyor"
                    ? "Surveyors <> Supervisors"
                    : "Targets <> Supervisors"}
                </Title>
              </HeaderContainer>
              <div style={{ display: "flex" }}>
                <SideMenu />
                <MappingWrapper>
                  <MappingError
                    mappingName={mapping_name ?? ""}
                    error={
                      properCase(mapping_name ?? "") +
                      " mapping criteria not set in module questionnaire. Kindly set the criteria in module questionnaire first."
                    }
                  />
                </MappingWrapper>
              </div>
            </>
          )}
        </>
      )}
    </>
  );
}

export default MappingManage;
