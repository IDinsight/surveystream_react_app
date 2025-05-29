import React from "react";
import { Button, Drawer, Form, Input, message, Modal, Select } from "antd";
import styled from "styled-components";
import {
  updateLocation,
  getSurveyLocations,
} from "../../../redux/surveyLocations/surveyLocationsActions";
import { useAppDispatch } from "../../../redux/hooks";
import { StyledFormItem } from "../SurveyInformation.styled";
import { CustomBtn } from "../../../shared/Global.styled";

const LocationsDrawer = styled(Drawer)`
  margin-bottom: 68px;
  font-family: "Lato", sans-serif;
`;

interface LocationEditDrawerProps {
  visible: boolean;
  onClose: () => void;
  dataTable: any;
  selectedRecord: any;
  geoLevels: any;
  surveyUID: string;
  loading: any;
  setLoading: any;
}

export const LocationEditDrawer: React.FC<LocationEditDrawerProps> = ({
  visible,
  onClose,
  dataTable,
  selectedRecord,
  geoLevels,
  surveyUID,
  loading,
  setLoading,
}) => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();

  const handleLocationsUpdate = async () => {
    try {
      await form.validateFields();
      setLoading(true);

      const payload = geoLevels.map((geoLevel: any) => ({
        location_name: form.getFieldValue(`${geoLevel.geo_level_name}_name`),
        location_uid: form.getFieldValue(`${geoLevel.geo_level_name}_uid`),
      }));
      const updatedPayload = payload.map((location: any, index: any) => {
        const geoLevel = geoLevels[index];
        if (geoLevel.parent_geo_level_uid === null) {
          return {
            ...location,
            parent_location_uid: null,
            survey_uid: surveyUID,
          };
        } else {
          const parentGeoLevel = geoLevels.find(
            (level: any) =>
              level.geo_level_uid === geoLevel.parent_geo_level_uid
          );
          return {
            ...location,
            parent_location_uid: form.getFieldValue(
              `${parentGeoLevel.geo_level_name}_uid`
            ),
            survey_uid: surveyUID,
          };
        }
      });

      onClose();

      const updatePromises = updatedPayload.map((location: any) =>
        dispatch(
          updateLocation({
            formData: location,
            locationUid: location.location_uid,
          })
        )
      );
      const results = await Promise.all(updatePromises);

      const failedUpdates = results.filter(
        (result: any) => result.meta.requestStatus !== "fulfilled"
      );

      if (failedUpdates.length > 0) {
        alert("Some locations failed to update.");
      }
      // Call get survey locations to reflect the changes
      const res = await dispatch(getSurveyLocations({ survey_uid: surveyUID }));

      message.success("Location data updated successfully.");

      setLoading(false);
    } catch (error: any) {
      message.error("Failed to update locations.");
    }
  };

  return (
    <>
      <LocationsDrawer
        title="Edit Location Information"
        placement="right"
        closable={true}
        onClose={onClose}
        open={visible}
        size="large"
      >
        <p style={{ marginBottom: "20px" }}>
          Editing the location will update the location data for all associated
          user, enumerator and targets records.
        </p>
        <Form form={form} layout="horizontal">
          {geoLevels.map((geoLevel: any, index: any) => (
            <React.Fragment key={index}>
              <StyledFormItem
                label={`${geoLevel.geo_level_name} ID`}
                name={`${geoLevel.geo_level_name}_uid`}
                required
                rules={[
                  { required: true, message: "Please select a location" },
                ]}
                labelAlign="left"
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 16 }}
                initialValue={
                  dataTable.find(
                    (data: any) =>
                      data.location_id ===
                        selectedRecord[
                          `${geoLevel.geo_level_name.toLowerCase()} id`
                        ] && data.geo_level_uid === geoLevel.geo_level_uid
                  )?.location_uid
                }
              >
                <Select
                  disabled={index === geoLevels.length - 1}
                  onChange={(value) => {
                    const selectedLocation = dataTable.find(
                      (data: any) => data.location_uid === value
                    );
                    if (selectedLocation) {
                      form.setFieldsValue({
                        [`${geoLevel.geo_level_name}_name`]:
                          selectedLocation.location_name,
                      });
                    }
                  }}
                >
                  {dataTable
                    .filter(
                      (data: any) =>
                        data.geo_level_uid === geoLevel.geo_level_uid
                    )
                    .map((data: any) => (
                      <Select.Option
                        key={data.location_uid}
                        value={data.location_uid}
                      >
                        {data.location_id}
                      </Select.Option>
                    ))}
                </Select>
              </StyledFormItem>
              <StyledFormItem
                label={`${geoLevel.geo_level_name} Name`}
                name={`${geoLevel.geo_level_name}_name`}
                required
                rules={[
                  { required: true, message: "Please enter a location name" },
                ]}
                labelAlign="left"
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 16 }}
                initialValue={
                  selectedRecord[
                    `${geoLevel.geo_level_name.toLowerCase()} name`
                  ]
                }
                style={{ textAlign: "left" }}
              >
                <Input />
              </StyledFormItem>
            </React.Fragment>
          ))}
        </Form>
        <StyledFormItem>
          <Button onClick={() => onClose()}>Cancel</Button>
          <CustomBtn
            style={{ marginTop: "20px", marginLeft: "20px" }}
            onClick={handleLocationsUpdate}
          >
            Save
          </CustomBtn>
        </StyledFormItem>
      </LocationsDrawer>
    </>
  );
};
