import { Drawer, Form, Input, message, Select, Tag, Modal, Button } from "antd";
import { OptionText } from "./RowEditingModal.styled";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  bulkUpdateEnumerators,
  getEnumeratorsColumnConfig,
  updateEnumerator,
} from "../../../../redux/enumerators/enumeratorsActions";
import { useAppDispatch } from "../../../../redux/hooks";
import { CustomBtn, GlobalStyle } from "../../../../shared/Global.styled";

interface IRowEditingModal {
  data: DataItem[];
  fields: Field[];
  onCancel: () => void;
  onUpdate: () => void;
  editMode: boolean;
  survey_uid: any;
  locations: any[];
  primeLocationName: string;
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
  primeLocationName,
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
  const [isLoading, setIsLoading] = useState(true);
  const [isStatusDropout, setIsStatusDropout] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showWarning, setShowWarning] = useState<"dropout" | "surveyor" | null>(
    null
  );
  const [hadSurveyorRole, setHadSurveyorRole] = useState(false);
  const [originalStatus, setOriginalStatus] = useState<string>("");

  const cancelHandler = () => {
    onCancel();
  };

  const handleStatusChange = (value: string) => {
    setIsStatusDropout(value === "Dropout");
  };

  const handleEnumeratorTypeChange = (values: string[]) => {
    // Just store the values, don't show warning yet
  };

  const updateHandler = async () => {
    try {
      const values = await editForm.validateFields();
      const updateData = await editForm.getFieldsValue();
      const originalData = data;

      if (updateData.location && Array.isArray(updateData.location)) {
        const selectedLocations = locations.filter((loc: any) =>
          updateData.location.includes(loc.location_name)
        );

        if (selectedLocations.length > 0) {
          updateData.location_uid = selectedLocations
            .map((loc: any) => loc.location_uid)
            .join(";");
        }
      }
      if (originalData.length > 1 && form_uid) {
        const { location, ...fieldsToUpdate } = updateData;
        fieldsToUpdate.enumerator_type = Array.isArray(
          fieldsToUpdate.enumerator_type
        )
          ? fieldsToUpdate.enumerator_type.join(";")
          : fieldsToUpdate.enumerator_type || "";
        const updateRes = await dispatch(
          bulkUpdateEnumerators({
            enumeratorUIDs: originalData.map((item) => item["enumerator_uid"]),
            formUID: form_uid,
            patchKeys: {
              ...fieldsToUpdate,
            },
          })
        );
        if (updateRes?.payload?.status === 200) {
          message.success("Enumerators updated successfully");
          onUpdate();
          return;
        }
        updateRes?.payload?.errors
          ? message.error(updateRes?.payload?.errors)
          : message.error(
              "Failed to update enumerators, kindly check and try again"
            );
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
          rest.enumerator_type = Array.isArray(updateData.enumerator_type)
            ? updateData.enumerator_type.join(";")
            : updateData.enumerator_type || "";

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
      message.error(error.message || "Failed to update, please try again");
    }
  };

  const handleSave = async () => {
    try {
      const values = await editForm.validateFields();
      const formValues = editForm.getFieldsValue();

      // Only show dropout warning if original status wasn't dropout
      if (
        formValues.enumerator_status === "Dropout" &&
        originalStatus !== "Dropout"
      ) {
        setShowWarning("dropout");
        setIsModalOpen(true);
        return;
      }

      // Only show surveyor warning if they originally had the role
      if (
        hadSurveyorRole &&
        Array.isArray(formValues.enumerator_type) &&
        !formValues.enumerator_type.includes("surveyor") &&
        data[0].surveyor_status !== null
      ) {
        setShowWarning("surveyor");
        setIsModalOpen(true);
        return;
      }

      updateHandler();
    } catch (error) {
      message.error("Please fill in all required fields");
    }
  };

  const handleModalConfirm = () => {
    setIsModalOpen(false);
    updateHandler();
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
  };

  const fieldsToExclude = [
    "status",
    "custom_fields",
    "enumerator_uid",
    "monitor_locations",
    "monitor_status",
    "surveyor_status",
  ];
  const currentLocation =
    data[0].surveyor_locations
      ?.flatMap((locList: any[]) =>
        locList.filter((loc: any) =>
          locations.some(
            (location) => location.geo_level_uid === loc.geo_level_uid
          )
        )
      )
      .map((loc: any) => loc.location_name)
      .join(", ") ||
    data[0].monitor_locations
      ?.flatMap((locList: any[]) =>
        locList.filter((loc: any) =>
          locations.some(
            (location) => location.geo_level_uid === loc.geo_level_uid
          )
        )
      )
      .map((loc: any) => loc.location_name)
      .join(", ") ||
    data[0].location ||
    "";
  const locationList = currentLocation
    .split(",")
    .map((loc: string) => loc.trim());

  const setupFormData = () => {
    const initialData: DataItem = {};

    let enumerator_type: string | string[] = "";
    if (data[0].surveyor_status !== null && data[0].monitor_status !== null) {
      enumerator_type = ["surveyor", "monitor"];
    } else if (data[0].surveyor_status !== null) {
      enumerator_type = "surveyor";
    } else if (data[0].monitor_status !== null) {
      enumerator_type = "monitor";
    }

    const enumerator_status =
      data[0].surveyor_status || data[0].monitor_status || "N/A";

    initialData.enumerator_type = enumerator_type;
    initialData.enumerator_status = enumerator_status;

    fields.forEach((field) => {
      if (field?.label?.startsWith("custom_fields")) {
        initialData[field.label] =
          data[0]["custom_fields"][field.labelKey] || "";
      } else if (field.labelKey === "location") {
        initialData.location = locationList;
      } else {
        initialData[field.labelKey] = data[0][field.labelKey] || "";
      }
    });

    const additionalFields = [
      { labelKey: "enumerator_type", label: "Enumerator Type" },
      { labelKey: "enumerator_status", label: "Status" },
    ];

    const existingFields = fields.map((f) => f.labelKey);
    const newFields = additionalFields.filter(
      (f) => !existingFields.includes(f.labelKey)
    );

    const excludedFields =
      data.length > 1
        ? [...bulkFieldsToExclude, ...fieldsToExclude]
        : [...fieldsToExclude];

    const filteredFields = [...fields, ...newFields].filter(
      (field) => !excludedFields.includes(field.labelKey)
    );

    setFormData(initialData);
    setUpdatedFields(filteredFields);
    editForm.setFieldsValue(initialData);
  };

  useEffect(() => {
    if (editMode) {
      setIsLoading(true);
      setupFormData();
      setHadSurveyorRole(data[0].surveyor_status !== null);
      setOriginalStatus(
        data[0].surveyor_status || data[0].monitor_status || "N/A"
      );
      setIsLoading(false);
    }
  }, [editMode, currentLocation]);

  return (
    <>
      <GlobalStyle />
      <Modal
        title="Warning"
        open={isModalOpen}
        onOk={handleModalConfirm}
        onCancel={handleModalCancel}
        okText="Yes"
        cancelText="No"
      >
        <p>
          {showWarning === "dropout"
            ? "Changing status to Dropout will delete all assignments for this enumerator. Are you sure?"
            : "Removing surveyor role will delete all survey assignments for this enumerator. Are you sure?"}
        </p>
      </Modal>
      <Drawer
        open={editMode}
        size="large"
        onClose={onCancel}
        title={
          data && data.length > 1
            ? `Edit ${data.length} Selected Enumerators`
            : "Edit Enumerator"
        }
      >
        {data && data.length > 1 ? (
          <OptionText
            style={{ width: 410, display: "inline-block", marginBottom: 20 }}
          >
            {`Bulk editing is only allowed for ${updatedFields
              .map((item: any) =>
                item.labelKey
                  .split("_")
                  .map(
                    (word: any) =>
                      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                  )
                  .join(" ")
              )
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
                  required={field.labelKey !== "home_address"}
                  key={idx}
                  name={field.labelKey}
                  initialValue={
                    field.labelKey === "location"
                      ? currentLocation
                      : formData[field.labelKey] || ""
                  }
                  label={
                    <span>
                      {field.labelKey === "location"
                        ? primeLocationName
                        : field.labelKey
                            .split("_")
                            .map((word) =>
                              word.toLowerCase() === "id"
                                ? "ID"
                                : word.charAt(0).toUpperCase() +
                                  word.slice(1).toLowerCase()
                            )
                            .join(" ")}
                    </span>
                  }
                  rules={[
                    {
                      required: field.labelKey !== "home_address",
                      message: `Please enter ${field.labelKey
                        .split("_")
                        .map(
                          (word) =>
                            word.charAt(0).toUpperCase() +
                            word.slice(1).toLowerCase()
                        )
                        .join(" ")}`,
                    },
                  ]}
                >
                  {field.labelKey === "location" ? (
                    <Select
                      mode="multiple"
                      style={{ width: "100%" }}
                      loading={isLoading}
                      defaultValue={currentLocation}
                    >
                      {!isLoading &&
                      Array.isArray(locations) &&
                      locations.length > 0 ? (
                        locations.map((location: any) => {
                          const locationDisplay = `${location.location_id} - ${location.location_name}`;
                          return (
                            <Select.Option
                              key={location.location_id}
                              value={location.location_name}
                            >
                              {locationDisplay}
                            </Select.Option>
                          );
                        })
                      ) : (
                        <Select.Option value={currentLocation}>
                          {currentLocation}
                        </Select.Option>
                      )}
                    </Select>
                  ) : field.labelKey === "enumerator_type" ? (
                    <Select
                      placeholder={`Select ${field.labelKey}`}
                      style={{ width: "100%" }}
                      mode="multiple"
                      onChange={handleEnumeratorTypeChange}
                    >
                      <Select.Option value="surveyor">Surveyor</Select.Option>
                      <Select.Option value="monitor">Monitor</Select.Option>
                    </Select>
                  ) : field.labelKey === "enumerator_status" ? (
                    <Select
                      placeholder={`Select ${field.labelKey
                        .split("_")
                        .map(
                          (word) =>
                            word.charAt(0).toUpperCase() +
                            word.slice(1).toLowerCase()
                        )
                        .join(" ")}`}
                      style={{ width: "100%" }}
                      onChange={handleStatusChange}
                    >
                      <Select.Option value="Active">Active</Select.Option>
                      <Select.Option value="Temp. Inactive">
                        Temp. Inactive
                      </Select.Option>
                      <Select.Option value="Dropout">Dropout</Select.Option>
                    </Select>
                  ) : (
                    <Input
                      placeholder={`Enter ${field.labelKey
                        .split("_")
                        .map(
                          (word) =>
                            word.charAt(0).toUpperCase() +
                            word.slice(1).toLowerCase()
                        )
                        .join(" ")}`}
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
          <CustomBtn
            type="primary"
            onClick={handleSave}
            style={{ marginLeft: 10 }}
          >
            Save
          </CustomBtn>
        </div>
      </Drawer>
    </>
  );
}

export default RowEditingModal;
