import { Form, Radio, Select, message } from "antd";
import { useNavigate, useParams } from "react-router-dom";

import Header from "../../../components/Header.OLD";
import {
  NavWrapper,
  BackLink,
  BackArrow,
  Title,
  HeaderContainer,
} from "../../../shared/Nav.styled";

import {
  FooterWrapper,
  SaveButton,
  ContinueButton,
} from "../../../shared/FooterBar.styled";
import SideMenu from "../SideMenu";
import {
  DescriptionText,
  SurveyLocationHierarchyFormWrapper,
} from "./SurveyLocationHierarchy.styled";
import { useEffect, useState } from "react";
import { RootState } from "../../../redux/store";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import {
  getSurveyLocationGeoLevels,
  postSurveyLocationGeoLevels,
  updateSurveyPrimeGeoLocation,
} from "../../../redux/surveyLocations/surveyLocationsActions";
import { DynamicItemsForm, StyledFormItem } from "../SurveyInformation.styled";
import {
  resetSurveyLocations,
  setSurveyLocationGeoLevels,
} from "../../../redux/surveyLocations/surveyLocationsSlice";
import FullScreenLoader from "../../../components/Loaders/FullScreenLoader";
import { getSurveyBasicInformation } from "../../../redux/surveyConfig/surveyConfigActions";
import { GlobalStyle } from "../../../shared/Global.styled";
import Container from "../../../components/Layout/Container";

function SurveyLocationHierarchy() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { survey_uid } = useParams<{ survey_uid?: string }>() ?? {
    survey_uid: "",
  };
  const [loading, setLoading] = useState(false);
  const [surveyBasicInformation, setSurveyBasicInformation] = useState({});
  const [surveyPrimeGeoLocation, setSurveyPrimeGeoLocation] =
    useState<any>("no_location");

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(`/survey-configuration/${survey_uid}`);
    }
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

  const fetchSurveyLocationGeoLevels = async () => {
    if (survey_uid != undefined) {
      await dispatch(getSurveyLocationGeoLevels({ survey_uid: survey_uid }));
    }
  };

  const fetchSurveyBasicInformation = async () => {
    const surveyBasicInformationRes = await dispatch(
      getSurveyBasicInformation({ survey_uid: survey_uid })
    );
    if (surveyBasicInformationRes?.payload) {
      setSurveyBasicInformation(surveyBasicInformationRes.payload);
      if (surveyBasicInformationRes.payload?.prime_geo_level_uid !== null) {
        console.log(
          "surveyBasicInformationRes.payload?.prime_geo_level_uid",
          surveyBasicInformationRes.payload?.prime_geo_level_uid
        );
        setSurveyPrimeGeoLocation(
          surveyBasicInformationRes.payload?.prime_geo_level_uid
        );
      }
    } else {
      message.error(
        "Could not load survey basic information, kindly reload to try again"
      );
    }
  };

  const updatePrimeGeoLocation = async (
    survey_uid: string,
    prime_geo_location: string
  ) => {
    const payload: any = {
      prime_geo_level_uid: prime_geo_location,
    };

    const updateRes = await dispatch(
      updateSurveyPrimeGeoLocation({
        payload: payload,
        surveyUid: survey_uid,
      })
    );

    console.log("updateRes", updateRes);

    if (updateRes?.payload?.success) {
      message.success("Updated the survey prime geo location");
    } else {
      message.error("Failed to updated the survey prime geo location");
    }
  };

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
          label={geoLevel.geo_level_name ? geoLevel?.geo_level_name : ""}
          initialValue={
            geoLevel?.parent_geo_level_uid
              ? geoLevel?.parent_geo_level_uid
              : null
          }
          rules={[
            {
              validator: (_: any, value: string | undefined) => {
                const hierarchyMap: { [key: string]: string[] } =
                  surveyLocationGeoLevels.reduce((map, item) => {
                    const { parent_geo_level_uid, geo_level_uid } = item;
                    if (parent_geo_level_uid !== null) {
                      if (!map[parent_geo_level_uid]) {
                        map[parent_geo_level_uid] = [];
                      }
                      map[parent_geo_level_uid].push(geo_level_uid);
                    }
                    return map;
                  }, {} as { [key: string]: string[] });

                const hasCycle = (node: string, visited: string[] = []) => {
                  visited.push(node);

                  const children = hierarchyMap[node] || [];

                  for (let i = 0; i < children.length; i++) {
                    const child = children[i];

                    if (visited.includes(child)) {
                      return true; // Cycle detected
                    }

                    if (hasCycle(child, [...visited])) {
                      return true; // Cycle detected in child subtree
                    }
                  }

                  return false; // No cycle detected
                };

                if (geoLevel) {
                  const { geo_level_uid } = geoLevel;

                  if (
                    value &&
                    surveyLocationGeoLevels.some(
                      (g) => g.parent_geo_level_uid === value && g !== geoLevel
                    )
                  ) {
                    return Promise.reject("Please select a unique hierarchy!");
                  }
                  if (value && value === geoLevel.geo_level_uid) {
                    return Promise.reject("Location hierarchy invalid!");
                  }
                  if (geo_level_uid && hasCycle(geo_level_uid)) {
                    return Promise.reject("Location hierarchy cycle detected!");
                  }
                }

                return Promise.resolve();
              },
            },
          ]}
        >
          <Select
            showSearch={true}
            allowClear={true}
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

    dispatch(setSurveyLocationGeoLevels(updatedLevels));
  };

  const handlePrimeSelectChange = (value: any) => {
    setSurveyPrimeGeoLocation(value);
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

        console.log("geoLevelsRes", geoLevelsRes);

        if (geoLevelsRes.payload.status === false) {
          message.error(geoLevelsRes.payload.message);
          return;
        } else {
          message.success("Survey GeoLevels updated successfully.");
          if (
            surveyPrimeGeoLocation !== null &&
            surveyPrimeGeoLocation !== "no_location"
          ) {
            updatePrimeGeoLocation(survey_uid, surveyPrimeGeoLocation);
          }

          navigate(`/survey-information/location/upload/${survey_uid}`);
        }
      } else {
        message.error(
          "Kindly check that survey_uid is provided in the url to proceed."
        );
      }
      setLoading(false);
      // Save successful, navigate to the next step
    } catch (error) {
      setLoading(false);
      message.error("Please fill in all required fields.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSurveyBasicInformation();
    fetchSurveyLocationGeoLevels();
    return () => {
      dispatch(resetSurveyLocations());
    };
  }, [dispatch]);

  return (
    <>
      <GlobalStyle />
      {/* <Header /> */}
      <Container />
      <HeaderContainer>
        <Title>Survey locations hierarchy</Title>

        <div
          style={{ display: "flex", marginLeft: "auto", marginBottom: "15px" }}
        ></div>
      </HeaderContainer>
      {isLoading ? (
        <FullScreenLoader />
      ) : (
        <div style={{ display: "flex" }}>
          <SideMenu />
          <SurveyLocationHierarchyFormWrapper>
            <DescriptionText>
              Update or add location hierarchy for this survey
            </DescriptionText>
            <div style={{ marginTop: "30px" }}>
              <DynamicItemsForm form={form}>
                {renderHierarchyGeoLevelsField()}
              </DynamicItemsForm>
            </div>
            <div style={{ marginTop: "20px" }}>
              <DescriptionText>Select the prime geo location</DescriptionText>
              <StyledFormItem name={`prime_geo_level`} style={{ width: "40%" }}>
                <Select
                  defaultValue={surveyPrimeGeoLocation}
                  value={surveyPrimeGeoLocation}
                  onChange={handlePrimeSelectChange}
                >
                  <Select.Option value="no_location">
                    No location mapping
                  </Select.Option>
                  {surveyLocationGeoLevels.map((g, i) => (
                    <Select.Option key={i} value={g.geo_level_uid}>
                      {g.geo_level_name}
                    </Select.Option>
                  ))}
                </Select>
              </StyledFormItem>
            </div>
          </SurveyLocationHierarchyFormWrapper>
        </div>
      )}
      <FooterWrapper>
        <ContinueButton loading={loading} onClick={handleHierarchyContinue}>
          Continue
        </ContinueButton>
      </FooterWrapper>
    </>
  );
}

export default SurveyLocationHierarchy;
