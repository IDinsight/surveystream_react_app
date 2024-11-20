import { Form, Input, message, Col, Popconfirm } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  FileAddOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
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
} from "../../../shared/FooterBar.styled";
import { Title, HeaderContainer } from "../../../shared/Nav.styled";
import SideMenu from "../SideMenu";
import FullScreenLoader from "../../../components/Loaders/FullScreenLoader";

import { GlobalStyle } from "../../../shared/Global.styled";
import Container from "../../../components/Layout/Container";

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

  const [numLocationFields, setNumLocationFields] = useState(
    surveyLocationGeoLevels.length !== 0 ? surveyLocationGeoLevels.length : 1
  );

  const [isAllowedEdit, setIsAllowedEdit] = useState<boolean[]>(
    Array(numLocationFields).fill(true)
  );

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
    setNumLocationFields(newUpdatedGeoLevels.length);
    setIsAllowedEdit(Array(newUpdatedGeoLevels.length).fill(true));
    newUpdatedGeoLevels.forEach((geoLevel, idx) => {
      form.setFieldValue(`geo_level_${idx}`, geoLevel.geo_level_name);
    });
  };

  const fetchSurveyLocationGeoLevels = async () => {
    if (survey_uid !== undefined) {
      const res = await dispatch(
        getSurveyLocationGeoLevels({ survey_uid: survey_uid })
      );
      setNumLocationFields(res.payload.length === 0 ? 1 : res.payload.length);
      setIsAllowedEdit(Array(res.payload.length).fill(false));
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
          <StyledFormItem
            key={index}
            required
            name={`geo_level_${index}`}
            label={<span>Location {index + 1}</span>}
            labelAlign="left"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
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
                        parent_geo_level_uid?: string | null;
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
            <Input
              placeholder="Enter location label"
              style={{ width: "calc(100% - 50px)", marginRight: "10px" }}
              disabled={!isAllowedEdit[index]}
            />
          </StyledFormItem>
          <Col span={4}>
            <EditOutlined
              style={{
                marginRight: "10px",
                cursor: "pointer",
                color: "blue",
                fontSize: "18px",
              }}
              onClick={() => {
                const newIsAllowedEdit = [...isAllowedEdit];
                newIsAllowedEdit[index] = true;
                setIsAllowedEdit(newIsAllowedEdit);
              }}
            />
            <Popconfirm
              title="Are you sure you want to delete this location level?"
              description={
                <span>
                  Deleting location level will delete existing location data.
                  Enumerators and targets are mapped to locations using existing
                  location levels, and they will be deleted.
                  <br />
                  Please re-upload locations, enumerators, and targets after
                  adding a new location level.
                </span>
              }
              onConfirm={() => handleDeleteGeoLevel(index)}
              okText="Yes"
              cancelText="No"
              placement="right"
              overlayStyle={{ width: "30%" }}
            >
              <DeleteOutlined
                style={{
                  cursor: "pointer",
                  color: "red",
                  fontSize: "18px",
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
        setIsAllowedEdit([...isAllowedEdit, true]);
        form.setFieldsValue({ [`geo_level_${numLocationFields}`]: "" });
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
            validateHierarchy: false,
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
      <GlobalStyle />
      <Container />
      <HeaderContainer>
        <Title>Survey location types</Title>
        <div
          style={{ display: "flex", marginLeft: "auto", marginBottom: "15px" }}
        >
          {surveyLocationGeoLevels.length > 0 ? (
            <Popconfirm
              title="Are you sure you want to add another location level?"
              description={
                <span>
                  Adding another location level will delete existing location
                  data. Enumerators and targets are mapped to locations using
                  existing location levels, and they will be deleted.
                  <br />
                  Please re-upload locations, enumerators, and targets after
                  adding a new location level.
                </span>
              }
              okText="Yes"
              cancelText="No"
              onConfirm={handleAddGeoLevel}
              placement="leftTop"
              overlayStyle={{ width: "30%" }}
            >
              <AddAnotherButton type="dashed" style={{ width: "100%" }}>
                <FileAddOutlined /> Add another location level
              </AddAnotherButton>
            </Popconfirm>
          ) : (
            <AddAnotherButton
              type="dashed"
              style={{ width: "100%" }}
              onClick={handleAddGeoLevel}
            >
              <FileAddOutlined /> Add another location level
            </AddAnotherButton>
          )}
        </div>
      </HeaderContainer>
      {isLoading ? (
        <FullScreenLoader />
      ) : (
        <div style={{ display: "flex" }}>
          <SideMenu />
          <SurveyLocationFormWrapper>
            <DescriptionText>
              Please create the locations for your survey. Examples of
              locations: state, district, and block
            </DescriptionText>
            <div style={{ marginTop: "40px" }}>
              <DynamicItemsForm form={form}>
                {renderLocationFields()}
              </DynamicItemsForm>
            </div>
          </SurveyLocationFormWrapper>
        </div>
      )}
      <FooterWrapper>
        <ContinueButton
          onClick={handleLocationAddContinue}
          loading={loading}
          disabled={surveyLocationGeoLevels.length === 0}
        >
          Save
        </ContinueButton>
      </FooterWrapper>
    </>
  );
}

export default SurveyLocationAdd;
