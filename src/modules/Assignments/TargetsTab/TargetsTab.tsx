import { useState } from "react";
import { TargetsTable } from "./TargetsTab.styled";
import { buildColumnDefinition } from "../utils";
import { ITargetsTabProps } from "../types";

function TargetsTab({
  tableConfig,
  mainData,
  filter,
  handleTableChange,
}: ITargetsTabProps) {
  const [paginationPageSize, setPaginationPageSize] = useState<number>(5);

  // Build table columns from config
  const targetTableColumns = tableConfig?.targets?.map(
    (configItem: any, i: any) => {
      if (configItem.group_label) {
        return {
          title: configItem.group_label,
          children: configItem.columns.map((groupItem: any, i: any) => {
            return buildColumnDefinition(groupItem, mainData, filter, null);
          }),
        };
      } else {
        return buildColumnDefinition(
          configItem.columns[0],
          mainData,
          filter,
          null
        );
      }
    }
  );

  return (
    <>
      <TargetsTable
        rowKey={(record) => record["target_uid"]}
        columns={targetTableColumns}
        dataSource={mainData}
        scroll={{ x: 2500 }}
        onChange={handleTableChange}
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
