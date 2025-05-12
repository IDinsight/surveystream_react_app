import { Form, Input, message, Col, Popconfirm } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { DeleteOutlined } from "@ant-design/icons";
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
import { SurveyLocationFormWrapper } from "./SurveyLocationAdd.styled";
import {
  DynamicItemsForm,
  CustomStyledFormItem,
} from "../SurveyInformation.styled";
import { Title, HeaderContainer } from "../../../shared/Nav.styled";
import SideMenu from "../SideMenu";
import FullScreenLoader from "../../../components/Loaders/FullScreenLoader";
import { CustomBtn, DescriptionText } from "../../../shared/Global.styled";

import { GlobalStyle } from "../../../shared/Global.styled";
import Container from "../../../components/Layout/Container";
import { createNotificationViaAction } from "../../../redux/notifications/notificationActions";
import DescriptionLink from "../../../components/DescriptionLink/DescriptionLink";

function SurveyLocationAdd() {
  const { survey_uid } = useParams<{ survey_uid?: string }>() ?? {
    survey_uid: "",
  };
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  const surveyLocationGeoLevels = useAppSelector(
    (state: RootState) => state.surveyLocations.surveyLocationGeoLevels
  );
  const isLoading = useAppSelector(
    (state: RootState) => state.surveyLocations.loading
  );

  const { loading: isSideMenuLoading } = useAppSelector(
    (state: RootState) => state.surveyConfig
  );

  const [numLocationFields, setNumLocationFields] = useState(
    surveyLocationGeoLevels.length !== 0 ? surveyLocationGeoLevels.length : 1
  );

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

  const handleDeleteGeoLevel = (index: number) => {
    const indexedLocationUid = surveyLocationGeoLevels[index]?.geo_level_uid;

    const updatedGeoLevels = surveyLocationGeoLevels.filter(
      (_, i) => i !== index
    );
    const newUpdatedGeoLevels = updatedGeoLevels.map((geoLevel) => {
      if (geoLevel.parent_geo_level_uid === indexedLocationUid) {
        return { ...geoLevel, parent_geo_level_uid: null };
      }
      return geoLevel;
    });
    dispatch(setSurveyLocationGeoLevels(newUpdatedGeoLevels));
    if (newUpdatedGeoLevels.length > 0) {
      newUpdatedGeoLevels.forEach((geoLevel, idx) => {
        form.setFieldValue(`geo_level_${idx}`, geoLevel.geo_level_name);
      });
      setNumLocationFields(newUpdatedGeoLevels.length);
    } else {
      setNumLocationFields(1);
      form.setFieldsValue({ [`geo_level_0`]: "" });
    }
    setNotifications([...notifications, "Location level deleted"]);
  };

  const fetchSurveyLocationGeoLevels = async () => {
    if (survey_uid !== undefined) {
      const res = await dispatch(
        getSurveyLocationGeoLevels({ survey_uid: survey_uid })
      );
      setNumLocationFields(res.payload.length === 0 ? 1 : res.payload.length);
      if (res.payload.length > 0) {
        form.setFieldValue("geo_level_0", res.payload[0].geo_level_name);
      } else {
        form.resetFields();
      }
    }
  };

  const renderLocationFields = () => {
    const fields = Array.from({ length: numLocationFields }, (_, index) => {
      const geoLevel: {
        geo_level_name?: string;
        parent_geo_level_uid?: string | null;
      } = numLocationFields === 1 ? {} : surveyLocationGeoLevels[index];

      return (
        <div
          key={`location-field-${index}`}
          style={{
            display: "flex",
            alignItems: "center",
            width: "100%",
          }}
        >
          <CustomStyledFormItem
            key={index}
            required
            name={`geo_level_${index}`}
            label={`Location ${index + 1}`}
            labelAlign="left"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            initialValue={
              geoLevel?.geo_level_name ? geoLevel?.geo_level_name : ""
            }
            rules={[
              {
                required: true,
                message: "Please enter a location level name!",
              },
              {
                validator: (_: any, value: any) => {
                  if (
                    value &&
                    Object.values(surveyLocationGeoLevels).filter(
                      (r: {
                        geo_level_name: any;
                        parent_geo_level_uid?: string | null;
                      }) => r.geo_level_name === value
                    ).length > 1
                  ) {
                    return Promise.reject(
                      "Please use unique location level name!"
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input
              placeholder="Enter location label"
              style={{ width: "calc(100% - 50px)", marginRight: "10px" }}
            />
          </CustomStyledFormItem>
          <Col span={4} style={{ paddingBottom: "15px" }}>
            <Popconfirm
              title="Are you sure you want to delete this location level?"
              description={
                <span>
                  This action will remove existing locations data, including
                  locations mapped to enumerators, targets and supervisors.
                  <br />
                  Kindly re-upload locations and update enumerators, targets and
                  supervisors after deleting the location level.
                </span>
              }
              onConfirm={() => {
                handleDeleteGeoLevel(index);
              }}
              okText="Yes"
              cancelText="No"
              placement="right"
              overlayStyle={{ width: "30%" }}
            >
              <DeleteOutlined
                style={{
                  cursor: "pointer",
                  color: "red",
                  fontSize: "20px",
                }}
              />
            </Popconfirm>
          </Col>
        </div>
      );
    });

    return fields;
  };

  const handleAddGeoLevel = () => {
    return form
      .validateFields()
      .then(() => {
        setNumLocationFields(numLocationFields + 1);
        form.setFieldsValue({ [`geo_level_${numLocationFields}`]: "" });
        setNotifications([...notifications, "Location level added"]);
      })
      .catch((error) => {
        console.error(error);
        return false;
      });
  };

  const handleLocationAddContinue = async () => {
    try {
      setLoading(true);
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

        const updatedGeoLevels = filteredGeoLevels.map((location, index) => {
          const matchingLevel = surveyLocationGeoLevels[index];
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
          message.error("Please fill in at least one location level!");
        } else {
          dispatch(setSurveyLocationGeoLevels(updatedGeoLevels));
        }

        const surveyGeoLevelsData = updatedGeoLevels;

        const geoLevelsRes = await dispatch(
          postSurveyLocationGeoLevels({
            geoLevelsData: surveyGeoLevelsData,
            surveyUid: survey_uid,
            validateHierarchy: false,
          })
        );

        if (geoLevelsRes.payload.status === false) {
          message.error(geoLevelsRes.payload.message);
          return;
        } else {
          message.success("Location levels updated successfully.");
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
      <GlobalStyle />
      <Container surveyPage={true} />
      <HeaderContainer>
        <Title>Add/ Edit Location Levels</Title>
        <div
          style={{ display: "flex", marginLeft: "auto", marginBottom: "15px" }}
        >
          {surveyLocationGeoLevels.length > 0 ? (
            <Popconfirm
              title="Are you sure you want to add another location level?"
              description={
                <span>
                  This action will remove existing location data, including
                  locations mapped to enumerators, targets and supervisors.
                  <br />
                  Kindly re-upload locations and update enumerators, targets and
                  supervisors after adding the new location level.
                </span>
              }
              okText="Yes"
              cancelText="No"
              onConfirm={handleAddGeoLevel}
              placement="leftTop"
              overlayStyle={{ width: "30%" }}
            >
              <CustomBtn style={{ width: "100%", marginTop: "15px" }}>
                Add location level
              </CustomBtn>
            </Popconfirm>
          ) : (
            <CustomBtn
              style={{ width: "100%", marginTop: "15px" }}
              onClick={handleAddGeoLevel}
            >
              Add location level
            </CustomBtn>
          )}
        </div>
      </HeaderContainer>
      {isLoading || isSideMenuLoading ? (
        <FullScreenLoader />
      ) : (
        <div style={{ display: "flex" }}>
          <SideMenu />
          <SurveyLocationFormWrapper>
            <DescriptionText>
              Add the location levels for your survey (for example, State,
              District and Block).{" "}
              <DescriptionLink link="https://docs.surveystream.idinsight.io/locations_configuration#location-level" />
            </DescriptionText>
            <DescriptionText>
              In the next step, you will be asked to define the hierarchy among
              these location levels.
            </DescriptionText>
            <div style={{ marginTop: "40px" }}>
              <DynamicItemsForm form={form}>
                {renderLocationFields()}
              </DynamicItemsForm>
            </div>
            <CustomBtn
              onClick={async () => {
                setLoading(true);
                await createNotification();
                await handleLocationAddContinue();
                setLoading(false);
              }}
              loading={loading}
              disabled={numLocationFields === 0}
              style={{ marginTop: 24 }}
            >
              Save
            </CustomBtn>
          </SurveyLocationFormWrapper>
        </div>
      )}
    </>
  );
}

export default SurveyLocationAdd;
