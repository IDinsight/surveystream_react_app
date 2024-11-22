import { Button, DatePicker, Form, message, Radio, TimePicker } from "antd";
import { useForm } from "antd/lib/form/Form";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { postAssignmentEmail } from "../../../../redux/assignments/assignmentsActions";
import { RootState } from "../../../../redux/store";
import { getEnumerators } from "../../../../redux/enumerators/enumeratorsActions";

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

  const [nextEmailDate, setNextEmailDate] = useState<string>();
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

  // Schedule the email on submit
  const onScheduleEmail = () => {
    manualTriggerForm
      .validateFields()
      .then(async (formValues) => {
        const manualTriggerPayload = {
          form_uid: formUID,
          status: "queued",
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
      const now = new Date();

      //get time from response.data?.time and combine dates with time
      const datesWithTime = emailSchedule?.dates?.map((date: any) => {
        const parsedDate = new Date(date);
        const year = parsedDate.getFullYear();
        const month = parsedDate.getMonth() + 1;
        const day = parsedDate.getDate();

        const [hour, minute] = emailSchedule.time.split(":");

        return new Date(year, month - 1, day, hour, minute, 0, 0);
      });

      // Find the date element just greater than now
      const nextDate = datesWithTime.find((date: any) => date > now);
      const formattedDate = `${nextDate.getFullYear()}-${(
        nextDate.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}-${nextDate.getDate().toString().padStart(2, "0")}`;

      setNextEmailDate(formattedDate);
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
      {emailSchedule ? (
        <>
          <p
            style={{
              color: "#434343",
              fontFamily: "Lato",
              fontSize: "14px",
              lineHeight: "22px",
              marginTop: 30,
            }}
          >
            The emails are scheduled to be sent on {nextEmailDate} at{" "}
            {emailSchedule?.time}. Do you want to send the emails to the
            surveyors whose assignments have been changed before that? Please
            note that the emails will be sent only to the surveyors whose
            assignments have changed. If you want to change the existing email
            schedule, please visit the email configuration module.
          </p>
          <Radio.Group
            onChange={(e) => setEmailMode(e.target.value)}
            value={emailMode}
            style={{ marginBottom: 20 }}
          >
            <Radio value="email_time_yes">Yes, I want to change the time</Radio>
            {emailMode !== "email_time_yes" ? (
              <div style={{ marginTop: 24 }}>
                <Button
                  type="default"
                  onClick={() =>
                    navigate(
                      `/module-configuration/assignments/${surveyUID}/${formUID}`
                    )
                  }
                >
                  I do not want to change the time
                </Button>
              </div>
            ) : null}
          </Radio.Group>
        </>
      ) : (
        <>
          <p
            style={{
              color: "#434343",
              fontFamily: "Lato",
              fontSize: "14px",
              lineHeight: "22px",
              marginTop: 30,
            }}
          >
            The emails for this survey have not been scheduled yet. Do you wish
            to send emails to the surveyors whose assignments have been changed?
            Please be aware that the emails will only be sent to those surveyors
            whose assignments have changed. If you would like to setup email
            schedules, please visit the email configuration module.
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
          {emailMode !== "email_time_yes" ? (
            <div style={{ marginTop: 12 }}>
              <Button
                type="default"
                onClick={() =>
                  navigate(
                    `/module-configuration/assignments/${surveyUID}/${formUID}`
                  )
                }
              >
                I do not want to schedule
              </Button>
            </div>
          ) : null}
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
            <Form form={manualTriggerForm} style={{ display: "flex" }}>
              <Form.Item
                label="Date"
                name="date"
                style={{ marginRight: 20 }}
                rules={[
                  {
                    required: true,
                    message: "Please select a date!",
                  },
                ]}
              >
                <DatePicker
                  size="middle"
                  style={{ width: 300 }}
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
              >
                <TimePicker
                  size="middle"
                  style={{ width: 300 }}
                  onChange={handleTimeChange}
                />
              </Form.Item>
            </Form>
            <div style={{ marginTop: 12 }}>
              <Button
                type="default"
                onClick={() =>
                  navigate(
                    `/module-configuration/assignments/${surveyUID}/${formUID}`
                  )
                }
              >
                Cancel
              </Button>
              <Button
                style={{ marginLeft: 20 }}
                type="primary"
                onClick={onScheduleEmail}
              >
                Schedule
              </Button>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
}

export default EmailSchedule;
