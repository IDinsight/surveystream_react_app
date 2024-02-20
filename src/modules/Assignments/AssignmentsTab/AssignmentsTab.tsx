import { useEffect, useState } from "react";
import { AssignmentsTable } from "./AssignmentsTab.styled";
import { buildColumnDefinition } from "../utils";
import { Tag } from "antd";
import { TablePaginationConfig, FilterValue } from "antd/lib/table/interface";
import { IAssignmentsTabProps } from "../types";

type TableOnChangeType = (
  pagination: TablePaginationConfig,
  filters: Record<string, FilterValue | null>,
  sorter: any,
  extra: any
) => void;

function AssignmentsTab({
  tableConfig,
  mainData,
  rowSelection,
  filter,
  handleTableChange,
  setColumn,
}: IAssignmentsTabProps) {
  // console.log("mainData", mainData);
  const [paginationPageSize, setPaginationPageSize] = useState<number>(5);

  /* 
    Build the table column with special case where we need to render
    the value of a column differently
  */
  const mainTableSpecialAttrs: any = {
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
    respondent_names: {
      render: (names: any) => (
        <>
          {names?.map((name: any) => (
            <Tag key={name}>{name}</Tag>
          ))}
        </>
      ),
    },
    revisit_sections: {
      render: (sections: any) => (
        <>
          {sections?.map((section: any) => (
            <Tag key={section}>{section}</Tag>
          ))}
        </>
      ),
    },
  };

  const mainTableColumns = tableConfig?.assignments_main?.map(
    (configItem: any, i: any) => {
      if (configItem.group_label) {
        return {
          title: configItem.group_label,
          children: configItem.columns.map((groupItem: any, i: any) => {
            return buildColumnDefinition(
              groupItem,
              mainData,
              filter,
              mainTableSpecialAttrs
            );
          }),
        };
      } else {
        return buildColumnDefinition(
          configItem.columns[0],
          mainData,
          filter,
          mainTableSpecialAttrs
        );
      }
    }
  );

  useEffect(() => {
    if (mainTableColumns?.length > 0) {
      setColumn(mainTableColumns);
    }
  }, [tableConfig]);

  return (
    <>
      <AssignmentsTable
        rowKey={(record) => record["target_uid"]}
        rowSelection={rowSelection}
        columns={mainTableColumns}
        dataSource={mainData}
        bordered={true}
        scroll={{ x: 2500 }}
        onChange={handleTableChange}
        rowClassName={(record: any) =>
          !record.target_assignable ? "disabled-row" : ""
        }
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
