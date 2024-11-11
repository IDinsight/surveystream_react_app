import { useEffect, useState } from "react";
import { SurveyorsTable } from "./SurveyorsTab.styled";
import SurveyorStatus from "../../../components/SurveyorStatus";
import { useParams } from "react-router-dom";
import { buildColumnDefinition } from "../utils";
import { ISurveyorsTabProps } from "../types";

function SurveyorsTab({
  tableConfig,
  mainData,
  filter,
  handleTableChange,
  setColumn,
}: ISurveyorsTabProps) {
  const [paginationPageSize, setPaginationPageSize] = useState<number>(25);

  const { form_uid } = useParams<{ form_uid: string }>() ?? {
    form_uid: "",
  };

  // Build table columns from config
  const specialAttributes = {
    surveyor_status: {
      render: (_: string, record: any) => (
        <SurveyorStatus
          key={record["enumerator_uid"]}
          record={record}
          formID={form_uid ?? ""}
        />
      ),
    },
  };

  const enumeratorTableColumns = tableConfig?.surveyors?.map(
    (configItem: any, i: any) => {
      if (configItem.group_label) {
        return {
          title: configItem.group_label,
          children: configItem.columns.map((groupItem: any, i: any) => {
            return buildColumnDefinition(
              groupItem,
              mainData,
              filter,
              specialAttributes,
              configItem.group_label
            );
          }),
        };
      } else {
        return buildColumnDefinition(
          configItem.columns[0],
          mainData,
          filter,
          specialAttributes
        );
      }
    }
  );

  useEffect(() => {
    if (enumeratorTableColumns?.length > 0) {
      setColumn(enumeratorTableColumns);
    }
  }, [tableConfig]);

  return (
    <>
      <SurveyorsTable
        rowKey={(record: any) => record["enumerator_uid"]}
        columns={enumeratorTableColumns}
        dataSource={mainData}
        scroll={{ x: 2200, y: "calc(100vh - 380px)" }}
        bordered={true}
        onChange={handleTableChange}
        pagination={{
          pageSize: paginationPageSize,
          pageSizeOptions: [10, 25, 50, 100],
          showSizeChanger: true,
          showQuickJumper: true,
          onShowSizeChange: (_, size) => setPaginationPageSize(size),
        }}
        footer={() => (
          <p style={{ margin: 0 }}>
            <span style={{ color: "red" }}>*</span> red background color in
            supervisor columns indicate either the surveyor is not mapped to a
            supervisor (if value is missing in lowest level supervisor column)
            or the user hierarchy for a supervisor is incomplete. This could
            mean that this surveyor is not visible to the required supervisors.
          </p>
        )}
      />
    </>
  );
}

export default SurveyorsTab;
