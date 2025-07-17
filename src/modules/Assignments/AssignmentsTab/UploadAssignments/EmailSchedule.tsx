import {
  Button,
  DatePicker,
  Form,
  message,
  Radio,
  Select,
  TimePicker,
} from "antd";
import { useForm } from "antd/lib/form/Form";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { postAssignmentEmail } from "../../../../redux/assignments/assignmentsActions";
import { RootState } from "../../../../redux/store";
import { getEnumerators } from "../../../../redux/enumerators/enumeratorsActions";
import dayjs from "dayjs";
import { CustomBtn } from "../../../../shared/Global.styled";

const { Option } = Select;

interface EmailScheduleProps {
  emailSchedule: any;
  surveyUID: string | undefined;
  formUID: string | undefined;
  enumIds: string[];
}

function EmailSchedule({
  emailSchedule,
  surveyUID,
  formUID,
  enumIds,
}: EmailScheduleProps) {
  const [manualTriggerForm] = useForm();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { enumeratorList: enumeratorsData } = useAppSelector(
    (state: RootState) => state.enumerators
  );

  const [pendingEmailExists, setPendingEmailExists] = useState<boolean>(false);
  const [manualTriggerData, setManualTriggerData] = useState({
    date: null,
    time: null,
  });
  const [emailMode, setEmailMode] = useState<string | null>(null);
  const [enumUIds, setEnumUIds] = useState<number[]>([]);

  const handleDateChange = (date: any) => {
    setManualTriggerData({
      ...manualTriggerData,
      date: date,
    });
  };

  const handleTimeChange = (time: any) => {
    setManualTriggerData({
      ...manualTriggerData,
      time: time,
    });
  };

  const validateDate = (rule: any, value: any) => {
    if (!value) {
      return Promise.reject("Please select a date!");
    }

    const selectedDate = dayjs(value); // Convert value to dayjs or moment object
    const today = dayjs(); // Get today's date

    if (selectedDate.isBefore(today, "day")) {
      return Promise.reject("Date must be in the future!");
    }

    return Promise.resolve();
  };
  // Schedule the email on submit
  const onScheduleEmail = () => {
    manualTriggerForm
      .validateFields()
      .then(async (formValues) => {
        const manualTriggerPayload = {
          form_uid: formUID,
          status: "queued",
          email_config_uid: formValues.email_config_uid,
          date: formValues.date.format("YYYY-MM-DD"),
          time: formValues.time.format("HH:mm"),
          recipients: enumUIds,
        };

        dispatch(
          postAssignmentEmail({
            formData: manualTriggerPayload,
            callFn: (response: any) => {
              if (response.success) {
                message.success("Email schedule updated successfully.", () => {
                  navigate(
                    `/module-configuration/assignments/${surveyUID}/${formUID}`
                  );
                });
              } else {
                message.error("Error: " + response.message);
              }
            },
          })
        );
      })
      .catch((error) => {
        message.error(
          "Validation failed. Please ensure all email trigger fields are properly set."
        );
      });
  };

  // Get the next formatted email date
  useEffect(() => {
    if (emailSchedule) {
      // Add a nicely formatted schedule_time value for each email configuration in the response
      emailSchedule.map((email: any) => {
        if (!email.schedule_date || !email.time) {
          email.schedule_time = "No pending schedules";
        } else {
          const parsedDate = new Date(email.schedule_date);

          const year = parsedDate.getFullYear();
          const month = parsedDate.getMonth() + 1;
          const day = parsedDate.getDate();
          const [hour, minute] = email.time.split(":");

          const nextDate = new Date(year, month - 1, day, hour, minute, 0, 0);
          const formattedDate = `${nextDate.getFullYear()}-${(
            nextDate.getMonth() + 1
          )
            .toString()
            .padStart(2, "0")}-${nextDate
            .getDate()
            .toString()
            .padStart(2, "0")}`;

          email.schedule_time = formattedDate;
        }
      });
      if (emailSchedule.length > 0) {
        const pendingEmails = emailSchedule.find(
          (email: any) => email.schedule_time != "No pending schedules"
        );
        if (pendingEmails) {
          setPendingEmailExists(true);
        }
      }
    } else {
      setPendingEmailExists(false);
    }
  }, [emailSchedule]);

  // Map the enumerator ids to enumerator uids
  useEffect(() => {
    if (enumeratorsData && enumeratorsData.length > 0) {
      const enumUIds: number[] = [];
      enumeratorsData.forEach((enumerator: any) => {
        if (enumIds.indexOf(enumerator["enumerator_id"]) > -1) {
          enumUIds.push(enumerator["enumerator_uid"]);
        }
      });
      setEnumUIds(enumUIds);
    }
  }, [enumIds, enumeratorsData]);

  // Populate enumerators data
  useEffect(() => {
    dispatch(getEnumerators({ formUID: formUID ?? "" }));
  }, [dispatch]);

  return (
    <>
      {pendingEmailExists ? (
        <>
          <p
            style={{
              color: "#434343",
              fontFamily: "Lato",
              fontSize: "14px",
              lineHeight: "24px",
              marginTop: 30,
            }}
          >
            The next assignment emails for this form are scheduled to be sent
            at:
          </p>
          {emailSchedule.map((email: any, index: any) => (
            <li
              key={index}
              style={{
                fontFamily: "Lato",
                fontSize: "14px",
              }}
            >
              Email configuration: <b>{email.config_name}</b>, Date:{" "}
              <b>{email.schedule_time}</b>, Time: <b>{email.time}</b>
            </li>
          ))}
          <p
            style={{
              color: "#434343",
              fontFamily: "Lato",
              fontSize: "14px",
              lineHeight: "24px",
              marginTop: 30,
            }}
          >
            Do you want to send emails to the surveyors whose assignments have
            been changed before the given schedule?
          </p>
          <p
            style={{
              color: "#434343",
              fontFamily: "Lato",
              fontSize: "14px",
              lineHeight: "24px",
            }}
          >
            Note that the emails set up using this option will be sent only to
            the surveyors whose assignments have changed. If you want to change
            the existing email schedule for all surveyors, kindly visit the
            email configuration module.
          </p>
          <Radio.Group
            onChange={(e) => setEmailMode(e.target.value)}
            value={emailMode}
            style={{ marginBottom: 20 }}
          >
            <Radio value="email_time_yes">Yes, I want to change the time</Radio>
            <Radio value="email_time_no">
              No, I would like to retain the existing time
            </Radio>
          </Radio.Group>
        </>
      ) : emailSchedule ? (
        <>
          <p
            style={{
              color: "#434343",
              fontFamily: "Lato",
              fontSize: "14px",
              lineHeight: "24px",
              marginTop: 30,
            }}
          >
            There are <b> no pending assignment emails </b> scheduled for this
            form. Do you wish to send emails to the surveyors whose assignments
            have been changed? Note that the emails scheduled using this option
            will be sent only to the surveyors whose assignments have changed.
            If you want to change the existing email schedule for all surveyors,
            kindly visit the email configuration module.
          </p>
          <Radio.Group
            onChange={(e) => setEmailMode(e.target.value)}
            value={emailMode}
            style={{ marginBottom: 20 }}
          >
            <Radio value="email_time_yes">
              Yes, I want to schedule these emails now
            </Radio>
          </Radio.Group>
        </>
      ) : (
        <>
          <p
            style={{
              color: "#434343",
              fontFamily: "Lato",
              fontSize: "14px",
              lineHeight: "24px",
              marginTop: 30,
            }}
          >
            Assignment emails for this form have not been configured yet. If you
            would like to send emails with assignment information to the
            surveyors, kindly visit the emails module and set up an email
            configuration for this form.
          </p>
        </>
      )}

      {emailMode === "email_time_yes" ? (
        <>
          <p
            style={{
              color: "#434343",
              fontFamily: "Lato",
              fontSize: "14px",
              lineHeight: "22px",
            }}
          >
            Please select the date and time when you want the emails with
            assignment information to be sent to the surveyors:
          </p>
          <div style={{ marginBottom: 30 }}>
            <Form form={manualTriggerForm} layout="inline">
              <Form.Item
                label="Email configuration"
                name="email_config_uid"
                style={{ marginRight: 20 }}
                rules={[
                  {
                    required: true,
                    message: "Please select an email configuration!",
                  },
                ]}
                tooltip="This select is enabled when there are more than one email configurations using the assignments table."
                initialValue={
                  emailSchedule.length === 1
                    ? emailSchedule[0].email_config_uid
                    : null
                }
              >
                <Select
                  style={{ width: 250 }}
                  placeholder="Select an email configuration"
                  disabled={emailSchedule.length > 1 ? false : true}
                >
                  {emailSchedule?.map(
                    (
                      email: {
                        email_config_uid: any;
                        config_name: any;
                      },
                      index: any
                    ) => (
                      <Option key={index} value={email.email_config_uid}>
                        {email.config_name}
                      </Option>
                    )
                  )}
                </Select>
              </Form.Item>
              <Form.Item
                label="Date"
                name="date"
                style={{ marginRight: 20 }}
                rules={[{ validator: validateDate }]}
                tooltip="Date on which the email will be sent."
              >
                <DatePicker
                  size="middle"
                  style={{ width: 250 }}
                  onChange={handleDateChange}
                />
              </Form.Item>
              <Form.Item
                label="Time"
                name="time"
                rules={[
                  {
                    required: true,
                    message: "Please select a time!",
                  },
                ]}
                tooltip="Time at which the email will be sent, actual email delivery time will be after 10 minutes or more since the email is queued for delivery after surveycto data refreshes."
              >
                <TimePicker
                  placeholder="Select Time"
                  format="HH:mm"
                  minuteStep={30}
                  style={{ width: 250 }}
                  showNow={false}
                  needConfirm={false}
                  onChange={handleTimeChange}
                />
              </Form.Item>
            </Form>
          </div>
        </>
      ) : null}
      <div>
        {emailMode === "email_time_yes" ? (
          <>
            <Button
              style={{ marginTop: 20 }}
              type="default"
              onClick={() =>
                navigate(
                  `/module-configuration/assignments/${surveyUID}/${formUID}`
                )
              }
            >
              Cancel
            </Button>
            <CustomBtn
              style={{ marginLeft: 20 }}
              type="primary"
              onClick={onScheduleEmail}
            >
              Save
            </CustomBtn>
          </>
        ) : (
          <CustomBtn
            style={{ marginTop: 20 }}
            type="primary"
            onClick={() =>
              navigate(
                `/module-configuration/assignments/${surveyUID}/${formUID}`
              )
            }
          >
            Done
          </CustomBtn>
        )}
      </div>
    </>
  );
}

export default EmailSchedule;
