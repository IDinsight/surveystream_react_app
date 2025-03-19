import { Form, Radio, Select, message } from "antd";
import { useNavigate, useParams } from "react-router-dom";

import { Title, HeaderContainer } from "../../../shared/Nav.styled";

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
import { CustomBtn } from "../../../shared/Global.styled";
import { createNotificationViaAction } from "../../../redux/notifications/notificationActions";
import { set } from "lodash";

function SurveyLocationHierarchy() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { survey_uid } = useParams<{ survey_uid?: string }>() ?? {
    survey_uid: "",
  };
  const [loading, setLoading] = useState(false);
  interface SurveyBasicInformation {
    prime_geo_level_uid: string | null;
  }

  const [surveyBasicInformation, setSurveyBasicInformation] =
    useState<SurveyBasicInformation | null>(null);
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
  const [initialSurveyLocationGeoLevels] = useState(surveyLocationGeoLevels);

  const isLoading = useAppSelector(
    (state: RootState) => state.surveyLocations.loading
  );

  const { loading: isSideMenuLoading } = useAppSelector(
    (state: RootState) => state.surveyConfig
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

  const [notifications, setNotifications] = useState<any[]>([]);

  const createNotification = async () => {
    if (notifications.length > 0) {
      for (const notification of notifications) {
        try {
          const data = {
            action: notification,
            survey_uid: survey_uid,
          };
          await dispatch(createNotificationViaAction(data));
        } catch (error) {
          console.error("Failed to create notification:", error);
        }
      }
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
        <StyledFormItem
          key={index}
          required
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 10 }}
          labelAlign="left"
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
    checkNotificationConditions();
    return;
  };

  const handlePrimeSelectChange = (value: any) => {
    setSurveyPrimeGeoLocation(value);
    if (
      surveyBasicInformation &&
      value !== surveyBasicInformation.prime_geo_level_uid &&
      !notifications.includes("Prime location updated")
    ) {
      setNotifications([...notifications, "Prime location updated"]);
    }
    if (
      surveyBasicInformation &&
      value === surveyBasicInformation.prime_geo_level_uid
    ) {
      const filteredNotification = notifications.filter(
        (notification) => notification !== "Prime location updated"
      );
      setNotifications(filteredNotification);
    }
  };

  const checkNotificationConditions = async () => {
    // Check if hierarchy has changed
    const initialHierarchy = initialSurveyLocationGeoLevels.map(
      (level: any) => level.parent_geo_level_uid
    );

    const currentHierarchy = surveyLocationGeoLevels.map(
      (level) => level.parent_geo_level_uid
    );

    if (JSON.stringify(initialHierarchy) !== JSON.stringify(currentHierarchy)) {
      setNotifications([...notifications, "Location hierarchy changed"]);
    } else {
      const filteredNotification = notifications.filter(
        (notification) => notification !== "Location hierarchy changed"
      );
      setNotifications(filteredNotification);
    }
  };

  const handleHierarchyContinue = async () => {
    try {
      if (survey_uid != undefined) {
        await form.validateFields();
        setLoading(true);

        const surveyGeoLevelsData = surveyLocationGeoLevels;

        await createNotification();

        const geoLevelsRes = await dispatch(
          postSurveyLocationGeoLevels({
            geoLevelsData: surveyGeoLevelsData,
            surveyUid: survey_uid,
            validateHierarchy: true,
          })
        );

        if (geoLevelsRes.payload.status === false) {
          message.error(geoLevelsRes.payload.message);
          return;
        } else {
          message.success("Location level hierarchy updated successfully.");

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

  const fetchGeoLevelData = async () => {
    setLoading(true);
    await fetchSurveyBasicInformation();
    await fetchSurveyLocationGeoLevels();
    setLoading(false);
  };

  useEffect(() => {
    fetchGeoLevelData();

    return () => {
      dispatch(resetSurveyLocations());
    };
  }, [dispatch]);

  return (
    <>
      <GlobalStyle />

      <Container surveyPage={true} />
      <HeaderContainer>
        <Title>Survey locations hierarchy</Title>

        <div
          style={{ display: "flex", marginLeft: "auto", marginBottom: "15px" }}
        ></div>
      </HeaderContainer>
      {isLoading || loading || isSideMenuLoading ? (
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
              <Form initialValues={{ prime_geo_level: surveyPrimeGeoLocation }}>
                <DescriptionText>Select the prime geo location</DescriptionText>

                <StyledFormItem
                  label="Prime geo location"
                  required
                  labelCol={{ span: 3 }}
                  wrapperCol={{ span: 8 }}
                  labelAlign="left"
                  name={`prime_geo_level`}
                >
                  <Select
                    onChange={handlePrimeSelectChange}
                    style={{ width: "94%" }}
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
            <CustomBtn
              loading={loading}
              onClick={async () => {
                await handleHierarchyContinue();
              }}
              style={{ marginTop: 24 }}
            >
              Save
            </CustomBtn>
          </SurveyLocationHierarchyFormWrapper>
        </div>
      )}
    </>
  );
}

export default SurveyLocationHierarchy;
