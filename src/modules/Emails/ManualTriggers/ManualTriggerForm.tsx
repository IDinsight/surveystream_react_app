import { useEffect, useState } from "react";
import { Form, Button, Select, DatePicker, message, TimePicker } from "antd";
import {
  createManualEmailTrigger,
  updateManualEmailTrigger,
} from "../../../redux/emails/emailsActions";
import { useAppDispatch } from "../../../redux/hooks";
import { format, parse } from "date-fns";

const { Option } = Select;

const ManualEmailTriggerForm = ({
  emailConfigData,
  surveyEnumerators,
  closeAddManualDrawer,
  initialValues = {},
  isEditMode = false,
}: any) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await form.validateFields();
      const formData = form.getFieldsValue();
      const formattedDate = formData?.date
        ? format(formData.date, "yyyy-MM-dd")
        : null;
      const formattedTime = formData?.time
        ? format(formData.time, "HH:mm")
        : null;

      const manualTriggerData = {
        ...formData,
        date: formattedDate,
        time: formattedTime,
      };

      let res;
      if (isEditMode) {
        res = await dispatch(
          updateManualEmailTrigger({
            ...manualTriggerData,
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
      } else {
        message.error(res.payload.message);
      }
    } catch (error) {
      console.error("error", error);
      message.error(
        `Failed to ${isEditMode ? "update" : "create"} manual email trigger`
      );
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isEditMode && initialValues) {
      console.log("initialValues", initialValues);
      form.setFieldsValue({
        ...initialValues,
        date: initialValues.date
          ? parse(initialValues.date, "yyyy-MM-dd", new Date())
          : null,
        time: initialValues.time
          ? parse(initialValues.time, "HH:mm", new Date())
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
        rules={[{ required: true, message: "Please select the date" }]}
      >
        <DatePicker format="yyyy-MM-dd" />
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
          options={surveyEnumerators.map((enumerator: any) => ({
            label: enumerator.name,
            value: enumerator.enumerator_id,
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
