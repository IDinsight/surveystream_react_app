import { Form, Input, message, Drawer, Select, Checkbox, Button } from "antd";
import { OptionText } from "./RowEditingModal.styled";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  bulkUpdateTargets,
  getTargetsColumnConfig,
  updateTarget,
} from "../../../../redux/targets/targetActions";
import { useAppDispatch } from "../../../../redux/hooks";
import { CustomBtn, GlobalStyle } from "../../../../shared/Global.styled";

interface IRowEditingModal {
  data: DataItem[];
  fields: Field[];
  onCancel: () => void;
  onUpdate: () => void;
  visible: boolean;
  setLoading: (loading: boolean) => void;
}

interface Field {
  label: string;
  labelKey: string;
  options?: { label: string; value: string }[];
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
  visible,
  setLoading,
}: IRowEditingModal) {
  const { form_uid } = useParams<{ form_uid: string }>() ?? {
    form_uid: "",
  };

  const dispatch = useAppDispatch();

  const [editForm] = Form.useForm();
  const [formData, setFormData] = useState<DataItem>([]);
  const [updatedFields, setUpdatedFields] = useState<Field[]>([]);
  const [selectedBulkEditFieldKeys, setSelectedBulkEditFieldKeys] = useState<
    string[]
  >([]);
  const [bulkFieldsToInclude, setBulkFieldsToInclude] = useState<any>([]);
  const [bulkFieldsToExclude, setBulkFieldsToExclude] = useState<any>([
    "target_id",
  ]);
  const cancelHandler = () => {
    // Write code here for any cleanup
    onCancel();
  };

  const updateHandler = async () => {
    //validate form
    try {
      const values = await editForm.validateFields();
    } catch (err) {
      return;
    }

    const updateData = await editForm.getFieldsValue();

    const originalData = data;

    for (const key in updateData) {
      if (key.startsWith("target_locations.")) {
        if (updateData[key] !== null) {
          updateData["location_uid"] = updateData[key];
        }
        delete updateData[key];
      }
    }

    const patchKeys = {
      ...updateData,
    };
    //create request data
    if (originalData.length > 1 && form_uid) {
      //create a batch request
      const formUID = form_uid;
      const targetsUIDs = Array.from(
        new Set(originalData.map((item) => item["target_uid"]))
      );

      for (const key in patchKeys) {
        if (key.startsWith("custom_fields.")) {
          const fieldName = key.split("custom_fields.")[1];
          patchKeys[fieldName] = patchKeys[key];
          delete patchKeys[key];
        }
      }
      const batchRes = await dispatch(
        bulkUpdateTargets({ targetsUIDs, formUID, patchKeys })
      );

      if (batchRes?.payload?.status === 200) {
        message.success("Targets updated successfully");
        onUpdate();
        return;
      }
      batchRes?.payload?.errors
        ? message.error(batchRes?.payload?.errors)
        : message.error(
            "Failed to updated targets, kindly check and try again"
          );
    } else {
      const targetUID = originalData[0]["target_uid"];
      //create a single update request
      // Find the index of the row to update in originalData
      const indexToUpdate = originalData.findIndex(
        (item) => item["target_uid"] === targetUID
      );

      if (indexToUpdate !== -1) {
        // Create a new object with updated values
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

        // Update the custom_fields object within the main object with the removed values
        rest.custom_fields = {
          ...custom_fields,
          ...removedCustomFields,
        };

        // Update the originalData array with the modified main object
        originalData[indexToUpdate] = rest;
      }

      const targetData = { ...originalData[0] };

      const updateRes = await dispatch(updateTarget({ targetUID, targetData }));
      if (updateRes?.payload?.status === 200) {
        message.success("Target record updated successfully");
        onUpdate();
        return;
      } else {
        updateRes?.payload?.errors
          ? message.error(updateRes?.payload?.errors)
          : message.error(
              "Failed to updated target, kindly check and try again"
            );
      }
    }
  };

  const fieldsToExclude = [
    "target_uid",
    "completed_flag",
    "form_uid",
    "last_attempt_survey_status",
    "last_attempt_survey_status_label",
    "location_uid",
    "refusal_flag",
    "revisit_sections",
    "target_assignable",
    "num_attempts",
    "target_locations",
    "webapp_tag_color",
    "final_survey_status",
    "final_survey_status_label",
    "scto_fields",
  ]; //always exclude these

  const fetchTargetColumnConfig = async (form_uid: string) => {
    //more than one record so editing in bulk
    const configRes = await dispatch(
      getTargetsColumnConfig({ formUID: form_uid })
    );
    if (configRes.payload.status == 200) {
      const configData = configRes.payload?.data?.data?.file_columns;
      if (configData) {
        const editableFields = configData
          .filter((field: ConfigField) => field.bulk_editable)
          .map((field: ConfigField) => field.column_name);

        setBulkFieldsToInclude(editableFields);

        const nonEditableFields = configData
          .filter((field: ConfigField) => !field.bulk_editable)
          .map((field: ConfigField) => field.column_name);

        //remove fields not defined on the custom config
        fields.forEach((field: Field) => {
          if (
            !editableFields.includes(field.labelKey) &&
            !nonEditableFields.includes(field.labelKey)
          ) {
            bulkFieldsToExclude.push(field.labelKey);
          }
        });

        setBulkFieldsToExclude([...bulkFieldsToExclude, ...nonEditableFields]);
      }
    }
    return;
  };

  const initializeFormData = async () => {
    //exclude the mandatory fields
    let filteredFields = fields.filter(
      (field: Field) => !fieldsToExclude.includes(field.labelKey)
    );

    if (form_uid && data.length > 1) {
      //must wait for config before fields filtering
      await fetchTargetColumnConfig(form_uid);

      //exclude bulk non editable as well as the personal fields
      filteredFields = fields.filter(
        (field: Field) =>
          !bulkFieldsToExclude.includes(field.labelKey) &&
          !fieldsToExclude.includes(field.labelKey)
      );

      const additionalFieldsToInclude = fields.filter((field: Field) =>
        bulkFieldsToInclude.includes(field.labelKey)
      );

      fields.forEach((field: Field) => {
        if (
          field.label &&
          field.label.startsWith("target_locations.") &&
          !bulkFieldsToInclude.includes(field.labelKey)
        ) {
          additionalFieldsToInclude.push(field);
        }
      });

      filteredFields = [...filteredFields, ...additionalFieldsToInclude];
    }
    setUpdatedFields(filteredFields);

    const initialData: DataItem = [];
    filteredFields.forEach((field: Field) => {
      if (field?.label?.startsWith("custom_fields")) {
        initialData[field.label] = data[0]["custom_fields"][field.labelKey];

        const label = field?.label;
        const _field: any = {};
        _field[label] = initialData[field.label];

        editForm.setFieldsValue({ ..._field });
      } else {
        initialData[field.labelKey] = data[0][field.labelKey];
      }
    });
    setFormData(initialData);
    return;
  };

  useEffect(() => {
    //handle bulk fields
    if (formData.length == 0) {
      initializeFormData();
    }
  }, []);

  return (
    <>
      <GlobalStyle />
      <Drawer
        visible={visible}
        size="large"
        title={
          data && data.length > 1
            ? `Edit ${data.length} Selected Targets`
            : "Edit Target"
        }
        onClose={onCancel}
      >
        {data && data.length === 1 ? (
          <div style={{ maxHeight: "80vh", overflowY: "auto" }}>
            <Form
              labelCol={{ span: 7 }}
              form={editForm}
              style={{ textAlign: "left" }}
            >
              {updatedFields.map((field: Field, idx: number) => (
                <Form.Item
                  required
                  key={field.label}
                  id={`${field.label}-id`}
                  name={field.label}
                  labelAlign="left"
                  initialValue={
                    field.label && field.label.startsWith("target_locations.")
                      ? data[0]["location_uid"]
                      : field.label
                      ? data[0][field.labelKey]
                      : ""
                  }
                  label={
                    <span>
                      {field.labelKey
                        .split(/[\s_]/)
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
                      required: true,
                      message: `Please enter ${field.labelKey}`,
                    },
                  ]}
                >
                  {field.label &&
                  field.label.startsWith("target_locations.") ? (
                    <Select
                      placeholder={`Select ${field.labelKey}`}
                      style={{ width: "100%" }}
                    >
                      {field.options?.map(
                        (
                          option: { label: string; value: string },
                          index: number
                        ) => (
                          <Select.Option key={index} value={option.value}>
                            {option.label}
                          </Select.Option>
                        )
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
          </div>
        ) : data && data.length > 1 ? (
          <div style={{ maxHeight: "80vh", overflowY: "auto" }}>
            <OptionText
              style={{
                width: 410,
                display: "inline-block",
                marginBottom: 20,
              }}
            >
              {"Select fields to edit in bulk:"}
            </OptionText>

            <Form
              labelCol={{ span: 7 }}
              form={editForm}
              style={{ textAlign: "left" }}
            >
              {updatedFields.map((field: Field, idx: number) => {
                const isBulk = data.length > 1;
                const isSelected = selectedBulkEditFieldKeys.includes(
                  field.label
                );
                const labelDisplay = (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-start",
                      gap: 8,
                    }}
                  >
                    {isBulk && (
                      <Checkbox
                        checked={isSelected}
                        onChange={(e: { target: { checked: boolean } }) => {
                          const checked = e.target.checked;
                          setSelectedBulkEditFieldKeys((prev: string[]) =>
                            checked
                              ? [...prev, field.label]
                              : prev.filter((k) => k !== field.label)
                          );
                          if (!checked) {
                            editForm.setFieldsValue({
                              [field.label]: undefined,
                            });
                          }
                        }}
                        style={{ marginRight: 8 }}
                      />
                    )}
                    <span>
                      {field.labelKey
                        .split(/[\s_]/)
                        .map((word) =>
                          word.toLowerCase() === "id"
                            ? "ID"
                            : word.charAt(0).toUpperCase() +
                              word.slice(1).toLowerCase()
                        )
                        .join(" ")}
                    </span>
                  </div>
                );
                // In bulk mode, only render input if checked; in single mode, always render
                if (isBulk && !isSelected) {
                  return (
                    <Form.Item
                      key={field.label}
                      label={labelDisplay}
                      colon={false}
                      style={{ marginBottom: 16 }}
                      labelAlign="left"
                    />
                  );
                }
                return (
                  <Form.Item
                    key={field.label}
                    id={`${field.label}-id`}
                    name={field.label}
                    label={labelDisplay}
                    labelAlign="left"
                    rules={[
                      {
                        required: true,
                        message: `Please enter ${field.labelKey}`,
                      },
                    ]}
                    initialValue={
                      field.label && field.label.startsWith("target_locations.")
                        ? data[0]["location_uid"]
                        : field.label
                        ? data[0][field.labelKey]
                        : ""
                    }
                    style={{ marginBottom: 16 }}
                  >
                    {field.label &&
                    field.label.startsWith("target_locations.") ? (
                      <Select
                        placeholder={`Select ${field.labelKey}`}
                        style={{ width: "100%" }}
                      >
                        {field.options?.map(
                          (
                            option: { label: string; value: string },
                            index: number
                          ) => (
                            <Select.Option key={index} value={option.value}>
                              {option.label}
                            </Select.Option>
                          )
                        )}
                      </Select>
                    ) : (
                      <Input
                        placeholder={`Enter ${field.labelKey}`}
                        style={{ width: "100%" }}
                      />
                    )}
                  </Form.Item>
                );
              })}
            </Form>
          </div>
        ) : null}
        <div style={{ marginTop: 20 }}>
          <Button onClick={cancelHandler}>Cancel</Button>
          <CustomBtn
            style={{ marginLeft: 10 }}
            type="primary"
            onClick={updateHandler}
          >
            Save
          </CustomBtn>
        </div>
      </Drawer>
    </>
  );
}

export default RowEditingModal;
