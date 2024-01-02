import FullScreenLoader from "../../../components/Loaders/FullScreenLoader";
import Header from "../../../components/Header";
import NavItems from "../../../components/NavItems";
import { PushpinOutlined } from "@ant-design/icons";
import { Button, DatePicker, Radio, Steps, Table, TimePicker } from "antd";
import { useState } from "react";
import SurveyStatus from "../../../components/SurveyStatus";

function CreateAssignments() {
  const isLoading = false;

  const [paginationPageSize, setPaginationPageSize] = useState<number>(5);
  const [stepIndex, setStepIndex] = useState<number>(0);

  const assignmentTableColumn = [
    {
      title: "Surveyor Name",
      dataIndex: "surveyor_name",
      key: "surveyor_name",
    },
    {
      title: "District",
      dataIndex: "district",
      key: "district",
    },
    {
      title: "State",
      dataIndex: "state",
      key: "state",
    },
    {
      title: "Productivity",
      dataIndex: "productivity",
      key: "productivity",
    },
    {
      title: "Assigned",
      dataIndex: "assigned",
      key: "assigned",
    },
    {
      title: "Complete",
      dataIndex: "complete",
      key: "complete",
    },
  ];

  const assginmentTableDataSource: any = [];

  // Mock data
  for (let i = 0; i < 500; i++) {
    assginmentTableDataSource.push({
      key: i,
      surveyor_name: "Deshmukh Vilas",
      district: "Adilabad",
      state: "Telangana",
      productivity: 4,
      assigned: 35,
      complete: 90,
    });
  }

  // Row selection state and handler
  const [selectedRows, setSelectedRows] = useState<any>([]);

  const onSelectChange = (selectedRowKeys: React.Key[], selectedRows: any) => {
    const selectedEmails = selectedRows.map((row: any) => row.email);

    const selectedUserData = assginmentTableDataSource?.filter((row: any) =>
      selectedEmails.includes(row.email)
    );

    setSelectedRows(selectedUserData);
  };

  const rowSelection = {
    selectedRows,
    onChange: onSelectChange,
  };
  const hasSelected = selectedRows.length > 0;

  // Review assignments (step 1) table
  const reviewAssignmentTableColumn = [
    {
      title: "Assigned To",
      dataIndex: "assigned",
      key: "assigned",
    },
    {
      title: "Previously assigned to",
      dataIndex: "previously_assigned",
      key: "previously_assigned",
    },
    {
      title: "Surveyor ID",
      dataIndex: "surveyor_id",
      key: "surveyor_id",
    },
    {
      title: "Location (Block)",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "HH type",
      dataIndex: "hh_type",
      key: "hh_type",
    },
    {
      title: "Survey Status",
      dataIndex: "survey_status",
      key: "survey_status",
    },
  ];

  const reviewAssginmentTableDataSource: any = [];

  // Mock data
  for (let i = 0; i < 4; i++) {
    reviewAssginmentTableDataSource.push({
      key: i,
      assigned: "Deshmukh Vilas",
      previously_assigned: "Akash Kumar",
      surveyor_id: "TSDPS00001",
      location: "Katihar",
      hh_type: "Primary",
      survey_status: (
        <SurveyStatus
          status={
            ["not_attempted", "appointment", "half_complete", "revisit"][i]
          }
        />
      ),
    });
  }

  const [emailMode, setEmailMode] = useState<string | null>(null);

  return (
    <>
      <Header items={NavItems} />
      {isLoading ? (
        <FullScreenLoader />
      ) : (
        <>
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
                  fontFamily: "Inter",
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
              <Steps
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
                      fontFamily: "Inter",
                      fontSize: "14px",
                      lineHeight: "22px",
                    }}
                  >
                    Select surveyors to assign/re-assign the targets
                  </p>
                  <Table
                    rowSelection={rowSelection}
                    columns={assignmentTableColumn}
                    dataSource={assginmentTableDataSource}
                    pagination={{
                      pageSize: paginationPageSize,
                      pageSizeOptions: [10, 25, 50, 100],
                      showSizeChanger: true,
                      showQuickJumper: true,
                      onShowSizeChange: (_, size) =>
                        setPaginationPageSize(size),
                    }}
                  />
                </>
              ) : null}
              {stepIndex === 1 ? (
                <>
                  <p
                    style={{
                      color: "#434343",
                      fontFamily: "Inter",
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
                      fontFamily: "Inter",
                      fontSize: "14px",
                      lineHeight: "22px",
                      marginTop: 0,
                    }}
                  >
                    Assignments have been assigned randomly to the selected
                    surveyors.
                  </p>
                  <Table
                    columns={reviewAssignmentTableColumn}
                    dataSource={reviewAssginmentTableDataSource}
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
                      fontFamily: "Inter",
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
                          fontFamily: "Inter",
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
                          fontFamily: "Inter",
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
                      fontFamily: "Inter",
                      fontSize: "16px",
                      lineHeight: "24px",
                      marginTop: 30,
                    }}
                  >
                    The emails are scheduled to be sent on 20/11/2023 at 17:30
                    IST. Do you want to send the emails to the surveyors before
                    that?
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
                          fontFamily: "Inter",
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
              ) : null}
              <div>
                <Button
                  type="primary"
                  style={{
                    backgroundColor: "#597EF7",
                    color: "white",
                    marginRight: 10,
                  }}
                  onClick={() =>
                    setStepIndex((prev) => {
                      return prev + 1;
                    })
                  }
                >
                  {stepIndex !== 2 ? "Continue" : "Done"}
                </Button>
                <Button>Dismiss</Button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default CreateAssignments;
