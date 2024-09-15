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
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import {
  createEmailSchedule,
  getEmailSchedules,
} from "../../../redux/emails/emailsActions";
import { RootState } from "../../../redux/store";
import FullScreenLoader from "../../../components/Loaders/FullScreenLoader";
import dayjs from "dayjs";
import EmailScheduleFilter from "../../../components/EmailScheduleFilter";
import EmailScheduleFilterCard from "../../../components/EmailScheduleFilterCard";
const { Option } = Select;
const { RangePicker } = DatePicker;

const EmailScheduleForm = ({
  handleBack,
  handleContinue,
  configNames,
  emailConfigUID,
}: any) => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((state: RootState) => state.emails.loading);
  const [currentFormIndex, setCurrentFormIndex] = useState<number | null>(null);

  const [loading, setLoading] = useState(false);
  const [insertScheduleFilterOpen, setScheduleFilterOpen] = useState(false);

  const [tableList, setTableList] = useState([]);

  const [selectedVariable, setSelectedVariable] = useState<any>({
    variable: null,
    aggregation: null,
  });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const [formStates, setFormStates] = useState<any>([
    {
      tableList: [],
    },
  ]);
  const addFormState = (index: number | null = null) => {
    const currentData = index !== null ? formStates[index] : null;
    const newFormState = {
      tableList: currentData ? [...currentData.tableList] : [],
    };
    setFormStates([...formStates, newFormState]);
  };
  const updateFormState = (index: any, key: any, value: any) => {
    const newFormStates = [...formStates];
    newFormStates[index][key] = value;
    setFormStates(newFormStates);
  };

  const formatDate = (date: any) => {
    const d = new Date(date);
    const month = `${d.getMonth() + 1}`.padStart(2, "0");
    const day = `${d.getDate()}`.padStart(2, "0");
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
  };

  const fetchEmailSchedules = async () => {
    const email_config_uid = emailConfigUID;
    const emailSchedulesRes = await dispatch(
      getEmailSchedules({ email_config_uid })
    );
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const formValues = form.validateFields();
      const { schedules } = form.getFieldsValue();

      for (let i = 0; i < schedules.length; i++) {
        const schedule = schedules[i];
        const dates = schedule?.dates?.map((date: any) => formatDate(date));
        const formattedTime = schedule?.emailTime?.format("HH:mm");

        const filterList = formStates[i].tableList.map(
          (table: any) => table.filter_list
        );
        const mergedFilterList = [].concat(...filterList);

        const emailScheduleData = {
          email_config_uid: emailConfigUID,
          dates: dates,
          time: formattedTime,
          email_schedule_name: schedule?.emailScheduleName,
          filter_list: mergedFilterList,
        };

        const res = await dispatch(
          createEmailSchedule({ ...emailScheduleData })
        );

        if (!res.payload.success) {
          // Error occurred
          message.error(
            res.payload?.message
              ? res.payload?.message
              : "An error occurred, email schedules could not be created. Kindly check form data and try again"
          );
          setLoading(false);
          return;
        }
      }

      message.success("Email schedules updated successfully");
      handleContinue(emailConfigUID);
    } catch (error) {
      message.error("Failed to update email schedules");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (emailConfigUID) {
      // fetchEmailSchedules();
    }
  }, []);

  if (loading || isLoading) {
    return <FullScreenLoader />;
  }

  return (
    <Form form={form} layout="vertical">
      <Form.List name="schedules" initialValue={[{}]}>
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }, formIndex) => (
              <div key={key} style={{ marginBottom: 8 }}>
                {fields.length > 1 && (
                  <MinusCircleOutlined
                    onClick={() => {
                      remove(name);
                      setFormStates((prevFormStates: any) =>
                        prevFormStates.filter(
                          (_: any, index: number) => index !== formIndex
                        )
                      );
                    }}
                    style={{ float: "right" }}
                  />
                )}
                <Form.Item
                  {...restField}
                  name={[name, "emailScheduleName"]}
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
                <div style={{ display: "flex" }}>
                  <Form.Item
                    {...restField}
                    style={{
                      width: "100%",
                      marginRight: "5px",
                      maxHeight: "150px",
                    }}
                    name={[name, "dates"]}
                    label="Email Dates"
                    tooltip="Select all dates to send emails according to the schedule, multiple dates can be selected."
                    rules={[
                      { required: true, message: "Please select a date" },
                    ]}
                  >
                    <DatePicker
                      multiple={true}
                      placeholder="Select Dates"
                      format="YYYY-MM-DD"
                      minDate={dayjs()}
                      maxTagCount={15}
                    />
                  </Form.Item>
                </div>
                <div style={{ display: "flex" }}>
                  <Form.Item
                    style={{ width: "20%", marginRight: "auto" }}
                    {...restField}
                    name={[name, "emailTime"]}
                    label="Email Time"
                    tooltip="Time the email will be sent, actual email delivery time will be after 10 minutes or more since the email is queued for delivery after surveycto data refreshes."
                    rules={[
                      { required: true, message: "Please select a time" },
                    ]}
                  >
                    <TimePicker
                      placeholder="Select Time"
                      format="HH:mm"
                      minuteStep={30}
                      showNow={false}
                      needConfirm={false}
                    />
                  </Form.Item>
                  <Button
                    onClick={() => {
                      setEditingIndex(null);
                      setScheduleFilterOpen(true);
                      setCurrentFormIndex(formIndex);
                    }}
                  >
                    Add Filters for Schedule
                  </Button>
                </div>
                <EmailScheduleFilterCard
                  tableList={formStates[formIndex].tableList}
                  handleEditTable={(tableIndex: any) => {
                    setEditingIndex(tableIndex);
                    setScheduleFilterOpen(true);
                    setCurrentFormIndex(formIndex);
                  }}
                />
                {currentFormIndex !== null && (
                  <EmailScheduleFilter
                    open={insertScheduleFilterOpen}
                    setOpen={setScheduleFilterOpen}
                    configUID={emailConfigUID}
                    tableList={formStates[currentFormIndex].tableList}
                    setTableList={(value: any) => {
                      const newFormStates = [...formStates];
                      if (editingIndex !== null) {
                        newFormStates[currentFormIndex].tableList[
                          editingIndex
                        ] = value;
                      } else {
                        newFormStates[currentFormIndex].tableList.push(value);
                      }
                      setFormStates(newFormStates);
                    }}
                    editingIndex={editingIndex}
                    setEditingIndex={setEditingIndex}
                  />
                )}
              </div>
            ))}

            <Form.Item>
              <Button
                type="dashed"
                onClick={() => {
                  add();
                  addFormState();
                }}
                block
                icon={<PlusOutlined />}
              >
                Add another schedule
              </Button>
            </Form.Item>
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
            backgroundColor: "#597EF7",
            color: "white",
            float: "right",
          }}
          loading={loading}
          onClick={handleSubmit}
        >
          Continue
        </Button>
      </div>
    </Form>
  );
};

export default EmailScheduleForm;
