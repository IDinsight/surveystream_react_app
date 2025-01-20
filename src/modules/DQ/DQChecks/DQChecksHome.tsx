import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import Container from "../../../components/Layout/Container";
import FullScreenLoader from "../../../components/Loaders/FullScreenLoader";
import { HeaderContainer, Title } from "../../../shared/Nav.styled";
import { getSurveyCTOForm } from "../../../redux/surveyCTOInformation/surveyCTOInformationActions";
import { RootState } from "../../../redux/store";
import { Col, Row, Select, Tooltip } from "antd";
import { properCase, userHasPermission } from "../../../utils/helper";
import {
  BodyContainer,
  CustomBtn,
  FormItemLabel,
  DQFormWrapper,
} from "./DQChecks.styled";
import { QuestionCircleOutlined } from "@ant-design/icons";
import SideMenu from "./../SideMenu";

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
  const canUserWrite = userHasPermission(
    userProfile,
    survey_uid,
    "WRITE Data Quality"
  );

  const { loading: isSurveyCTOFormLoading, surveyCTOForm } = useAppSelector(
    (state: RootState) => state.surveyCTOInformation
  );

  const [formUID, setFormUID] = useState<null | string>(null);

  const handleLoadButton = () => {
    if (formUID) {
      navigate(
        `/module-configuration/dq-checks/${survey_uid}/manage?form_uid=${formUID}`
      );
    }
  };

  useEffect(() => {
    dispatch(getSurveyCTOForm({ survey_uid }));
  }, [dispatch, survey_uid]);

  const isLoading = isSurveyCTOFormLoading;

  return (
    <>
      {isLoading ? (
        <FullScreenLoader />
      ) : (
        <>
          <Container surveyPage={true} />
          <HeaderContainer>
            <Title>Data quality checks</Title>
          </HeaderContainer>
          <div style={{ display: "flex" }}>
            <SideMenu />
            <DQFormWrapper>
              <p style={{ color: "#8C8C8C", fontSize: 14 }}>
                Configure data quality checks for a form
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
            </DQFormWrapper>
          </div>
        </>
      )}
    </>
  );
}

export default DQChecksHome;
