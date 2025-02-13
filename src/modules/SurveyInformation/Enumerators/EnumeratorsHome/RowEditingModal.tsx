import { Button, Drawer, Form, Input, message, Select } from "antd";
import { OptionText } from "./RowEditingModal.styled";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  bulkUpdateEnumerators,
  getEnumeratorsColumnConfig,
  updateEnumerator,
} from "../../../../redux/enumerators/enumeratorsActions";
import { useAppDispatch } from "../../../../redux/hooks";
import { use } from "chai";
import { GlobalStyle } from "../../../../shared/Global.styled";

interface IRowEditingModal {
  data: DataItem[];
  fields: Field[];
  onCancel: () => void;
  onUpdate: () => void;
  editMode: boolean;
  survey_uid: any;
  locations: any[];
}

interface Field {
  label: string;
  labelKey: string;
}

interface DataItem {
  [key: string]: any;
}
interface ConfigField {
  bulk_editable: boolean;
  column_name: string;
  column_type: string;
}

function RowEditingModal({
  data,
  fields,
  onCancel,
  onUpdate,
  editMode,
  survey_uid,
  locations,
}: IRowEditingModal) {
  const { form_uid } = useParams<{ form_uid: string }>() ?? {
    form_uid: "",
  };

  const dispatch = useAppDispatch();

  const [editForm] = Form.useForm();
  const [formData, setFormData] = useState<DataItem>([]);
  const [updatedFields, setUpdatedFields] = useState<Field[]>([]);
  const [bulkFieldsToInclude, setBulkFieldsToInclude] = useState<string[]>([]);
  const [bulkFieldsToExclude, setBulkFieldsToExclude] = useState<string[]>([
    "enumerator_id",
    "name",
    "email",
    "monitor_status",
    "surveyor_status",
    "surveyor_locations",
    "mobile_primary",
    "monitor_locations",
    "home_address",
  ]);
  const cancelHandler = () => {
    // Write code here for any cleanup
    onCancel();
  };

  const updateHandler = async () => {
    try {
      // Validate form
      const values = await editForm.validateFields();
      const updateData = await editForm.getFieldsValue();
      const originalData = data;

      // If location is being updated, modify surveyor_locations
      if (updateData.location) {
        // Find the selected location from locations array
        const selectedLocation = locations.find(
          (loc: any) => loc.location_name === updateData.location
        );

        if (selectedLocation) {
          // Update the surveyor_locations array
          const updatedSurveyorLocations =
            originalData[0].surveyor_locations.map((loc: any) => {
              if (loc.geo_level_uid === selectedLocation.geo_level_uid) {
                return {
                  ...loc,
                  location_name: selectedLocation.location_name,
                  location_uid: selectedLocation.location_uid,
                };
              }
              return loc;
            });

          // Update the data with new surveyor_locations
          updateData.surveyor_locations = updatedSurveyorLocations;
        }
      }

      // Rest of your existing update logic
      if (originalData.length > 1 && form_uid) {
        // Bulk update logic...
      } else {
        const enumeratorUID = originalData[0]["enumerator_uid"];
        const indexToUpdate = originalData.findIndex(
          (item) => item["enumerator_uid"] === enumeratorUID
        );

        if (indexToUpdate !== -1) {
          const updatedRow = {
            ...originalData[indexToUpdate],
            ...updateData,
          };

          // Extract the custom fields from the updatedRow
          const { custom_fields, ...rest } = updatedRow;
          const removedCustomFields: any = {};
          for (const key in rest) {
            if (key.startsWith("custom_fields.")) {
              const fieldName = key.split("custom_fields.")[1];
              removedCustomFields[fieldName] = rest[key];
              delete rest[key];
            }
          }

          rest.custom_fields = {
            ...custom_fields,
            ...removedCustomFields,
          };

          originalData[indexToUpdate] = rest;
        }

        const enumeratorData = { ...originalData[0] };
        const updateRes = await dispatch(
          updateEnumerator({ enumeratorUID, enumeratorData })
        );

        if (updateRes?.payload?.status === 200) {
          message.success("Enumerator updated successfully");
          onUpdate();
          return;
        }
        updateRes?.payload?.errors
          ? message.error(updateRes?.payload?.errors)
          : message.error(
              "Failed to update enumerator, kindly check and try again"
            );
      }
    } catch (error: any) {
      console.error("Update error:", error);
      message.error(error.message || "Failed to update, please try again");
    }
  };

  const fieldsToExclude = [
    "status",
    "custom_fields",
    "enumerator_uid",
    "monitor_locations",
    "monitor_status",
    "surveyor_status",
  ]; //always exclude these

  const getFilteredFields = (
    fields: Field[],
    data: DataItem[],
    bulkFieldsToExclude: string[]
  ) => {
    // If not bulk editing, return all fields
    if (data.length <= 1) return fields;

    // For bulk editing, exclude location and other excluded fields
    return fields.filter((field) => {
      if (bulkFieldsToExclude.includes(field.labelKey)) return false;
      if (field.labelKey === "location") return false; // Always exclude location in bulk edit
      return true;
    });
  };

  const fetchEnumeratorsColumnConfig = async (form_uid: string) => {
    const configRes = await dispatch(
      getEnumeratorsColumnConfig({ formUID: form_uid })
    );
    if (configRes.payload.status == 200) {
      const configData = configRes.payload?.data?.data?.file_columns;

      if (configData) {
        const editableFields = configData
          .filter((field: ConfigField) => field.bulk_editable)
          .map((field: ConfigField) => field.column_name);

        const nonEditableFields = configData
          .filter((field: ConfigField) => !field.bulk_editable)
          .map((field: ConfigField) => field.column_name);

        const excludeFields = [...bulkFieldsToExclude, ...nonEditableFields];

        // Filter fields and always exclude location in bulk edit
        const filteredFields = fields.filter(
          (field) =>
            !excludeFields.includes(field.labelKey) &&
            field.labelKey !== "location"
        );

        // Set up form with filtered fields
        const initialData: DataItem = {};
        filteredFields.forEach((field) => {
          if (field?.label?.startsWith("custom_fields")) {
            initialData[field.label] = data[0]["custom_fields"][field.labelKey];
          } else {
            initialData[field.labelKey] = data[0][field.labelKey];
          }
        });

        setFormData(initialData);
        setUpdatedFields(filteredFields);
        editForm.setFieldsValue(initialData);
      }
    }
  };

  const setupFormData = () => {
    // For single edit, use all fields
    if (data.length <= 1) {
      const initialData: DataItem = {};
      fields.forEach((field) => {
        if (field?.label?.startsWith("custom_fields")) {
          initialData[field.label] = data[0]["custom_fields"][field.labelKey];
        } else {
          initialData[field.labelKey] = data[0][field.labelKey];
        }
      });

      setFormData(initialData);
      setUpdatedFields(fields);
      editForm.setFieldsValue(initialData);
      return;
    }

    // For bulk edit, wait for fetchEnumeratorsColumnConfig
    if (form_uid) {
      fetchEnumeratorsColumnConfig(form_uid);
    }
  };

  useEffect(() => {
    setupFormData();
    // Only fetch bulk config if needed
    if (form_uid && data.length > 1) {
      fetchEnumeratorsColumnConfig(form_uid);
    }
  }, []);

  return (
    <>
      <GlobalStyle />
      <Drawer
        open={editMode}
        size="large"
        onClose={onCancel}
        title={
          data && data.length > 1
            ? `Edit ${data.length} enumerators in bulk`
            : "Edit enumerator"
        }
      >
        {data && data.length > 1 ? (
          <OptionText
            style={{ width: 410, display: "inline-block", marginBottom: 20 }}
          >
            {`Bulk editing is only allowed for ${updatedFields
              .map((item: any) => item.labelKey)
              .join(", ")}.`}
          </OptionText>
        ) : null}
        <br />
        {data && data.length > 0 ? (
          <>
            <Form
              labelCol={{ span: 7 }}
              form={editForm}
              style={{ textAlign: "left" }}
              labelAlign="left"
            >
              {updatedFields.map((field: Field, idx: number) => (
                <Form.Item
                  required
                  key={idx}
                  id={`${field.label}-id`}
                  name={field.label}
                  initialValue={field.label ? data[0][field.label] : ""}
                  label={<span>{field.labelKey}</span>}
                  rules={[
                    {
                      required: true,
                      message: `Please enter ${field.labelKey}`,
                    },
                  ]}
                >
                  {field.labelKey === `location` ? (
                    <Select
                      placeholder="Select location"
                      style={{ width: "100%" }}
                      defaultValue={data[0].location}
                    >
                      {Array.isArray(locations) && locations.length > 0 ? (
                        locations.map((location: any) => (
                          <Select.Option
                            key={location.location_id}
                            value={location.location_name}
                          >
                            {location.location_name}
                          </Select.Option>
                        ))
                      ) : (
                        <Select.Option value={data[0].location}>
                          {data[0].location || "No location"}
                        </Select.Option>
                      )}
                    </Select>
                  ) : (
                    <Input
                      placeholder={`Enter ${field.labelKey}`}
                      style={{ width: "100%" }}
                    />
                  )}
                </Form.Item>
              ))}
            </Form>
          </>
        ) : null}
        <div style={{ marginTop: 20 }}>
          <Button onClick={cancelHandler}>Cancel</Button>
          <Button
            type="primary"
            style={{ marginLeft: 30, backgroundColor: "#2f54eB" }}
            onClick={updateHandler}
          >
            Update
          </Button>
        </div>
      </Drawer>
    </>
  );
}

export default RowEditingModal;
