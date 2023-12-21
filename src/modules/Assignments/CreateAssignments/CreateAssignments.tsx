import FullScreenLoader from "../../../components/Loaders/FullScreenLoader";
import Header from "../../../components/Header";
import NavItems from "../../../components/NavItems";
import { PushpinOutlined } from "@ant-design/icons";
import { Button, Steps, Table } from "antd";
import { useState } from "react";

function CreateAssignments() {
  const isLoading = false;

  const [paginationPageSize, setPaginationPageSize] = useState<number>(5);

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
                current={0}
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
                  onShowSizeChange: (_, size) => setPaginationPageSize(size),
                }}
              />
              <div>
                <Button
                  type="primary"
                  style={{
                    backgroundColor: "#597EF7",
                    color: "white",
                    marginRight: 10,
                  }}
                >
                  Continue
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
