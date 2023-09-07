import { Form, Input, message } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { FileAddOutlined } from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { RootState } from "../../../redux/store";
import {
  getSurveyLocationGeoLevels,
  postSurveyLocationGeoLevels,
} from "../../../redux/surveyLocations/surveyLocationsActions";
import {
  resetSurveyLocations,
  setSurveyLocationGeoLevels,
} from "../../../redux/surveyLocations/surveyLocationsSlice";
import {
  DescriptionText,
  SurveyLocationFormWrapper,
} from "./SurveyLocationAdd.styled";
import {
  AddAnotherButton,
  DynamicItemsForm,
  StyledFormItem,
} from "../SurveyInformation.styled";
import {
  ContinueButton,
  FooterWrapper,
  SaveButton,
} from "../../../shared/FooterBar.styled";
import {
  NavWrapper,
  BackLink,
  BackArrow,
  Title,
} from "../../../shared/Nav.styled";
import SideMenu from "../SideMenu";
import FullScreenLoader from "../../../components/Loaders/FullScreenLoader";
import Header from "../../../components/Header";

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
    (state: RootState) => state.surveys.activeSurvey
  );
  const surveyLocationGeoLevels = useAppSelector(
    (state: RootState) => state.surveyLocations.surveyLocationGeoLevels
  );
  const isLoading = useAppSelector(
    (state: RootState) => state.surveyLocations.loading
  );

  const [numLocationFields, setNumLocationFields] = useState(
    surveyLocationGeoLevels.length !== 0 ? surveyLocationGeoLevels.length : 1
  );
  const handleFormValuesChange = async () => {
    const formValues = form.getFieldsValue();

    const filteredGeoLevels = Object.keys(formValues).reduce(
      (geoLevels: any[], fieldName: string) => {
        const fieldValue = formValues[fieldName];

        if (fieldValue !== undefined && fieldValue !== "") {
          geoLevels.push({ geo_level_name: fieldValue });
        }

        return geoLevels;
      },
      []
    );
    dispatch(setSurveyLocationGeoLevels(filteredGeoLevels));
  };
  const fetchSurveyLocationGeoLevels = async () => {
    if (survey_uid !== undefined) {
      const res = await dispatch(
        getSurveyLocationGeoLevels({ survey_uid: survey_uid })
      );
      setNumLocationFields(res.payload.length === 0 ? 1 : res.payload.length);
      if (res.payload.length > 0) {
        form.setFieldValue("geo_level_0", res.payload[0].geo_level_name);
      }
    }
  };
  const renderLocationFields = () => {
    const fields = Array.from({ length: numLocationFields }, (_, index) => {
      const geoLevel: {
        geo_level_name?: string;
        parent_geo_level_uid?: string;
      } = numLocationFields === 1 ? {} : surveyLocationGeoLevels[index];

      return (
        <StyledFormItem
          key={index}
          required
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 11 }}
          name={`geo_level_${index}`}
          label={<span>Location {index + 1}</span>}
          initialValue={
            geoLevel?.geo_level_name ? geoLevel?.geo_level_name : ""
          }
          rules={[
            {
              required: true,
              message: "Please enter a geo level name!",
            },
            {
              validator: (_: any, value: any) => {
                if (
                  value &&
                  Object.values(surveyLocationGeoLevels).filter(
                    (r: {
                      geo_level_name: any;
                      parent_geo_level_uid?: string | undefined;
                    }) => r.geo_level_name === value
                  ).length > 1
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
    return form
      .validateFields()
      .then(() => {
        setNumLocationFields(numLocationFields + 1);
      })
      .catch((error) => {
        console.error(error);
        return false;
      });
  };

  const handleLocationAddContinue = async () => {
    try {
      if (survey_uid !== undefined) {
        const formValues = form.getFieldsValue();

        const filteredGeoLevels = Object.keys(formValues).reduce(
          (geoLevels: any[], fieldName: string) => {
            const fieldValue = formValues[fieldName];

            if (fieldValue !== undefined && fieldValue !== "") {
              geoLevels.push({ geo_level_name: fieldValue });
            }

            return geoLevels;
          },
          []
        );

        const updatedGeoLevels = filteredGeoLevels.map((location) => {
          const matchingLevel = surveyLocationGeoLevels.find(
            (filteredLevel) =>
              filteredLevel.geo_level_name === location.geo_level_name
          );

          if (matchingLevel) {
            return {
              ...location,
              geo_level_uid: matchingLevel.geo_level_uid || null,
              parent_geo_level_uid: matchingLevel.parent_geo_level_uid || null,
            };
          }
          return {
            ...location,
            geo_level_uid: null,
            parent_geo_level_uid: null,
          };
        });

        if (updatedGeoLevels.length === 0) {
          message.error("Please fill in at least one location geo level!");
        } else {
          dispatch(setSurveyLocationGeoLevels(updatedGeoLevels));
        }

        setLoading(true);

        const surveyGeoLevelsData = updatedGeoLevels;

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
          "Kindly check that survey_uid is provided in the URL to proceed."
        );
      }
    } catch (error) {
      message.error("Please fill in all required fields.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSurveyLocationGeoLevels();

    return () => {
      dispatch(resetSurveyLocations());
    };
  }, [dispatch]);

  return (
    <>
      <Header />
      <NavWrapper>
        <BackLink onClick={handleGoBack}>
          <BackArrow />
        </BackLink>
        <Title>{activeSurvey?.survey_name}</Title>
      </NavWrapper>
      {isLoading ? (
        <FullScreenLoader />
      ) : (
        <div style={{ display: "flex" }}>
          <SideMenu />
          <SurveyLocationFormWrapper>
            <Title>Survey location: Add location</Title>
            <DescriptionText>
              Please create the locations for your survey. Examples of
              locations: state, district, and block
            </DescriptionText>
            <div style={{ marginTop: "40px" }}>
              <DynamicItemsForm
                form={form}
                onValuesChange={handleFormValuesChange}
              >
                {renderLocationFields()}
                <StyledFormItem
                  labelCol={{ span: 5 }}
                  wrapperCol={{ span: 11 }}
                >
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
      )}
      <FooterWrapper>
        <SaveButton>Save</SaveButton>
        <ContinueButton
          onClick={handleLocationAddContinue}
          loading={loading}
          disabled={surveyLocationGeoLevels.length === 0}
        >
          Continue
        </ContinueButton>
      </FooterWrapper>
    </>
  );
}

export default SurveyLocationAdd;
