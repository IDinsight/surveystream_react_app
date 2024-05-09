import FullScreenLoader from "../../../../components/Loaders/FullScreenLoader";
import Header from "../../../../components/Header";
import NavItems from "../../../../components/NavItems";
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
} from "antd";
import { useEffect, useState } from "react";
import { AssignmentsSteps } from "./CreateAssignments.styled";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { useLocation, useNavigate } from "react-router-dom";
import { buildColumnDefinition } from "../../utils";
import {
  getAssignableEnumerators,
  getTableConfig,
  updateAssignments,
  postAssignmentEmail,
} from "../../../../redux/assignments/assignmentsActions";
import { AssignmentPayload } from "../../../../redux/assignments/types";
import { ErrorBoundary } from "react-error-boundary";
import ErrorHandler from "../../../../components/ErrorHandler";
import { GlobalStyle } from "../../../../shared/Global.styled";
import { useForm } from "antd/es/form/Form";

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
  const [nextEmailDate, setNextEmailDate] = useState<string>();

  // Fetch the data from the store
  const { loading: surveyorsLoading, data: surveyorsData } = useAppSelector(
    (state) => state.assignments.assignableEnumerators
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
              surveyorsData,
              surveyorsFilter,
              surveyorsTableSpecialAttrs
            );
          }),
        };
      } else {
        return buildColumnDefinition(
          configItem.columns[0],
          surveyorsData,
          surveyorsFilter,
          surveyorsTableSpecialAttrs
        );
      }
    }
  );

  // Surveyors data source
  const surveyorsDataSource: any = [...surveyorsData];

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
            if (response.success) {
              setAssignmentResponseData(response.data);
              if (response.data?.email_schedule) {
                const now = new Date();

                //get time from response.data?.time and combine dates with time
                const datesWithTime = response.data.email_schedule?.dates?.map(
                  (date: any) => {
                    const parsedDate = new Date(date);
                    const year = parsedDate.getFullYear();
                    const month = parsedDate.getMonth() + 1;
                    const day = parsedDate.getDate();

                    const [hour, minute] =
                      response.data.email_schedule.time.split(":");

                    return new Date(year, month - 1, day, hour, minute, 0, 0);
                  }
                );

                // Find the date element just greater than now
                const nextDate = datesWithTime.find((date: any) => date > now);
                const formattedDate = `${nextDate.getFullYear()}-${(
                  nextDate.getMonth() + 1
                )
                  .toString()
                  .padStart(2, "0")}-${nextDate
                  .getDate()
                  .toString()
                  .padStart(2, "0")}`;

                setNextEmailDate(formattedDate);
              }

              message.success("Assignments updated successfully", 2, () => {
                setStepIndex((prev: number) => prev + 1);
              });
            } else {
              message.error("Error: " + response.message);
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
                  console.log("postAssignmentEmail", response);
                  if (response.success) {
                    message.success(
                      "Email schedule updated successfully.",
                      () => {
                        navigate(-1);
                      }
                    );
                  } else {
                    message.error("Error: " + response.message);
                  }
                },
              })
            );
            setStepLoading(false);
          });
        } catch (error) {
          console.error("Validation failed:", error);
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

  useEffect(() => {
    const finalObjects: any = [];
    const requestPayload: any = [];
    if (selectedAssignmentRows?.length > 0 && selectedSurveyorRows.length > 0) {
      let sIndex = 0;
      selectedAssignmentRows.forEach((item: any, index: number) => {
        if (!selectedSurveyorRows[sIndex]) {
          sIndex = 0;
        }
        const mIndex = selectedSurveyorRows.length > index ? index : sIndex;

        if (selectedSurveyorRows && selectedSurveyorRows[mIndex]) {
          const assignedObjects = {
            ...item,
            assigned_enumerator_name: selectedSurveyorRows[mIndex].name,
            prev_assigned_to: item.assigned_enumerator_name,
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
      dispatch(getTableConfig({ formUID: formID }));
    }

    if (surveyorsData.length === 0) {
      dispatch(getAssignableEnumerators({ formUID: formID }));
    }
  }, []);

  if (surveyorsLoading || tableConfigLoading) {
    return <FullScreenLoader />;
  }

  return (
    <>
      <GlobalStyle />
      <Header items={NavItems} />
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
                rowKey={(record) => record.email}
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
                rowKey={(record) => record.target_uid}
                columns={reviewAssignmentTableColumn}
                dataSource={targetAssignments}
                pagination={false}
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
                      fontSize: "16px",
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
                  {assignmentResponseData?.email_schedule ? (
                    <>
                      <p
                        style={{
                          color: "#434343",
                          fontFamily: "Lato",
                          fontSize: "16px",
                          lineHeight: "24px",
                          marginTop: 30,
                        }}
                      >
                        The emails are scheduled to be sent on {nextEmailDate}{" "}
                        at {assignmentResponseData.email_schedule?.time}. Do you
                        want to send the emails to the surveyors whose
                        assignments have been changed before that? Please note
                        that the emails will be sent only to the surveyors whose
                        assignments have changed. If you want to change the
                        existing email schedule, please visit the email
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
                  ) : (
                    <>
                      <p
                        style={{
                          color: "#434343",
                          fontFamily: "Lato",
                          fontSize: "16px",
                          lineHeight: "24px",
                          marginTop: 30,
                        }}
                      >
                        The emails for this survey have not been scheduled yet.
                        Do you wish to send emails to the surveyors whose
                        assignments have been changed? Please be aware that the
                        emails will only be sent to those surveyors whose
                        assignments have changed. If you would like to setup
                        email schedules, please visit the email configuration
                        module.
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
                  )}

                  {emailMode === "email_time_yes" ? (
                    <>
                      <p
                        style={{
                          color: "#434343",
                          fontFamily: "Lato",
                          lineHeight: "24px",
                        }}
                      >
                        Please select the date and time when you want the emails
                        with assignment information to be sent to the surveyors:
                      </p>
                      <div style={{ marginBottom: 30 }}>
                        <Form
                          form={manualTriggerForm}
                          style={{ display: "flex" }}
                        >
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
                      </div>
                    </>
                  ) : null}
                </>
              )}
            </>
          ) : null}

          <div>
            <Button
              type="primary"
              style={{
                backgroundColor: "#597EF7",
                color: "white",
                marginRight: 10,
              }}
              loading={stepLoading}
              disabled={stepIndex === 0 && !hasSurveyorSelected}
              onClick={handleContinue}
            >
              {stepIndex !== 2 ? "Continue" : "Done"}
            </Button>
            <Button onClick={handleDismiss}>Dismiss</Button>
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
