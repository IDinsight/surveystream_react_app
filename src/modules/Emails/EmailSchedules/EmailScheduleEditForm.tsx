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
    return dayjs(date).format("YYYY-MM-DD");
  };
  const generateDateRange = (start: any, end: any) => {
    const dates = [];
    const currentDate = new Date(start);
    const endDate = new Date(end);

    while (currentDate <= endDate) {
      dates.push(formatDate(currentDate));
    }
    return dates;
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      form.validateFields();
      const formValues = await form.getFieldsValue();
      const { emailScheduleName, dateType, dates, emailTime } = formValues;

      if (!dateType) {
        message.error("Date type is required");
        setLoading(false);

        return;
      }

      const schedule = {
        dateType: dateType,
        dates: dates,
      };

      const formattedDates = formatDates(schedule);

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

  const formatDates = (schedule: any) => {
    return schedule.dateType == "multiple"
      ? generateDateRange(
          schedule.dates[0],
          schedule.dates[schedule.dates.length - 1]
        )
      : [schedule.dates.format("YYYY-MM-DD")];
  };

  useEffect(() => {
    if (initialValues) {
      const dateType = initialValues.dates.length > 1 ? "multiple" : "single";

      const formValues = {
        dateType: dateType,
        emailScheduleName: initialValues.email_schedule_name,
        dates:
          dateType === "multiple"
            ? [
                dayjs(initialValues.dates[0]),
                dayjs(initialValues.dates[initialValues.dates.length - 1]),
              ]
            : dayjs(initialValues.dates),
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
          maxTagCount="responsive"
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
