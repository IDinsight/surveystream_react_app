import { useState } from "react";
import { SurveyorsTable } from "./SurveyorsTab.styled";
import SurveyorStatus from "../../../components/SurveyorStatus";

function SurveyorsTab() {
  const [paginationPageSize, setPaginationPageSize] = useState<number>(5);

  const usersTableColumn = [
    {
      title: "Surveyor ID",
      dataIndex: "surveyor_id",
      key: "surveyor_id",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Mobile (primary)",
      dataIndex: "mobile",
      key: "mobile",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Surveyor GPS",
      dataIndex: "surveyor_gps",
      key: "surveyor_gps",
    },
    {
      title: "State",
      dataIndex: "state",
      key: "state",
    },
  ];

  const userTableDataSource: any = [];

  const randomFromArray = (array: string[]) => {
    return array[Math.floor(Math.random() * array.length)];
  };

  // Mock data
  for (let i = 0; i < 500; i++) {
    userTableDataSource.push({
      key: i,
      surveyor_id: `TSDPS00${i}`,
      status: (
        <SurveyorStatus
          key={i}
          status={randomFromArray(["active", "inactive", "dropout"])}
        />
      ),
      mobile: "7837283758",
      type: "Surveyor",
      surveyor_gps: "41.40338, 2.17403",
      state: "Telangana",
    });
  }

  // Row selection state and handler
  const [selectedRows, setSelectedRows] = useState<any>([]);

  const onSelectChange = (selectedRowKeys: React.Key[], selectedRows: any) => {
    const selectedEmails = selectedRows.map((row: any) => row.email);

    const selectedUserData = userTableDataSource?.filter((row: any) =>
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
      <SurveyorsTable
        rowSelection={rowSelection}
        columns={usersTableColumn}
        dataSource={userTableDataSource}
        pagination={{
          pageSize: paginationPageSize,
          pageSizeOptions: [10, 25, 50, 100],
          showSizeChanger: true,
          showQuickJumper: true,
          onShowSizeChange: (_, size) => setPaginationPageSize(size),
        }}
      />
    </>
  );
}

export default SurveyorsTab;
