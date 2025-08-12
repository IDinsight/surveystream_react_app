import FullScreenLoader from "../../../../components/Loaders/FullScreenLoader";

import { PushpinOutlined } from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Table,
  Tag,
  TimePicker,
  message,
  Radio,
  Form,
  Alert,
  Select,
} from "antd";
import { WarningOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { AssignmentsSteps, FormItemLabel } from "./CreateAssignments.styled";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { useLocation, useNavigate } from "react-router-dom";
import { buildColumnDefinition } from "../../utils";
import {
  getAssignmentEnumerators,
  getTableConfig,
  updateAssignments,
  postAssignmentEmail,
} from "../../../../redux/assignments/assignmentsActions";
import { AssignmentPayload } from "../../../../redux/assignments/types";
import { ErrorBoundary } from "react-error-boundary";
import ErrorHandler from "../../../../components/ErrorHandler";
import { GlobalStyle } from "../../../../shared/Global.styled";
import { useForm } from "antd/es/form/Form";
import {
  fetchSurveyorsMapping,
  fetchTargetsMapping,
} from "../../../../redux/mapping/apiService";
import dayjs from "dayjs";

const { Option } = Select;

function CreateAssignments() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Get the formID and selectedAssignmentRows from the location state
  const {
    selectedAssignmentRows,
    formID,
  }: {
    selectedAssignmentRows: any;
    formID: string;
  } = location.state;

  // Ensure that the formID and selectedAssignmentRows are available
  if (!formID || !selectedAssignmentRows) {
    navigate(-1);
  }

  // State variables for component
  const [paginationPageSize, setPaginationPageSize] = useState<number>(25);
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [selectedSurveyorRows, setSelectedSurveyorRows] = useState<any>([]);
  const [targetAssignments, setTargetAssignments] = useState<any[]>([]);
  const [assignmentPayload, setAssignmentPayload] = useState<
    AssignmentPayload[]
  >([]);
  const [surveyorsFilter, setSurveyorsFilter] = useState(null);
  const [assignmentResponseData, setAssignmentResponseData] = useState<any>();

  const [pendingEmailExists, setPendingEmailExists] = useState<boolean>(false);
  const [surveyorMapping, setSurveyorMapping] = useState<any[]>([]);
  const [targetMapping, setTargetMapping] = useState<any[]>([]);
  const [surveyorMappingLoading, setSurveyorMappingLoading] =
    useState<boolean>(false);
  const [targetMappingLoading, setTargetMappingLoading] =
    useState<boolean>(false);
  const [showWarnings, setShowWarnings] = useState<boolean>(false);

  // Fetch the data from the store
  const { loading: surveyorsLoading, data: surveyorsData } = useAppSelector(
    (state) => state.assignments.assignmentEnumerators
  );

  const { loading: tableConfigLoading, data: tableConfig } = useAppSelector(
    (state) => state.assignments.tableConfig
  );

  const [manualTriggerData, setManualTriggerData] = useState({
    date: null,
    time: null,
  });
  const [manualTriggerForm] = useForm();
  const [emailMode, setEmailMode] = useState<string | null>(null);
  const [stepLoading, setStepLoading] = useState<boolean>(false);
  const [assignableSurveyors, setAssignableSurveyors] = useState<any[]>([]);
  const [assignableSurveyorsLoading, setAssignableSurveyorsLoading] =
    useState<boolean>(false);

  // Surveyors (step 0) table
  const surveyorsTableSpecialAttrs: any = {
    last_attempt_survey_status_label: {
      render(value: string, record: any) {
        const color = record.webapp_tag_color || "gold";
        return (
          <Tag color={color} key={value}>
            {value}
          </Tag>
        );
      },
    },
  };
  const surveyorsTableColumns = tableConfig?.assignments_surveyors?.map(
    (configItem: any, i: any) => {
      if (configItem.group_label) {
        return {
          title: configItem.group_label,
          children: configItem.columns.map((groupItem: any, i: any) => {
            return buildColumnDefinition(
              groupItem,
              assignableSurveyors,
              surveyorsFilter,
              surveyorsTableSpecialAttrs
            );
          }),
        };
      } else {
        return buildColumnDefinition(
          configItem.columns[0],
          assignableSurveyors,
          surveyorsFilter,
          surveyorsTableSpecialAttrs
        );
      }
    }
  );

  // Surveyors data source
  const surveyorsDataSource: any = [...assignableSurveyors];

  // Row selection state and handler
  const onSelectOne = (record: any, selected: boolean, selectedRows: any) => {
    if (selectedRows.length > selectedAssignmentRows?.length) {
      message.warning(
        "You can't select more surveyors than the number of targets selected"
      );
      return;
    } else {
      const selectedSurveyorUUID = selectedRows.map(
        (row: any) => row.enumerator_uid
      );

      const selectedSurveyor = surveyorsDataSource?.filter((row: any) =>
        selectedSurveyorUUID.includes(row.enumerator_uid)
      );

      setSelectedSurveyorRows(selectedSurveyor);
    }
  };

  const onSelectAll = (selected: boolean, selectedRows: any) => {
    if (selectedRows.length > selectedAssignmentRows?.length) {
      message.error(
        "You can't select more surveyors than the number of targets selected"
      );
      return;
    } else {
      const selectedSurveyorUUID = selectedRows.map(
        (row: any) => row.enumerator_uid
      );

      const selectedSurveyor = surveyorsDataSource?.filter((row: any) =>
        selectedSurveyorUUID.includes(row.enumerator_uid)
      );

      setSelectedSurveyorRows(selectedSurveyor);
    }
  };

  const rowSelection = {
    selectedSurveyorRows,
    onSelect: onSelectOne,
    onSelectAll: onSelectAll,
  };
  const hasSurveyorSelected = selectedSurveyorRows.length > 0;

  // Review assignments (step 1) table
  const reviewTableSpecialAttrs: any = {
    last_attempt_survey_status_label: {
      render(value: any, record: any) {
        const color = record.webapp_tag_color || "gold";
        return (
          <Tag color={color} key={value}>
            {value}
          </Tag>
        );
      },
    },
  };

  const reviewAssignmentTableColumn = tableConfig?.assignments_review?.map(
    (configItem: any, i: any) => {
      if (configItem.group_label) {
        return {
          title: configItem.group_label,
          children: configItem.columns.map((groupItem: any, i: any) => {
            return buildColumnDefinition(
              groupItem,
              targetAssignments,
              null,
              reviewTableSpecialAttrs
            );
          }),
        };
      } else {
        return buildColumnDefinition(
          configItem.columns[0],
          targetAssignments,
          null,
          reviewTableSpecialAttrs
        );
      }
    }
  );

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

  const handleContinue = async () => {
    setStepLoading(true);
    if (stepIndex < 1) {
      setStepIndex((prev: number) => prev + 1);

      setStepLoading(false);
    } else if (stepIndex === 1) {
      if (assignmentPayload.length === 0) {
        message.error("No assignment payload to make the assignments");
        setStepLoading(false);

        return;
      }

      await dispatch(
        updateAssignments({
          formUID: formID,
          formData: assignmentPayload,
          callFn: (response: any) => {
            // Handle empty/error response case
            if (!response || (!response.success && !response.data)) {
              message.error("Error updating assignments. Please try again.");
              return;
            }

            // Success case
            if (response.success || response.message === "success") {
              // Process email schedule data if it exists
              if (response.data?.email_schedule) {
                response.data.email_schedule = response.data.email_schedule.map(
                  (email: any) => {
                    if (!email.schedule_date || !email.time) {
                      return {
                        ...email,
                        schedule_time: "No pending schedules",
                      };
                    }

                    const parsedDate = new Date(email.schedule_date);
                    const [hour, minute] = email.time.split(":");
                    const nextDate = new Date(
                      parsedDate.getFullYear(),
                      parsedDate.getMonth(),
                      parsedDate.getDate(),
                      parseInt(hour),
                      parseInt(minute)
                    );

                    return {
                      ...email,
                      schedule_time: nextDate.toISOString().split("T")[0],
                    };
                  }
                );
              }

              setAssignmentResponseData(response.data);

              // Check for pending emails
              if (response.data?.email_schedule?.length > 0) {
                const hasPendingEmails = response.data.email_schedule.some(
                  (email: any) => email.schedule_time !== "No pending schedules"
                );
                setPendingEmailExists(hasPendingEmails);
              }

              message.success("Assignments updated successfully", 2, () => {
                setStepIndex((prev: number) => prev + 1);
              });
            } else {
              message.error(
                `Error: ${response.message || "Unknown error occurred"}`
              );
            }
          },
        })
      );

      setStepLoading(false);
    } else if (stepIndex === 2) {
      if (!emailMode || emailMode == "email_time_no") {
        navigate(-1);
        setStepLoading(false);

        return;
      } else {
        try {
          await manualTriggerForm.validateFields();
          manualTriggerForm.validateFields().then(async (formValues) => {
            const manualTriggerPayload = {
              form_uid: formID,
              status: "queued",
              email_config_uid: formValues.email_config_uid,
              date: formValues.date.format("YYYY-MM-DD"),
              time: formValues.time.format("HH:mm"),
              recipients: assignmentPayload.map(
                (payload) => payload.enumerator_uid
              ),
            };

            await dispatch(
              postAssignmentEmail({
                formData: manualTriggerPayload,
                callFn: (response: any) => {
                  if (response.success) {
                    message.success("Email schedule saved successfully", () => {
                      navigate(-1);
                    });
                  } else {
                    message.error("Error: " + response.message);
                  }
                },
              })
            );
            setStepLoading(false);
          });
        } catch (error) {
          message.error(
            "Validation failed. Please ensure all email trigger fields are properly set."
          );
          setStepLoading(false);
        }
      }
    }
  };

  const handleDismiss = (): void => {
    navigate(-1);
  };

  const onSurveyorTableChange = (
    _pagination: any,
    filters: any,
    _sorter: any
  ) => {
    setSurveyorsFilter(filters);
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

  useEffect(() => {
    const finalObjects: any = [];
    const requestPayload: any = [];
    setShowWarnings(false);
    if (selectedAssignmentRows?.length > 0 && selectedSurveyorRows.length > 0) {
      let sIndex = 0;
      let hasShowedWarning = false;

      selectedAssignmentRows.forEach((item: any, index: number) => {
        if (!selectedSurveyorRows[sIndex]) {
          sIndex = 0;
        }
        const mIndex = selectedSurveyorRows.length > index ? index : sIndex;

        if (selectedSurveyorRows && selectedSurveyorRows[mIndex]) {
          // Check if mapping rules are followed
          const surveyorSupervisorMapping = surveyorMapping.find(
            (mapping) =>
              mapping.enumerator_uid ===
              selectedSurveyorRows[mIndex].enumerator_uid
          );
          const targetSupervisorMapping = targetMapping.find(
            (mapping) => mapping.target_uid === item.target_uid
          );

          let warning = "";
          if (
            surveyorSupervisorMapping?.supervisor_uid === null ||
            targetSupervisorMapping?.supervisor_uid === null ||
            surveyorSupervisorMapping?.supervisor_uid !==
              targetSupervisorMapping?.supervisor_uid
          ) {
            warning =
              "Selected surveyors/targets are either not mapped or are not mapped to the same supervisor";

            if (!hasShowedWarning) {
              message.warning(warning);
              hasShowedWarning = true;
            }
            setShowWarnings(true);
          }

          const assignedObjects = {
            ...item,
            assigned_enumerator_name: selectedSurveyorRows[mIndex].name,
            prev_assigned_to: item.assigned_enumerator_name,
            warning: warning,
          };
          const reqObj = {
            target_uid: item.target_uid,
            enumerator_uid: selectedSurveyorRows[mIndex].enumerator_uid,
          };
          requestPayload.push(reqObj);
          finalObjects.push(assignedObjects);
        }
        sIndex = sIndex + 1;
      });
    }

    setTargetAssignments(finalObjects);
    setAssignmentPayload(requestPayload);
  }, [selectedSurveyorRows]);

  useEffect(() => {
    if (Object.keys(tableConfig).length === 0) {
      dispatch(getTableConfig({ formUID: formID, filter_supervisors: true }));
    }

    if (surveyorsData.length === 0) {
      dispatch(getAssignmentEnumerators({ formUID: formID }));
    }
  }, []);

  useEffect(() => {
    setSurveyorMappingLoading(true);
    setTargetMappingLoading(true);

    fetchSurveyorsMapping(formID).then((res: any) => {
      if (res?.data?.success) {
        setSurveyorMapping(res?.data?.data);
      } else {
        message.error("Failed to fetch surveyor mapping");
      }
      setSurveyorMappingLoading(false);
    });

    fetchTargetsMapping(formID).then((res: any) => {
      if (res?.data?.success) {
        setTargetMapping(res?.data?.data);
      } else {
        message.error("Failed to fetch surveyor mapping");
      }
      setTargetMappingLoading(false);
    });
  }, [formID]);

  useEffect(() => {
    setAssignableSurveyorsLoading(true);
    if (surveyorsData.length > 0) {
      const surveyors = surveyorsData.filter((surveyor: any) => {
        // Filter out surveyors with status in ["Active", "Temp. Inactive"]
        return (
          surveyor.surveyor_status == "Active" ||
          surveyor.surveyor_status == "Temp. Inactive"
        );
      });
      setAssignableSurveyors(surveyors);
    }
    setAssignableSurveyorsLoading(false);
  }, [surveyorsData]);

  if (
    surveyorsLoading ||
    tableConfigLoading ||
    assignableSurveyorsLoading ||
    surveyorMappingLoading ||
    targetMappingLoading
  ) {
    return <FullScreenLoader />;
  }

  return (
    <>
      <GlobalStyle />

      <div>
        <div
          style={{
            height: "55px",
            paddingLeft: "48px",
            paddingRight: "48px",
            display: "flex",
            alignItems: "center",
            borderTop: "1px solid #00000026",
            borderBottom: "1px solid #00000026",
          }}
        >
          <PushpinOutlined
            style={{ fontSize: 24, marginRight: 5, color: "#BFBFBF" }}
          />
          <p
            style={{
              color: "#262626",
              fontFamily: "Lato",
              fontSize: "20px",
              fontWeight: 500,
              lineHeight: "28px",
            }}
          >
            Create assignments
          </p>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            paddingLeft: 28,
            backgroundColor: "#F5F5F5",
            height: 50,
          }}
        >
          <AssignmentsSteps
            style={{
              width: 700,
            }}
            current={stepIndex}
            items={[
              {
                title: "Select surveyors",
              },
              {
                title: "Review assignments",
              },
              {
                title: "Schedule emails",
              },
            ]}
          />
        </div>
        <br />
        <div
          style={{
            height: "calc(100vh - 190px)",
            paddingLeft: 48,
            paddingRight: 48,
          }}
        >
          {stepIndex === 0 ? (
            <>
              <p
                style={{
                  color: "#8C8C8C",
                  fontFamily: "Lato",
                  fontSize: "14px",
                  lineHeight: "22px",
                }}
              >
                Select surveyors to assign/re-assign the targets
              </p>
              <Table
                rowKey={(record: any) => record["enumerator_uid"]}
                rowSelection={rowSelection}
                columns={surveyorsTableColumns}
                dataSource={surveyorsDataSource}
                onChange={onSurveyorTableChange}
                scroll={{ x: 2000 }}
                pagination={{
                  pageSize: paginationPageSize,
                  pageSizeOptions: [10, 25, 50, 100],
                  showSizeChanger: true,
                  showQuickJumper: true,
                  onShowSizeChange: (_, size) => setPaginationPageSize(size),
                }}
              />
            </>
          ) : null}
          {stepIndex === 1 ? (
            <>
              <p
                style={{
                  color: "#434343",
                  fontFamily: "Lato",
                  lineHeight: "24px",
                  fontWeight: 500,
                  marginBottom: 0,
                }}
              >
                Review assignments to surveyors
              </p>
              <p
                style={{
                  color: "#8C8C8C",
                  fontFamily: "Lato",
                  fontSize: "14px",
                  lineHeight: "22px",
                  marginTop: 0,
                }}
              >
                Assignments have been assigned randomly to the selected
                surveyors.
              </p>
              <Table
                rowKey={(record: any) => record.target_uid}
                columns={
                  // Add column for warnings if present
                  showWarnings
                    ? reviewAssignmentTableColumn.concat({
                        title: (
                          <div>
                            <span style={{ marginRight: "10px" }}>
                              Warnings
                            </span>
                            <WarningOutlined
                              style={{
                                color: "#FAAD14",
                                display: "inline-block",
                              }}
                            />
                          </div>
                        ),
                        dataIndex: "warning",
                        key: "warning",
                        width: 200,
                        render: (text: any) => {
                          return <p>{text}</p>;
                        },
                      })
                    : reviewAssignmentTableColumn
                }
                dataSource={targetAssignments}
                pagination={{
                  pageSize: paginationPageSize,
                  pageSizeOptions: [10, 25, 50, 100],
                  showSizeChanger: true,
                  showQuickJumper: true,
                  onShowSizeChange: (_, size) => setPaginationPageSize(size),
                }}
                style={{ marginBottom: 20 }}
              />
            </>
          ) : null}
          {stepIndex === 2 ? (
            <>
              <p
                style={{
                  color: "#434343",
                  fontFamily: "Lato",
                  lineHeight: "24px",
                  fontWeight: 500,
                  marginBottom: 0,
                }}
              >
                Summary of assignments to surveyors:
              </p>
              <div style={{ display: "flex" }}>
                <div>
                  <p
                    style={{
                      color: "#434343",
                      fontFamily: "Lato",
                      fontSize: "16px",
                      lineHeight: "24px",
                    }}
                  >
                    New assignments
                  </p>
                  <p>{assignmentResponseData?.new_assignments_count}</p>
                </div>
                <div style={{ marginLeft: 80 }}>
                  <p
                    style={{
                      color: "#434343",
                      fontFamily: "Lato",
                      fontSize: "16px",
                      lineHeight: "24px",
                    }}
                  >
                    Reassignments
                  </p>
                  <p>{assignmentResponseData?.re_assignments_count}</p>
                </div>
                <div style={{ marginLeft: 80 }}>
                  <p
                    style={{
                      color: "#434343",
                      fontFamily: "Lato",
                      fontSize: "16px",
                      lineHeight: "24px",
                    }}
                  >
                    Total Assignments
                  </p>
                  <p>{assignmentResponseData?.assignments_count}</p>
                </div>
              </div>
              {assignmentResponseData?.assignments_count ===
              assignmentResponseData?.no_changes_count ? (
                // no changes effected
                <>
                  <Alert
                    closable={false}
                    style={{
                      color: "#434343",
                      fontFamily: "Lato",
                      fontSize: "14px",
                      lineHeight: "24px",
                      margin: "10px",
                      marginBottom: "20px",
                    }}
                    message="No changes to assignments"
                    description="No adjustments have been made to the assignments. It's likely that the surveyors were assigned to 
                    the same targets as before. To make changes, please go through the assignments flow again."
                    type="warning"
                    showIcon
                  />
                </>
              ) : (
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
                        The next assignment emails for this form are scheduled
                        to be sent at:
                      </p>
                      {assignmentResponseData?.email_schedule.map(
                        (email: any, index: any) => (
                          <li
                            key={index}
                            style={{
                              fontFamily: "Lato",
                              fontSize: "14px",
                            }}
                          >
                            Email configuration: <b>{email.config_name}</b>,
                            Date: <b>{email.schedule_time}</b>, Time:{" "}
                            <b>{email.time}</b>
                          </li>
                        )
                      )}
                      <p
                        style={{
                          color: "#434343",
                          fontFamily: "Lato",
                          fontSize: "14px",
                          lineHeight: "24px",
                          marginTop: 30,
                        }}
                      >
                        Do you want to send emails to the surveyors whose
                        assignments have been changed before the given schedule?
                        Note that the emails set up using this option will be
                        sent only to the surveyors whose assignments have
                        changed. If you want to change the existing email
                        schedule for all surveyors, kindly visit the email
                        configuration module.
                      </p>
                      <Radio.Group
                        onChange={(e) => setEmailMode(e.target.value)}
                        value={emailMode}
                        style={{ marginBottom: 20 }}
                      >
                        <Radio value="email_time_yes">
                          Yes, I want to change the time
                        </Radio>
                        <Radio value="email_time_no">
                          No, I would like to retain the existing time
                        </Radio>
                      </Radio.Group>
                    </>
                  ) : assignmentResponseData?.email_schedule ? (
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
                        There are <b> no pending assignment emails </b>{" "}
                        scheduled for this form. Do you wish to send emails to
                        the surveyors whose assignments have been changed? Note
                        that the emails scheduled using this option will be sent
                        only to the surveyors whose assignments have changed. If
                        you want to change the existing email schedule for all
                        surveyors, kindly visit the email configuration module.
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
                        Assignment emails for this form have not been configured
                        yet. If you would like to send emails with assignment
                        information to the surveyors, kindly visit the emails
                        module and set up an email configuration for this form.
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
                          lineHeight: "24px",
                        }}
                      >
                        Please select the date and time when you want the emails
                        with assignment information to be sent to the surveyors:
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
                                message:
                                  "Please select an email configuration!",
                              },
                            ]}
                            tooltip="This select is enabled when there are more than one email configurations using the assignments table."
                            initialValue={
                              assignmentResponseData?.email_schedule.length ===
                              1
                                ? assignmentResponseData?.email_schedule[0]
                                    .email_config_uid
                                : null
                            }
                          >
                            <Select
                              style={{ width: 250 }}
                              placeholder="Select an email configuration"
                              disabled={
                                assignmentResponseData?.email_schedule.length >
                                1
                                  ? false
                                  : true
                              }
                            >
                              {assignmentResponseData?.email_schedule?.map(
                                (
                                  email: {
                                    email_config_uid: any;
                                    config_name: any;
                                  },
                                  index: any
                                ) => (
                                  <Option
                                    key={index}
                                    value={email.email_config_uid}
                                  >
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
                              format="YYYY-MM-DD"
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
                </>
              )}
            </>
          ) : null}

          <div>
            {stepIndex === 2 &&
            assignmentResponseData?.assignments_count ===
              assignmentResponseData?.no_changes_count ? null : (
              <Button onClick={handleDismiss}>Cancel</Button>
            )}
            <Button
              type="primary"
              style={{
                backgroundColor: "#597EF7",
                color: "white",
                marginLeft: 20,
                marginBottom: 20,
              }}
              loading={stepLoading}
              disabled={stepIndex === 0 && !hasSurveyorSelected}
              onClick={handleContinue}
            >
              {stepIndex !== 2 ? "Continue" : "Done"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

function CreateAssignmentsWithErrorBoundary() {
  return (
    <ErrorBoundary FallbackComponent={ErrorHandler}>
      <CreateAssignments />
    </ErrorBoundary>
  );
}

export default CreateAssignmentsWithErrorBoundary;
