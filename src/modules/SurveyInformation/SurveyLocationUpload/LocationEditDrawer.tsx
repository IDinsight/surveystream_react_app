import React from "react";
import { Button, Drawer, Form, Input, Select } from "antd";
import styled from "styled-components";
import { updateLocation } from "../../../redux/surveyLocations/surveyLocationsActions";
import { useAppDispatch } from "../../../redux/hooks";

const LocationsDrawer = styled(Drawer)`
  margin-top: 15px;
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
}

export const LocationEditDrawer: React.FC<LocationEditDrawerProps> = ({
  visible,
  onClose,
  dataTable,
  selectedRecord,
  geoLevels,
  surveyUID,
}) => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();

  const handleLocationsUpdate = async () => {
    try {
      await form.validateFields();
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
      } else {
        onClose();
      }
    } catch (error) {
      console.error("Failed to update locations", error);
    }
  };

  return (
    <>
      <LocationsDrawer
        title="Edit location information"
        placement="right"
        closable={true}
        onClose={onClose}
        open={visible}
        size="large"
      >
        <p>
          Editing the location will update the location data associated with all
          enumerator and targets records.
        </p>
        <Form form={form} layout="horizontal">
          {geoLevels.map((geoLevel: any, index: any) => (
            <React.Fragment key={index}>
              <Form.Item
                label={`${geoLevel.geo_level_name} ID`}
                name={`${geoLevel.geo_level_name}_uid`}
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
              </Form.Item>
              <Form.Item
                label={`${geoLevel.geo_level_name} Name`}
                name={`${geoLevel.geo_level_name}_name`}
                initialValue={
                  selectedRecord[
                    `${geoLevel.geo_level_name.toLowerCase()} name`
                  ]
                }
              >
                <Input />
              </Form.Item>
            </React.Fragment>
          ))}
        </Form>
        <Form.Item>
          <Button type="primary" onClick={handleLocationsUpdate}>
            Save
          </Button>
        </Form.Item>
      </LocationsDrawer>
    </>
  );
};
