import FullScreenLoader from "../../../../components/Loaders/FullScreenLoader";
import Header from "../../../../components/Header";
import NavItems from "../../../../components/NavItems";
import { PushpinOutlined } from "@ant-design/icons";
import { Button, Table, Tag, message } from "antd";
import { useEffect, useState } from "react";
import { AssignmentsSteps } from "./CreateAssignments.styled";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { buildColumnDefinition } from "../../utils";
import {
  getAssignableEnumerators,
  getTableConfig,
  updateAssignments,
} from "../../../../redux/assignments/assignmentsActions";
import { AssignmentPayload } from "../../../../redux/assignments/types";
import { ErrorBoundary } from "react-error-boundary";
import ErrorHandler from "../../../../components/ErrorHandler";
import { GlobalStyle } from "../../../../shared/Global.styled";

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
  const [paginationPageSize, setPaginationPageSize] = useState<number>(5);
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [selectedSurveyorRows, setSelectedSurveyorRows] = useState<any>([]);
  const [targetAssignments, setTargetAssignments] = useState<any[]>([]);
  const [assignmentPayload, setAssignmentPayload] = useState<
    AssignmentPayload[]
  >([]);
  const [surveyorsFilter, setSurveyorsFilter] = useState(null);

  // Fetch the data from the store
  const { loading: surveyorsLoading, data: surveyorsData } = useAppSelector(
    (state) => state.assignments.assignableEnumerators
  );

  const { loading: tableConfigLoading, data: tableConfig } = useAppSelector(
    (state) => state.assignments.tableConfig
  );

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

  const handleContinue = (): void => {
    // Ensure that the stepIndex is less than 1
    if (stepIndex < 1) {
      setStepIndex((prev: number) => {
        return prev + 1;
      });
      return;
    }

    if (stepIndex === 1) {
      if (assignmentPayload.length === 0) {
        message.error("No assginment payload to make the assignments");
        return;
      }

      // Update the assignments
      dispatch(
        updateAssignments({
          formUID: formID,
          formData: assignmentPayload,
          callFn: (data: any) => {
            // Check if the update was successful
            if (data.success) {
              message.success("Assignments updated successfully", 2, () => {
                navigate(-1);
              });
            } else {
              message.error("Error: " + data.message);
            }
          },
        })
      );
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

  // const [emailMode, setEmailMode] = useState<string | null>(null);

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
              // {
              //   title: "Schedule emails",
              // },
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
          {/* {stepIndex === 2 ? (
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
                  <p>2</p>
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
                  <p>2</p>
                </div>
              </div>
              <p
                style={{
                  color: "#434343",
              fontFamily: "Lato",
                  fontSize: "16px",
                  lineHeight: "24px",
                  marginTop: 30,
                }}
              >
                The emails are scheduled to be sent on 20/11/2023 at 17:30 IST.
                Do you want to send the emails to the surveyors before that?
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
                    <DatePicker size="middle" style={{ width: 300 }} />
                    <TimePicker
                      size="middle"
                      style={{ width: 300, marginLeft: 60 }}
                    />
                  </div>
                </>
              ) : null}
            </>
          ) : null} */}
          <div>
            <Button
              type="primary"
              style={{
                backgroundColor: "#597EF7",
                color: "white",
                marginRight: 10,
              }}
              disabled={stepIndex === 0 && !hasSurveyorSelected}
              onClick={handleContinue}
            >
              {stepIndex !== 1 ? "Continue" : "Done"}
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
