import { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  message,
  DatePicker,
  TimePicker,
} from "antd";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { updateEmailSchedule } from "../../../redux/emails/emailsActions";
import { RootState } from "../../../redux/store";
import FullScreenLoader from "../../../components/Loaders/FullScreenLoader";
import dayjs from "dayjs";

const { Option } = Select;
const { RangePicker } = DatePicker;

const EmailScheduleEditForm = ({
  handleBack,
  handleContinue,
  initialValues,
  fetchEmailSchedules,
}: any) => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((state: RootState) => state.emails.loading);

  const [loading, setLoading] = useState(false);

  const formatDate = (date: any) => {
    const d = new Date(date);
    const month = `${d.getMonth() + 1}`.padStart(2, "0");
    const day = `${d.getDate()}`.padStart(2, "0");
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      form.validateFields();
      const formValues = await form.getFieldsValue();
      const { emailScheduleName, dates, emailTime } = formValues;

      const schedule = {
        dates: dates,
      };

      const formattedDates = schedule?.dates?.map((date: any) =>
        formatDate(date)
      );

      if (formattedDates.length < 1) {
        message.error("Dates not well formatted, check and try again");
        setLoading(false);
        return;
      }
      const formattedTime = emailTime.format("HH:mm");

      const emailScheduleData = {
        dates: formattedDates,
        time: formattedTime,
        email_schedule_name: emailScheduleName,
        email_config_uid: initialValues.email_config_uid,
      };

      const emailScheduleUID = initialValues.email_schedule_uid;

      const res = await dispatch(
        updateEmailSchedule({
          id: emailScheduleUID,
          emailScheduleData: emailScheduleData,
        })
      );

      if (!res.payload.success) {
        // Error occurred
        message.error(
          res.payload?.message
            ? res.payload?.message
            : "An error occurred, email schedule could not be updated. Kindly check form data and try again"
        );
        setLoading(false);
        return;
      }

      message.success("Email schedule updated successfully");
      fetchEmailSchedules();
    } catch (error) {
      message.error("Failed to update email schedule");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (initialValues) {
      const formValues = {
        emailScheduleName: initialValues.email_schedule_name,
        dates: initialValues.dates.map((date: any) => dayjs(date)),
        emailTime: dayjs(initialValues.time, "HH:mm"),
      };

      form.setFieldsValue({ ...formValues });
    }
  }, [initialValues]);

  if (loading || isLoading) {
    return <FullScreenLoader />;
  }

  return (
    <Form form={form} layout="vertical">
      <Form.Item
        name="emailScheduleName"
        label="Email Schedule Name"
        tooltip="Select a unique name for the email schedule"
        rules={[
          {
            required: true,
            message: "Please enter the email schedule name",
          },
        ]}
      >
        <Input placeholder="Email Schedule Name e.g. Morning, Midday, Evening" />
      </Form.Item>

      <Form.Item
        style={{ width: "100%", marginRight: "5px" }}
        name="dates"
        label="Email Dates"
        tooltip="Select all dates to send emails according to the schedule, multiple dates can be selected."
        rules={[{ required: true, message: "Please select a date" }]}
      >
        <DatePicker
          multiple={true}
          placeholder="Select Dates"
          format="YYYY-MM-DD"
          minDate={dayjs()}
          maxTagCount={15}
        />
      </Form.Item>

      <Form.Item
        name="emailTime"
        label="Email Time"
        rules={[{ required: true, message: "Please select a time" }]}
        tooltip="Time the email will be sent, actual email delivery time will be after 10 minutes or more since the email is queued for delivery after surveycto data refreshes."
      >
        <TimePicker
          placeholder="Select Time"
          format="HH:mm"
          minuteStep={30}
          showNow={false}
          needConfirm={false}
        />
      </Form.Item>

      <div style={{ display: "flex", marginTop: "40px" }}>
        <Button
          type="primary"
          onSubmit={() => form.validateFields()}
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </div>
    </Form>
  );
};

export default EmailScheduleEditForm;
