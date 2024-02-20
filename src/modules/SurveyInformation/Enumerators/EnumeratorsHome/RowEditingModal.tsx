import { Button, Form, Input, message } from "antd";
import {
  OptionText,
  RowEditingModalContainer,
  RowEditingModalHeading,
} from "./RowEditingModal.styled";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  bulkUpdateEnumerators,
  getEnumeratorsColumnConfig,
  updateEnumerator,
} from "../../../../redux/enumerators/enumeratorsActions";
import { useAppDispatch } from "../../../../redux/hooks";
import { use } from "chai";

interface IRowEditingModal {
  data: DataItem[];
  fields: Field[];
  onCancel: () => void;
  onUpdate: () => void;
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
    //validate form
    const values = await editForm.validateFields();

    const updateData = await editForm.getFieldsValue();

    const originalData = data;

    const patchKeys = {
      ...updateData,
    };
    //create request data
    if (originalData.length > 1 && form_uid) {
      //create a batch request
      const formUID = form_uid;
      const enumeratorUIDs = Array.from(
        new Set(originalData.map((item) => item["enumerator_uid"]))
      );
      const requestData = {
        enumeratorUIDs,
        formUID,
        patchKeys,
      };
      for (const key in patchKeys) {
        if (key.startsWith("custom_fields.")) {
          const fieldName = key.split("custom_fields.")[1];
          patchKeys[fieldName] = patchKeys[key];
          delete patchKeys[key];
        }
      }

      const batchRes = await dispatch(
        bulkUpdateEnumerators({ enumeratorUIDs, formUID, patchKeys })
      );

      if (batchRes?.payload?.status === 200) {
        message.success("Enumerators updated successfully");
        onUpdate();
        return;
      }
      batchRes?.payload?.errors
        ? message.error(batchRes?.payload?.errors)
        : message.error(
            "Failed to updated enumerators, kindly check and try again"
          );
    } else {
      const enumeratorUID = originalData[0]["enumerator_uid"];
      //create a single update request
      // Find the index of the row to update in originalData
      const indexToUpdate = originalData.findIndex(
        (item) => item["enumerator_uid"] === enumeratorUID
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
            "Failed to updated enumerator, kindly check and try again"
          );
    }
  };

  const fieldsToExclude = [
    "status",
    "custom_fields",
    "enumerator_uid",
    "monitor_locations",
    "surveyor_locations",
    "monitor_status",
    "surveyor_status",
  ]; //always exclude these

  const fetchEnumeratorsColumnConfig = async (form_uid: string) => {
    //more than one record so editing in bulk
    const configRes = await dispatch(
      getEnumeratorsColumnConfig({ formUID: form_uid })
    );
    if (configRes.payload.status == 200) {
      const configData = configRes.payload?.data?.data;

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

        const excludeFields = [...bulkFieldsToExclude, ...nonEditableFields];

        setBulkFieldsToExclude(excludeFields);
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
      await fetchEnumeratorsColumnConfig(form_uid);
      //exclude bulk non editable as well as the personal fields
      filteredFields = fields.filter(
        (field: Field) =>
          !bulkFieldsToExclude.includes(field.labelKey) &&
          !fieldsToExclude.includes(field.labelKey)
      );

      //include if a field is contracting
      const additionalFieldsToInclude = fields.filter((field: Field) =>
        bulkFieldsToInclude.includes(field.labelKey)
      );

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
    <RowEditingModalContainer>
      <RowEditingModalHeading>
        {data && data.length > 1
          ? `Edit ${data.length} enumerators in bulk`
          : "Edit enumerator"}
      </RowEditingModalHeading>
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
                <Input
                  placeholder={`Enter ${field.labelKey}`}
                  style={{ width: "100%" }}
                />
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
    </RowEditingModalContainer>
  );
}

export default RowEditingModal;
