import { Form, Select, message } from "antd";
import { useNavigate, useParams } from "react-router-dom";

import Header from "../../../components/Header";
import {
  NavWrapper,
  BackLink,
  BackArrow,
  Title,
} from "../../../shared/Nav.styled";

import {
  FooterWrapper,
  SaveButton,
  ContinueButton,
} from "../../../shared/FooterBar.styled";
import SideMenu from "../SideMenu";
import {
  DescriptionText,
  SelectItem,
  SurveyLocationHierarchyFormWrapper,
} from "./SurveyLocationHierarchy.styled";
import { useEffect, useState } from "react";
import { RootState } from "../../../redux/store";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import {
  getSurveyLocationGeoLevels,
  postSurveyLocationGeoLevels,
} from "../../../redux/surveyLocations/surveyLocationsActions";
import { DynamicItemsForm, StyledFormItem } from "../SurveyInformation.styled";
import { GeoLevel } from "../../../redux/surveyLocations/types";
import { setSurveyLocationGeoLevel } from "../../../redux/surveyLocations/surveyLocationsSlice";

interface ILocationHierarchySelect {
  name: string;
  value: string;
}

function SurveyLocationHierarchy() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { survey_uid } = useParams<{ survey_uid?: string }>() ?? {
    survey_uid: "",
  };
  const [loading, setLoading] = useState(false);

  const handleGoBack = () => {
    navigate(-1);
  };
  const activeSurvey = useAppSelector(
    (state: RootState) => state.reducer.surveys.activeSurvey
  );
  const surveyLocationGeoLevels = useAppSelector(
    (state: RootState) => state.reducer.surveyLocations.surveyLocationGeoLevels
  );

  const fetchSurveyLocationGeoLevels = async () => {
    if (survey_uid != undefined) {
      await dispatch(getSurveyLocationGeoLevels({ survey_uid: survey_uid }));
    }
  };

  useEffect(() => {
    fetchSurveyLocationGeoLevels();
  }, [dispatch]);

  const renderHierarchyGeoLevelsField = () => {
    const numGeoLevels = surveyLocationGeoLevels.length;

    const fields = Array.from({ length: numGeoLevels }, (_, index) => {
      const geoLevel: {
        parent_geo_level_uid?: string;
        geo_level_name?: string;
        geo_level_uid?: string;
      } = surveyLocationGeoLevels[index];

      return (
        <StyledFormItem
          key={index}
          required
          labelCol={{ span: 11 }}
          wrapperCol={{ span: 11 }}
          name={`geo_level_${index}`}
          label={geoLevel.geo_level_name ? geoLevel.geo_level_name : ""}
          initialValue={
            geoLevel.parent_geo_level_uid ? geoLevel.parent_geo_level_uid : null
          }
          rules={[
            {
              validator: (_: any, value: string | undefined) => {
                if (value && value === geoLevel.geo_level_uid) {
                  return Promise.reject("Location hierarchy invalid!");
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Select
            placeholder="Choose hierarchy"
            style={{ width: "100%" }}
            onChange={(value) => handleSelectChange(value, index)}
          >
            <Select.Option value={null}>Highest hierarchy level</Select.Option>
            {surveyLocationGeoLevels.map((g, i) => (
              <Select.Option key={i} value={g.geo_level_uid}>
                {g.geo_level_name}
              </Select.Option>
            ))}
          </Select>
        </StyledFormItem>
      );
    });

    return fields;
  };

  const handleSelectChange = (value: string, index: number) => {
    const updatedLevels = [...surveyLocationGeoLevels];

    updatedLevels[index] = {
      ...updatedLevels[index],
      parent_geo_level_uid: value,
    };

    dispatch(setSurveyLocationGeoLevel(updatedLevels));
  };

  const handleHierarchyContinue = async () => {
    try {
      if (survey_uid != undefined) {
        setLoading(true);

        await form.validateFields();

        const surveyGeoLevelsData = surveyLocationGeoLevels;

        const geoLevelsRes = await dispatch(
          postSurveyLocationGeoLevels({
            geoLevelsData: surveyGeoLevelsData,
            surveyUid: survey_uid,
          })
        );

        if (geoLevelsRes.payload.status === false) {
          message.error(geoLevelsRes.payload.message);
          return;
        } else {
          message.success("Survey GeoLevels updated successfully.");
        }

        navigate(`/survey-information/location/upload/${survey_uid}`);
      } else {
        message.error(
          "Kindly check that survey_uid is provided in the url to proceed."
        );
      }

      // Save successful, navigate to the next step
    } catch (error) {
      message.error("Please fill in all required fields.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <NavWrapper>
        <BackLink onClick={handleGoBack}>
          <BackArrow />
        </BackLink>
        <Title> {activeSurvey?.survey_name} </Title>
      </NavWrapper>
      <div style={{ display: "flex" }}>
        <SideMenu />
        <SurveyLocationHierarchyFormWrapper>
          <Title>Survey Location: Hierarchy</Title>
          <DescriptionText>
            Please add locations for this survey
          </DescriptionText>
          <div style={{ marginTop: "40px" }}>
            <DynamicItemsForm form={form}>
              {renderHierarchyGeoLevelsField()}
            </DynamicItemsForm>
          </div>
        </SurveyLocationHierarchyFormWrapper>
      </div>
      <FooterWrapper>
        <SaveButton>Save</SaveButton>
        <ContinueButton loading={loading} onClick={handleHierarchyContinue}>
          Continue
        </ContinueButton>
      </FooterWrapper>
    </>
  );
}

export default SurveyLocationHierarchy;
