import { useState } from "react";
import { TargetsTable } from "./TargetsTab.styled";

function TargetsTab() {
  const [paginationPageSize, setPaginationPageSize] = useState<number>(5);

  const usersTableColumn = [
    {
      title: "Target ID",
      dataIndex: "target_id",
      key: "target_id",
    },
    {
      title: "Target Address",
      dataIndex: "target_address",
      key: "target_address",
    },
    {
      title: "District",
      dataIndex: "district",
      key: "district",
    },
    {
      title: "Target type",
      dataIndex: "target_type",
      key: "target_type",
    },
    {
      title: "GPS",
      dataIndex: "gps",
      key: "gps",
    },
    {
      title: "State",
      dataIndex: "state",
      key: "state",
    },
    {
      title: "Block",
      dataIndex: "block",
      key: "block",
    },
  ];

  const userTableDataSource: any = [];

  // Mock data
  for (let i = 0; i < 500; i++) {
    userTableDataSource.push({
      key: i,
      target_id: `TKPIHH00${i}`,
      target_address: "12, 1st Block, Bela",
      district: "Adilabad",
      target_type: "Primary",
      gps: "41.40338, 2.17403",
      state: "Telangana",
      block: "Bela",
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
      <TargetsTable
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

export default TargetsTab;
