import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import Container from "../../components/Layout/Container";
import FullScreenLoader from "../../components/Loaders/FullScreenLoader";
import { HeaderContainer, Title } from "../../shared/Nav.styled";
import { getSurveyCTOForm } from "../../redux/surveyCTOInformation/surveyCTOInformationActions";
import { RootState } from "../../redux/store";
import { Col, Row, Select, Tooltip } from "antd";
import { properCase, userHasPermission } from "../../utils/helper";
import { BodyContainer, CustomBtn, FormItemLabel } from "./Mapping.styled";
import { QuestionCircleOutlined } from "@ant-design/icons";
import SurveyorMapping from "./SurveyorMapping";
import { getSurveyModuleQuestionnaire } from "../../redux/surveyConfig/surveyConfigActions";
import TargetMapping from "./TargetMapping";
import MappingStats from "../../components/MappingStats";

function MappingManage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { survey_uid, mapping_name } = useParams<any>() ?? {
    survey_uid: "",
    mapping_name: "",
  };

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

  const [formID, setFormID] = useState<null | string>(null);
  const [isFormIDSelected, setIsFormIDSelected] = useState(false);

  const [criteria, setCriteria] = useState<string[]>([]);

  const handleLoadButton = () => {
    setIsFormIDSelected(true);
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
          <Container />
          <HeaderContainer>
            <Title>Mapping</Title>
            {mappingStats !== null ? (
              <MappingStats stats={mappingStats} />
            ) : null}
          </HeaderContainer>
          <BodyContainer>
            {!isFormIDSelected ? (
              <>
                <p>
                  Map {properCase(mapping_name || "")}s to Supervisors based on:{" "}
                  {criteria?.join(", ")}
                </p>
                <Row align="middle" style={{ marginBottom: 6, marginTop: 12 }}>
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
                      value={formID}
                      disabled={!canUserWrite}
                      onSelect={(val) => {
                        setFormID(val as string);
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
                formUID={formID ?? ""}
                SurveyUID={survey_uid ?? ""}
                criteria={criteria}
              />
            ) : mapping_name === "target" ? (
              <TargetMapping
                formUID={formID ?? ""}
                SurveyUID={survey_uid ?? ""}
                criteria={criteria}
              />
            ) : null}
          </BodyContainer>
        </>
      )}
    </>
  );
}

export default MappingManage;
