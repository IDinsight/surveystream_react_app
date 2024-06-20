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
import { MinusCircleOutlined } from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import {
  updateEmailSchedule,
  getEmailSchedules,
} from "../../../redux/emails/emailsActions";
import { RootState } from "../../../redux/store";
import FullScreenLoader from "../../../components/Loaders/FullScreenLoader";
import moment from "moment";

const { Option } = Select;
const { RangePicker } = DatePicker;

const EmailScheduleEditForm = ({
  handleBack,
  handleContinue,
  initialValues,
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
    return dates;
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const formValues = await form.validateFields();
      const { schedules } = form.getFieldsValue();

      for (let i = 0; i < schedules.length; i++) {
        const schedule = schedules[i];

        const formattedDates = formatDates(schedule);
        const formattedTime = schedule?.emailTime.format("HH:mm");

        const emailScheduleData = {
          dates: formattedDates,
          time: formattedTime,
          email_schedule_name: schedule?.emailScheduleName,
        };

        console.log("emailScheduleData", emailScheduleData);

        const emailScheduleUID = initialValues.email_schedule_uid;

        const res = await dispatch(
          updateEmailSchedule({
            id: emailScheduleUID,
            emailScheduleData: emailScheduleData,
          })
        );

        console.log("updateEmailSchedule res", res);

        if (!res.payload.success) {
          // Error occurred
          message.error(
            res.payload?.message
              ? res.payload?.message
              : "An error occurred, email schedules could not be updated. Kindly check form data and try again"
          );
          setLoading(false);
          return;
        }
      }

      message.success("Email schedules updated successfully");
    } catch (error) {
      console.error("error", error);
      message.error("Failed to update email schedules");
    }
    setLoading(false);
  };

  // Helper function to format dates
  const formatDates = (schedule: any) => {
    return schedule.dateType === "multiple"
      ? generateDateRange(
          schedule.dates[0],
          schedule.dates[1],
          schedule.emailFrequency
        )
      : [schedule.dates.format("YYYY-MM-DD")];
  };

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        schedules: initialValues.map((schedule: any) => ({
          ...schedule,
          dates:
            schedule.dateType === "multiple"
              ? [moment(schedule.dates[0]), moment(schedule.dates[1])]
              : moment(schedule.dates),
          emailTime: moment(schedule.time, "HH:mm"),
        })),
      });
    }
  }, [initialValues]);

  if (loading || isLoading) {
    return <FullScreenLoader />;
  }

  return (
    <Form form={form} layout="vertical">
      <Form.List name="schedules">
        {(fields, { remove }) => (
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
                  name={[name, "emailScheduleName"]}
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
                <div style={{ display: "flex" }}>
                  <Form.Item
                    style={{ width: "40%", marginRight: "5px" }}
                    {...restField}
                    name={[name, "dateType"]}
                    rules={[
                      { required: true, message: "Please select a date type" },
                    ]}
                  >
                    <Select placeholder="Select Date Type">
                      <Select.Option value="single">Single Date</Select.Option>
                      <Select.Option value="multiple">
                        Multiple Dates
                      </Select.Option>
                    </Select>
                  </Form.Item>
                  <Form.Item
                    style={{ width: "60%", marginRight: "5px" }}
                    shouldUpdate={(prevValues, currentValues) =>
                      prevValues.schedules !== currentValues.schedules
                    }
                  >
                    {({ getFieldValue }) => {
                      const dateType = getFieldValue([
                        "schedules",
                        name,
                        "dateType",
                      ]);
                      return dateType === "multiple" ? (
                        <Form.Item
                          {...restField}
                          name={[name, "dates"]}
                          rules={[
                            { required: true, message: "Please select dates" },
                          ]}
                        >
                          <RangePicker
                            placeholder={["Start Date", "End Date"]}
                            format="YYYY-MM-DD"
                          />
                        </Form.Item>
                      ) : (
                        <Form.Item
                          {...restField}
                          name={[name, "dates"]}
                          rules={[
                            { required: true, message: "Please select a date" },
                          ]}
                        >
                          <DatePicker
                            placeholder="Select Date"
                            format="YYYY-MM-DD"
                          />
                        </Form.Item>
                      );
                    }}
                  </Form.Item>
                </div>
                <div style={{ display: "flex" }}>
                  <Form.Item
                    style={{ width: "40%", marginRight: "5px" }}
                    {...restField}
                    name={[name, "emailTime"]}
                    label="Email Time"
                    rules={[
                      { required: true, message: "Please select a time" },
                    ]}
                  >
                    <TimePicker placeholder="Select Time" format="HH:mm" />
                  </Form.Item>

                  <Form.Item
                    noStyle
                    shouldUpdate={(prevValues, currentValues) =>
                      prevValues.schedules !== currentValues.schedules
                    }
                  >
                    {({ getFieldValue }) => {
                      const dateType = getFieldValue([
                        "schedules",
                        name,
                        "dateType",
                      ]);
                      return dateType === "multiple" ? (
                        <Form.Item
                          style={{ width: "40%", marginRight: "5px" }}
                          {...restField}
                          name={[name, "emailFrequency"]}
                          label="Email Frequency"
                          rules={[
                            {
                              required: true,
                              message: "Please select the email frequency",
                            },
                          ]}
                        >
                          <Select placeholder="Select Email Frequency">
                            <Select.Option value="daily">Daily</Select.Option>
                            <Select.Option value="weekly">Weekly</Select.Option>
                            <Select.Option value="bi_weekly">
                              Bi-Weekly
                            </Select.Option>
                            <Select.Option value="monthly">
                              Monthly
                            </Select.Option>
                            <Select.Option value="annually">
                              Annually
                            </Select.Option>
                          </Select>
                        </Form.Item>
                      ) : null;
                    }}
                  </Form.Item>
                </div>
              </div>
            ))}
          </>
        )}
      </Form.List>

      <div style={{ display: "flex", marginTop: "40px" }}>
        <Button
          style={{
            display: "flex",
            marginRight: "35%",
          }}
          loading={loading}
          onClick={handleBack}
        >
          Back
        </Button>

        <Button
          style={{
            display: "flex",
            marginRight: "35%",
          }}
          loading={loading}
          onClick={handleContinue}
        >
          Skip
        </Button>

        <Button
          type="primary"
          style={{
            display: "flex",
            backgroundColor: "#3AB44E",
          }}
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </div>
    </Form>
  );
};

export default EmailScheduleEditForm;
