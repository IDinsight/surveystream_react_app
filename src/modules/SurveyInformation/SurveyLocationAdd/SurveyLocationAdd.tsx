import { Form, Input, message } from "antd";
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
  IconText,
  SurveyLocationFormWrapper,
} from "./SurveyLocationAdd.styled";
import { ChangeEvent, useEffect, useState } from "react";
import { FileAddOutlined } from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { RootState } from "../../../redux/store";
import {
  getSurveyLocationGeoLevels,
  postSurveyLocationGeoLevels,
} from "../../../redux/surveyLocations/surveyLocationsActions";
import {
  addSurveyLocationGeoLevel,
  setSurveyLocationGeoLevel,
} from "../../../redux/surveyLocations/surveyLocationsSlice";
import {
  AddAnotherButton,
  DynamicItemsForm,
  StyledFormItem,
} from "../SurveyInformation.styled";

function SurveyLocationAdd() {
  const { survey_uid } = useParams<{ survey_uid?: string }>() ?? {
    survey_uid: "",
  };
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
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

  const renderLocationFields = () => {
    const numLevels = surveyLocationGeoLevels.length;
    const fields = Array.from({ length: numLevels + 1 }, (_, index) => {
      const geoLevel: {
        geo_level_name?: string;
        parent_geo_level_uid?: string;
      } = numLevels === 0 ? {} : surveyLocationGeoLevels[index];

      return (
        <StyledFormItem
          key={index}
          required
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 11 }}
          name={`geo_level_${index}`}
          label={<span>Location {index + 1}</span>}
          initialValue={geoLevel.geo_level_name ? geoLevel.geo_level_name : ""}
          rules={[
            {
              required: true,
              message: "Please enter a geo level name!",
            },
            {
              validator: (_: any, value: any) => {
                if (
                  value &&
                  surveyLocationGeoLevels.some(
                    (r: {
                      geo_level_name: any;
                      parent_geo_level_uid?: string | undefined;
                    }) => r.geo_level_name === value && r !== geoLevel
                  )
                ) {
                  return Promise.reject("Please use unique geo level name!");
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input placeholder="Enter location label" style={{ width: "100%" }} />
        </StyledFormItem>
      );
    });

    return fields;
  };

  const handleAddGeoLevel = () => {
    form.validateFields().then(() => {
      const lastRoleIndex = surveyLocationGeoLevels.length;

      const newGeoLevel = form.getFieldValue(`geo_level_${lastRoleIndex}`);

      const isDuplicate = surveyLocationGeoLevels.some(
        (geoLevel: { geo_level_name: string }) =>
          geoLevel.geo_level_name === newGeoLevel
      );

      if (!isDuplicate) {
        const geoLevel = {
          geo_level_name: newGeoLevel,
        };

        dispatch(addSurveyLocationGeoLevel(geoLevel));
      } else {
        message.error("Geo level already exists!");
      }
    });
  };

  const handleLocationAddContinue = async () => {
    try {
      if (survey_uid != undefined) {
        const filteredGeoLevels = surveyLocationGeoLevels?.filter(
          (geoLevel: { geo_level_name: string }) => geoLevel.geo_level_name
        );

        if (filteredGeoLevels.length === 0) {
          message.error("Please fill in at least one location geo level!");
        } else {
          dispatch(setSurveyLocationGeoLevel(filteredGeoLevels));
        }

        setLoading(true);

        const surveyGeoLevelsData = filteredGeoLevels;

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

        navigate(`/survey-information/location/hierarchy/${survey_uid}`);
      } else {
        message.error(
          "Kindly check that survey_uid is provided in the url to proceed."
        );
      }
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
        <SurveyLocationFormWrapper>
          <Title>Survey location: Add location</Title>
          <DescriptionText>
            Please create the locations for your survey. Examples of locations:
            state, district, and block
          </DescriptionText>
          <div style={{ marginTop: "40px" }}>
            <DynamicItemsForm form={form}>
              {renderLocationFields()}
              <StyledFormItem labelCol={{ span: 5 }} wrapperCol={{ span: 11 }}>
                <AddAnotherButton
                  onClick={handleAddGeoLevel}
                  type="dashed"
                  style={{ width: "100%" }}
                >
                  <FileAddOutlined /> Add another location
                </AddAnotherButton>
              </StyledFormItem>
            </DynamicItemsForm>
          </div>
        </SurveyLocationFormWrapper>
      </div>
      <FooterWrapper>
        <SaveButton>Save</SaveButton>
        <ContinueButton
          onClick={handleLocationAddContinue}
          loading={loading}
          disabled={surveyLocationGeoLevels.length == 0}
        >
          Continue
        </ContinueButton>
      </FooterWrapper>
    </>
  );
}

export default SurveyLocationAdd;
