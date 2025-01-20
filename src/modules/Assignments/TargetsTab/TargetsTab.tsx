import { useEffect, useState } from "react";
import { TargetsTable } from "./TargetsTab.styled";
import { buildColumnDefinition } from "../utils";
import { ITargetsTabProps } from "../types";

function TargetsTab({
  tableConfig,
  mainData,
  filter,
  handleTableChange,
  setColumn,
}: ITargetsTabProps) {
  const [paginationPageSize, setPaginationPageSize] = useState<number>(25);

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

  useEffect(() => {
    if (targetTableColumns?.length > 0) {
      setColumn(targetTableColumns);
    }
  }, [tableConfig]);

  return (
    <>
      <TargetsTable
        rowKey={(record: any) => record["target_uid"]}
        columns={targetTableColumns}
        dataSource={mainData}
        bordered={true}
        scroll={{ x: 2500, y: "calc(100vh - 380px)" }}
        onChange={handleTableChange}
        pagination={{
          pageSize: paginationPageSize,
          pageSizeOptions: [10, 25, 50, 100],
          showSizeChanger: true,
          showQuickJumper: true,
          onShowSizeChange: (_, size) => setPaginationPageSize(size),
        }}
        footer={() => (
          <p style={{ margin: 0, color: "#8c8c8c", fontStyle: "italic" }}>
            <span style={{ color: "red" }}>*</span> red background color in
            supervisor columns indicate either the target is not mapped to a
            supervisor (if value is missing in lowest level supervisor column)
            or the user hierarchy for a supervisor is incomplete. This could
            mean that this target is not visible to the required supervisors.
          </p>
        )}
      />
    </>
  );
}

export default TargetsTab;
