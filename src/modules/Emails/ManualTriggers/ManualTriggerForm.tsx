import { useState } from "react";
import { Form, Button, Select, DatePicker, message, TimePicker } from "antd";
import { createManualEmailTrigger } from "../../../redux/emails/emailsActions";
import { useAppDispatch } from "../../../redux/hooks";

const { Option } = Select;

const ManualEmailTriggerForm = ({
  emailConfigData,
  surveyEnumerators,
  closeAddManualDrawer,
}: any) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const handleAddManualTriggerSubmit = async () => {
    setLoading(true);

    await form.validateFields();
    const formData = form.getFieldsValue();

    const formattedDate = formData?.date.format("YYYY-MM-DD");
    const formattedTime = formData?.time.format("HH:mm");

    const manualTriggerData = {
      ...formData,
      date: formattedDate,
      time: formattedTime,
    };

    try {
      if (Object.keys(formData).length !== 0) {
        const res = await dispatch(createManualEmailTrigger(manualTriggerData));
        if (res.payload.success) {
          message.success("Email manual trigger created successfully");
          closeAddManualDrawer();
        } else {
          message.error(res.payload.message);
        }
      } else {
        message.error("Form data is empty");
      }
    } catch (error) {
      console.error("error", error);
      message.error("Failed to create manual email trigger");
    }

    setLoading(false);
  };

  return (
    <Form form={form} layout="vertical">
      <Form.Item
        name="email_config_uid"
        label="Email Configuration"
        rules={[
          {
            required: true,
            message: "Please select an email configuration",
          },
        ]}
      >
        <Select
          placeholder="Select email configuration"
          options={emailConfigData.map((config: any) => ({
            label: config?.config_type,
            value: config?.email_config_uid,
          }))}
        />
      </Form.Item>
      <Form.Item
        name="date"
        label="Date"
        rules={[{ required: true, message: "Please select the date" }]}
      >
        <DatePicker />
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
        <Button
          type="primary"
          onClick={handleAddManualTriggerSubmit}
          loading={loading}
        >
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ManualEmailTriggerForm;
