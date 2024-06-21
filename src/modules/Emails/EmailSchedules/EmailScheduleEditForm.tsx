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
  const generateDateRange = (start: any, end: any, frequency: any) => {
    const dates = [];
    const currentDate = new Date(start);
    const endDate = new Date(end);

    while (currentDate <= endDate) {
      dates.push(formatDate(currentDate));

      switch (frequency) {
        case "daily":
          currentDate.setDate(currentDate.getDate() + 1);
          break;
        case "weekly":
          currentDate.setDate(currentDate.getDate() + 7);
          break;
        case "bi_weekly":
          currentDate.setDate(currentDate.getDate() + 14);
          break;
        case "monthly":
          currentDate.setMonth(currentDate.getMonth() + 1);
          break;
        case "annually":
          currentDate.setFullYear(currentDate.getFullYear() + 1);
          break;
        default:
          throw new Error(`Unknown frequency: ${frequency}`);
      }
    }

    console.log("dates", dates);

    return dates;
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      form.validateFields();
      const formValues = await form.getFieldsValue();
      const { emailScheduleName, dateType, dates, emailTime, emailFrequency } =
        formValues;

      if (!dateType) {
        message.error("Date type is required");
        setLoading(false);

        return;
      }

      if (!emailFrequency && dateType == "multiple") {
        message.error("Email frequency is required");
        setLoading(false);

        return;
      }

      const schedule = {
        dateType: dateType,
        dates: dates,
        emailFrequency: emailFrequency,
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
      console.error("error", error);
      message.error("Failed to update email schedule");
    }
    setLoading(false);
  };

  const formatDates = (schedule: any) => {
    return schedule.dateType == "multiple"
      ? generateDateRange(
          schedule.dates[0],
          schedule.dates[schedule.dates.length - 1],
          schedule.emailFrequency
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
        emailFrequency: initialValues.emailFrequency,
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
        name="dateType"
        label="Date Type"
        rules={[{ required: true, message: "Please select a date type" }]}
      >
        <Select placeholder="Select Date Type">
          <Option value="single">Single Date</Option>
          <Option value="multiple">Multiple Dates</Option>
        </Select>
      </Form.Item>

      <Form.Item shouldUpdate>
        {({ getFieldValue }) => {
          const dateType = getFieldValue("dateType");
          return dateType === "multiple" ? (
            <Form.Item
              name="dates"
              label="Dates"
              rules={[{ required: true, message: "Please select dates" }]}
            >
              <RangePicker
                placeholder={["Start Date", "End Date"]}
                format="YYYY-MM-DD"
              />
            </Form.Item>
          ) : (
            <Form.Item
              name="dates"
              label="Date"
              rules={[{ required: true, message: "Please select a date" }]}
            >
              <DatePicker placeholder="Select Date" format="YYYY-MM-DD" />
            </Form.Item>
          );
        }}
      </Form.Item>

      {form.getFieldValue("dateType") === "multiple" && (
        <Form.Item
          name="emailFrequency"
          label="Email Frequency"
          rules={[
            {
              required: true,
              message: "Please select the email frequency",
            },
          ]}
        >
          <Select placeholder="Select Email Frequency">
            <Option value="daily">Daily</Option>
            <Option value="weekly">Weekly</Option>
            <Option value="bi_weekly">Bi-Weekly</Option>
            <Option value="monthly">Monthly</Option>
            <Option value="annually">Annually</Option>
          </Select>
        </Form.Item>
      )}

      <Form.Item
        name="emailTime"
        label="Email Time"
        rules={[{ required: true, message: "Please select a time" }]}
      >
        <TimePicker placeholder="Select Time" format="HH:mm" />
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
