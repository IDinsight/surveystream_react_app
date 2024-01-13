import { useState } from "react";
import { AssignmentsTable } from "./AssignmentsTab.styled";

function AssignmentsTab() {
  const [paginationPageSize, setPaginationPageSize] = useState<number>(5);

  const usersTableColumn = [
    {
      title: "Surveyor ID",
      dataIndex: "surveyor_id",
      key: "surveyor_id",
    },
    {
      title: "Surveyor Address",
      dataIndex: "surveyor_address",
      key: "surveyor_address",
    },
    {
      title: "Mobile (primary)",
      dataIndex: "mobile",
      key: "mobile",
    },
    {
      title: "Target type",
      dataIndex: "target_type",
      key: "target_type",
    },
    {
      title: "Target GPS",
      dataIndex: "target_gps",
      key: "target_gps",
    },
    {
      title: "State",
      dataIndex: "state",
      key: "state",
    },
  ];

  const userTableDataSource: any = [];

  // Mock data
  for (let i = 0; i < 500; i++) {
    userTableDataSource.push({
      key: i,
      surveyor_id: `TSDPS00${i}`,
      surveyor_address: "12, 1st Block, Adilabad",
      mobile: "7837283758",
      target_type: "Primary",
      target_gps: "41.40338, 2.17403",
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
      <AssignmentsTable
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

export default AssignmentsTab;
