import { Form, Select, message } from "antd";
import { useNavigate, useParams } from "react-router-dom";

import { Title, HeaderContainer } from "../../../shared/Nav.styled";

import {
  FooterWrapper,
  ContinueButton,
} from "../../../shared/FooterBar.styled";
import SideMenu from "../SideMenu";
import {
  DescriptionText,
  SurveyLocationHierarchyFormWrapper,
} from "./SurveyLocationHierarchy.styled";
import React, { useEffect, useState } from "react";
import { RootState } from "../../../redux/store";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import {
  getSurveyLocationGeoLevels,
  postSurveyLocationGeoLevels,
  updateSurveyPrimeGeoLocation,
} from "../../../redux/surveyLocations/surveyLocationsActions";
import { StyledFormItem } from "../SurveyInformation.styled";
import {
  resetSurveyLocations,
  setSurveyLocationGeoLevels,
} from "../../../redux/surveyLocations/surveyLocationsSlice";
import FullScreenLoader from "../../../components/Loaders/FullScreenLoader";
import { getSurveyBasicInformation } from "../../../redux/surveyConfig/surveyConfigActions";
import { GlobalStyle } from "../../../shared/Global.styled";
import Container from "../../../components/Layout/Container";

function SurveyLocationHierarchy() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { survey_uid } = useParams<{ survey_uid?: string }>() ?? {
    survey_uid: "",
  };
  const [loading, setLoading] = useState(false);
  const [surveyBasicInformation, setSurveyBasicInformation] = useState({});
  const [surveyPrimeGeoLocation, setSurveyPrimeGeoLocation] =
    useState<any>("no_location");

  const surveyLocationGeoLevels = useAppSelector(
    (state: RootState) => state.surveyLocations.surveyLocationGeoLevels
  );
  const isLoading = useAppSelector(
    (state: RootState) => state.surveyLocations.loading
  );

  // Initialize geoLevelOrder
  const [geoLevelOrder, setGeoLevelOrder] = useState<string[]>([]);

  useEffect(() => {
    if (surveyLocationGeoLevels.length > 0) {
      setGeoLevelOrder(
        surveyLocationGeoLevels.map((level) => level.geo_level_name)
      );
    }
  }, [surveyLocationGeoLevels]);

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
        parent_geo_level_uid?: string | null;
        geo_level_name?: string;
        geo_level_uid?: string;
      } = surveyLocationGeoLevels[index];

      return (
        <React.Fragment key={index}>
          <div
            key={index}
            style={{
              backgroundColor: "#f0f2f5",
              padding: "10px 15px",
              marginBottom: "10px",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              cursor: "move",
              maxWidth: "40%",
            }}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={(e) => handleDrop(e, index)}
          >
            <span style={{ fontWeight: "500" }}>
              {geoLevel.geo_level_name
                ? geoLevel.geo_level_name
                : "Unnamed Level"}
            </span>
            <span style={{ color: "#999" }}>
              {index === 0 ? "Highest Geo Level" : `Level ${index + 1}`}
            </span>
          </div>
          {index < numGeoLevels - 1 && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                maxWidth: "40%",
              }}
            >
              <span style={{ fontSize: "24px", color: "#999" }}>↓</span>
            </div>
          )}
        </React.Fragment>
      );
    });

    return fields;
  };

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    index: number
  ) => {
    e.dataTransfer.setData("text/plain", index.toString());
  };

  const handleDragOver = (
    e: React.DragEvent<HTMLDivElement>,
    index: number
  ) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    const draggedIndex = parseInt(e.dataTransfer.getData("text/plain"), 10);
    if (draggedIndex !== index) {
      const updatedLevels = [...surveyLocationGeoLevels];
      const [draggedItem] = updatedLevels.splice(draggedIndex, 1);
      updatedLevels.splice(index, 0, draggedItem);
      dispatch(setSurveyLocationGeoLevels(updatedLevels));

      // Update geoLevelOrder
      const updatedOrder = [...geoLevelOrder];
      updatedOrder.splice(index, 0, updatedOrder.splice(draggedIndex, 1)[0]);
      setGeoLevelOrder(
        updatedOrder.map(
          (level) =>
            updatedLevels.find((l) => l.geo_level_name === level)
              ?.geo_level_name || level
        )
      );
    }
  };

  const handlePrimeSelectChange = (value: any) => {
    setSurveyPrimeGeoLocation(value);
  };

  const handleHierarchyContinue = async () => {
    try {
      if (survey_uid != undefined) {
        setLoading(true);

        // Order surveyGeoLevelsData based on geoLevelOrder
        const orderedSurveyGeoLevelsData = surveyLocationGeoLevels.map(
          (level, index) => ({
            ...level,
            parent_geo_level_uid:
              index === 0
                ? null
                : surveyLocationGeoLevels[index - 1].geo_level_uid,
          })
        );

        const geoLevelsRes = await dispatch(
          postSurveyLocationGeoLevels({
            geoLevelsData: orderedSurveyGeoLevelsData,
            surveyUid: survey_uid,
            validateHierarchy: true,
          })
        );

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
              Update Location hierarchy for this survey - You can drag and drop
              location levels to reorder them
            </DescriptionText>
            <div style={{ marginTop: "30px" }}>
              {renderHierarchyGeoLevelsField()}
            </div>
            <div style={{ marginTop: "20px" }}>
              <DescriptionText>Select the prime geo location</DescriptionText>
              <Form initialValues={{ prime_geo_level: surveyPrimeGeoLocation }}>
                <StyledFormItem
                  name={`prime_geo_level`}
                  style={{ width: "40%" }}
                >
                  <Select
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
              </Form>
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
