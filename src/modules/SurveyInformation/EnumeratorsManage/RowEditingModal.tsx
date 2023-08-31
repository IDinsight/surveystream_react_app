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
  const [updatedFields, setUpdatedFields] = useState<Field>();
  const [bulkFieldsToInclude, setBulkFieldsToInclude] = useState<any>([]);

  const cancelHandler = () => {
    // Write code here for any cleanup
    onCancel();
  };

  const updateHandler = () => {
    // Write here for passing the data to update the record
    onUpdate();
  };

  const fieldsToExclude = ["status"];

  const fetchEnumeratorsColumnConfig = async (form_uid: string) => {
    console.log("fetchEnumeratorsColumnConfig - called");
    if (data.length > 1) {
      //more than one record so editing in bulk
      if (form_uid) {
        const configRes = await dispatch(
          getEnumeratorsColumnConfig({ formUID: form_uid })
        );
        console.log("configRes", configRes);
        if (configRes.payload.status == 200) {
          console.log("configRes", configRes);
        }
      }
    }
    return;
  };

  const initializeFormData = async () => {
    console.log("initializeFormData - called");
    if (form_uid) {
      console.log("form_uid", form_uid);
      fetchEnumeratorsColumnConfig(form_uid);
    }
    const initialData: DataItem = data;
    console.log("initialData", initialData);

    fields.forEach((field) => {
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
          {`Bulk editing is only allowed for ${fields
            .map((item: any) => item.label)
            .join(", ")}.`}
        </OptionText>
      ) : null}
      <br />
      {data && data.length > 0 ? (
        <>
          <Form labelCol={{ span: 7 }} form={editForm}>
            {fields.map((field: Field, idx: number) => (
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
