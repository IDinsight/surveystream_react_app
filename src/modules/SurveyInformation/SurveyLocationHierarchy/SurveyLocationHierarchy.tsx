import { Form, Radio, Select, message } from "antd";
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
import {
  resetSurveyLocations,
  setSurveyLocationGeoLevels,
} from "../../../redux/surveyLocations/surveyLocationsSlice";
import FullScreenLoader from "../../../components/Loaders/FullScreenLoader";

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

  useEffect(() => {
    fetchSurveyLocationGeoLevels();

    return () => {
      dispatch(resetSurveyLocations());
    };
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
      setLoading(false);
      // Save successful, navigate to the next step
    } catch (error) {
      setLoading(false);
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
      {isLoading ? (
        <FullScreenLoader />
      ) : (
        <div style={{ display: "flex" }}>
          <SideMenu />
          <SurveyLocationHierarchyFormWrapper>
            <Title>Survey Location: Hierarchy</Title>
            <DescriptionText>
              Please add locations for this survey
            </DescriptionText>
            <div style={{ marginTop: "30px" }}>
              <DynamicItemsForm form={form}>
                {renderHierarchyGeoLevelsField()}
              </DynamicItemsForm>
            </div>
            <div style={{ marginTop: "20px" }}>
              <DescriptionText>Select the prime geo location</DescriptionText>
              <StyledFormItem name={`prime_geo_level`}>
                <Select defaultValue="no_location">
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
        <SaveButton>Save</SaveButton>
        <ContinueButton loading={loading} onClick={handleHierarchyContinue}>
          Continue
        </ContinueButton>
      </FooterWrapper>
    </>
  );
}

export default SurveyLocationHierarchy;
