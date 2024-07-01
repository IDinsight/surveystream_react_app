import { useEffect, useState } from "react";
import { Form, Button, Select, message, Input } from "antd";
import {
  createManualEmailTrigger,
  updateManualEmailTrigger,
} from "../../../redux/emails/emailsActions";
import { useAppDispatch } from "../../../redux/hooks";
import dayjs from "dayjs";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

const { Option } = Select;

const EmailTemplateEditForm = ({
  emailConfigData,
  surveyEnumerators,
  closeAddManualDrawer,
  fetchManualTriggers,
  initialValues = {},
  isEditMode = false,
}: any) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  const validateDate = (rule: any, value: any) => {
    if (!value) {
      return Promise.reject("Please select the date");
    }

    const selectedDate = dayjs(value); // Convert value to dayjs or moment object
    const today = dayjs(); // Get today's date

    if (selectedDate.isBefore(today, "day")) {
      return Promise.reject("Date must be in the future");
    }

    return Promise.resolve();
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await form.validateFields();
      const formData = form.getFieldsValue();
      const formattedDate = formData?.date
        ? dayjs(formData.date).format("YYYY-MM-DD")
        : null;

      const formattedTime = formData?.time
        ? dayjs(formData.time).format("HH:mm")
        : null;

      const recipients = formData?.recipients
        ? formData.recipients.map((recipient: any) =>
            typeof recipient === "object" ? recipient.value : recipient
          )
        : [];
      const uniqueRecipients = Array.from(new Set(recipients));

      const manualTriggerData = {
        ...formData,
        recipients: uniqueRecipients,
        date: formattedDate,
        time: formattedTime,
      };

      let res;
      if (isEditMode) {
        res = await dispatch(
          updateManualEmailTrigger({
            manualEmailTriggerData: manualTriggerData,
            id: initialValues.manual_email_trigger_uid,
          })
        );
      } else {
        res = await dispatch(createManualEmailTrigger(manualTriggerData));
      }

      if (res.payload.success) {
        message.success(
          `Email manual trigger ${
            isEditMode ? "updated" : "created"
          } successfully`
        );
        form.resetFields();
        closeAddManualDrawer();
        fetchManualTriggers();
      } else {
        const { message } = res.payload;
        let errorMessage = "Error: ";

        // Iterate through each key in the message object
        Object.keys(message).forEach((key) => {
          if (message[key] && message[key].length > 0) {
            errorMessage += `${key}: ${message[key][0]}. `;
          }
        });

        message.error(
          errorMessage
            ? errorMessage
            : "Failed to update manual trigger, kindly check values and try again"
        );
      }
    } catch (error) {
      message.error(
        `Failed to ${isEditMode ? "update" : "create"} manual email trigger`
      );
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isEditMode && initialValues) {
      const updatedInitialValues = { ...initialValues };
      if (updatedInitialValues?.recipients) {
        updatedInitialValues.recipients = initialValues.recipients.map(
          (id: number) => ({
            label: surveyEnumerators.find((e: any) => e.enumerator_id == id)
              ?.name,
            value: id,
          })
        );
      }
      form.setFieldsValue({
        ...updatedInitialValues,
        date: updatedInitialValues.date
          ? dayjs(updatedInitialValues.date)
          : null,
        time: updatedInitialValues.time
          ? dayjs(updatedInitialValues.time, "HH:mm")
          : null,
      });
    }
  }, [isEditMode, initialValues, form]);

  return (
    <Form form={form} layout="vertical">
      <Form.Item
        name="email_config_uid"
        label="Email Configuration"
        rules={[
          { required: true, message: "Please select an email configuration" },
        ]}
      >
        <Select
          placeholder="Select email configuration"
          options={emailConfigData.map((config: any) => ({
            label: config.config_type,
            value: config.email_config_uid,
          }))}
        />
      </Form.Item>
      <Form.List name="templates" initialValue={[{}]}>
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <div key={key} style={{ marginBottom: 8 }}>
                {fields.length > 1 && (
                  <MinusCircleOutlined
                    onClick={() => remove(name)}
                    style={{ float: "right" }}
                  />
                )}

                <Form.Item
                  {...restField}
                  name={[name, "language"]}
                  label="Language"
                  rules={[
                    { required: true, message: "Please select language" },
                  ]}
                >
                  <Input placeholder="Enter language" />
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, "subject"]}
                  label="Subject"
                  rules={[{ required: true, message: "Please enter subject" }]}
                >
                  <Input placeholder="Enter subject" />
                </Form.Item>

                <Form.Item
                  {...restField}
                  name={[name, "content"]}
                  label="Content"
                  rules={[{ required: true, message: "Please enter content" }]}
                >
                  <Input.TextArea
                    rows={5}
                    placeholder='Enter content using the variables indicated by ${}, for instance, "Hello, ${enumerator_name}."'
                  />
                </Form.Item>
              </div>
            ))}

            <Form.Item>
              <Button
                type="dashed"
                onClick={() => add()}
                block
                icon={<PlusOutlined />}
              >
                Add another language
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>

      <Form.Item>
        <Button type="primary" onClick={handleSubmit} loading={loading}>
          {isEditMode ? "Update" : "Submit"}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default EmailTemplateEditForm;
