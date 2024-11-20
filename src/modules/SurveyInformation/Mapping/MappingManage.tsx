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
import { BodyContainer, CustomBtn, FormItemLabel } from "./Mapping.styled";
import { QuestionCircleOutlined } from "@ant-design/icons";
import SurveyorMapping from "./SurveyorMapping";
import { getSurveyModuleQuestionnaire } from "../../../redux/surveyConfig/surveyConfigActions";
import TargetMapping from "./TargetMapping";
import MappingStats from "../../../components/MappingStats";
import SideMenu from "../SideMenu";
import { MappingWrapper } from "./Mapping.styled";

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

  const { loading: mappingLoading, stats: mappingStats } = useAppSelector(
    (state: RootState) => state.mapping
  );

  const [formUID, setFormUID] = useState<null | string>(null);
  const [criteria, setCriteria] = useState<string[]>([]);

  const handleLoadButton = () => {
    if (formUID) {
      navigate(
        `/survey-information/mapping/${mapping_name}/${survey_uid}?form_uid=${formUID}`
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
    }
  }, [moduleQuestionnaire, mapping_name]);

  const isLoading =
    isSurveyCTOFormLoading || surveyConfigLoading || mappingLoading;

  return (
    <>
      {isLoading ? (
        <FullScreenLoader />
      ) : (
        <>
          <Container surveyPage={!form_uid ? true : false} />
          <HeaderContainer>
            <Title>
              Mapping -{" "}
              {mapping_name === "surveyor"
                ? "Surveyors <> Supervisors"
                : "Targets <> Supervisors"}
            </Title>
            {mappingStats !== null ? (
              <MappingStats stats={mappingStats} />
            ) : null}
          </HeaderContainer>
          <div style={{ display: "flex" }}>
            <SideMenu />
            <MappingWrapper>
              {!form_uid ? (
                <>
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
                        <span style={{ color: "red" }}>*</span> SCTO form ID{" "}
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
                    <CustomBtn type="primary" onClick={handleLoadButton}>
                      Load
                    </CustomBtn>
                  </Row>
                </>
              ) : mapping_name === "surveyor" ? (
                <SurveyorMapping
                  formUID={form_uid ?? ""}
                  SurveyUID={survey_uid ?? ""}
                  criteria={criteria}
                />
              ) : mapping_name === "target" ? (
                <TargetMapping
                  formUID={form_uid ?? ""}
                  SurveyUID={survey_uid ?? ""}
                  criteria={criteria}
                />
              ) : null}
            </MappingWrapper>
          </div>
        </>
      )}
    </>
  );
}

export default MappingManage;
