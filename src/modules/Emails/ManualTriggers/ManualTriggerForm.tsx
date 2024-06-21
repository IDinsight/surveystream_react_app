import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { Form, Button, Select, DatePicker, message, TimePicker } from "antd";
import {
  createManualEmailTrigger,
  updateManualEmailTrigger,
} from "../../../redux/emails/emailsActions";
import { useAppDispatch } from "../../../redux/hooks";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";

const { Option } = Select;

const ManualEmailTriggerForm = ({
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

      console.log("uniqueRecipients", uniqueRecipients);

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
        console.log(
          "updatedInitialValues.recipients",
          updatedInitialValues.recipients
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
      <Form.Item
        name="date"
        label="Date"
        rules={[
          { required: true, message: "Please select the date" },
          { validator: validateDate },
        ]}
      >
        <DatePicker
          format="YYYY-MM-DD"
          defaultValue={dayjs(initialValues?.date)}
        />
      </Form.Item>
      <Form.Item
        name="time"
        label="Time"
        rules={[{ required: true, message: "Please select the time" }]}
      >
        <TimePicker format="HH:mm" />
      </Form.Item>
      <Form.Item
        name="recipients"
        label="Recipients"
        rules={[{ required: false, message: "Please select the recipients" }]}
      >
        <Select
          showSearch
          mode="multiple"
          placeholder="Select recipients"
          options={surveyEnumerators.map((enumerator: any, index: any) => ({
            label: enumerator.name,
            value: enumerator.enumerator_id,
            key: index,
          }))}
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary" onClick={handleSubmit} loading={loading}>
          {isEditMode ? "Update" : "Submit"}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ManualEmailTriggerForm;
