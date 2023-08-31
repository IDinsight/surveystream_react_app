import { Button, Form, Input } from "antd";
import {
  OptionText,
  RowEditingModalContainer,
  RowEditingModalHeading,
} from "./RowEditingModal.styled";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getEnumeratorsColumnConfig } from "../../../redux/enumerators/enumeratorsActions";
import { useAppDispatch } from "../../../redux/hooks";
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
  const [bulkFieldsToInclude, setBulkFieldsToInclude] = useState<any>([]);
  const [bulkFieldsToExclude, setBulkFieldsToExclude] = useState<any>([
    "enumerator_id",
    "name",
    "email",
    "mobile_primary",
  ]);
  const cancelHandler = () => {
    // Write code here for any cleanup
    onCancel();
  };

  const updateHandler = () => {
    // Write here for passing the data to update the record
    onUpdate();
  };

  const fieldsToExclude = ["status"]; //always exclude status

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

        setBulkFieldsToExclude({
          ...bulkFieldsToExclude,
          ...nonEditableFields,
        });
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

    filteredFields.forEach((field) => {
      initialData[field.labelKey] = data[0][field.labelKey];
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
        <OptionText style={{ width: 410, display: "inline-block" }}>
          {`Bulk editing is only allowed for ${updatedFields
            .map((item: any) => item.label)
            .join(", ")}.`}
        </OptionText>
      ) : null}
      <br />
      {data && data.length > 0 ? (
        <>
          <Form labelCol={{ span: 7 }} form={editForm}>
            {updatedFields.map((field: Field, idx: number) => (
              <Form.Item
                required
                key={idx}
                id={`${field.labelKey}-id`}
                name={field.labelKey}
                initialValue={field.labelKey ? data[0][field.labelKey] : ""}
                label={<span>{field.labelKey}</span>}
                rules={[
                  {
                    required: true,
                    message: `Please enter ${field.label}`,
                  },
                ]}
              >
                <Input
                  placeholder={`Enter ${field.label}`}
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
