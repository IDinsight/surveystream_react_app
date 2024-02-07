import { useEffect, useState } from "react";
import { SurveyorsTable } from "./SurveyorsTab.styled";
import SurveyorStatus from "../../../components/SurveyorStatus";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { RootState } from "../../../redux/store";
import { useParams } from "react-router-dom";
import { buildColumnDefinition } from "../utils";
import { getTableConfig } from "../../../redux/assignments/assignmentsActions";
import FullScreenLoader from "../../../components/Loaders/FullScreenLoader";
import { getEnumerators } from "../../../redux/enumerators/enumeratorsActions";

function SurveyorsTab() {
  const dispatch = useAppDispatch();
  const { form_uid } = useParams<{ form_uid: string }>() ?? {
    form_uid: "",
  };

  const { loading: tableConfigLoading, data: tableConfigData } = useAppSelector(
    (state: RootState) => state.assignments.tableConfig
  );
  const { enumeratorList: enumeratorsData, loading } = useAppSelector(
    (state: RootState) => state.enumerators
  );

  const [paginationPageSize, setPaginationPageSize] = useState<number>(5);
  const [mainData, setMainData] = useState<any>([]);

  // Build table columns from config
  const specialAttributes = {
    surveyor_status: {
      render: (_: string, record: any) => (
        <SurveyorStatus
          key={record.key}
          record={record}
          formID={form_uid ?? ""}
        />
      ),
    },
  };

  const enumeratorTableColumns = tableConfigData?.surveyors?.map(
    (configItem: any, i: any) => {
      if (configItem.group_label) {
        return {
          title: configItem.group_label,
          children: configItem.columns.map((groupItem: any, i: any) => {
            return buildColumnDefinition(
              groupItem,
              enumeratorsData,
              null,
              null,
              specialAttributes
            );
          }),
        };
      } else {
        return buildColumnDefinition(
          configItem.columns[0],
          enumeratorsData,
          null,
          null,
          specialAttributes
        );
      }
    }
  );

  // Row selection state and handler
  const [selectedRows, setSelectedRows] = useState<any>([]);

  const onSelectChange = (selectedRowKeys: React.Key[], selectedRows: any) => {
    const selectedEmails = selectedRows.map((row: any) => row.email);

    const selectedUserData = mainData?.filter((row: any) =>
      selectedEmails.includes(row.email)
    );

    setSelectedRows(selectedUserData);
  };

  const rowSelection = {
    selectedRows,
    onChange: onSelectChange,
  };
  const hasSelected = selectedRows.length > 0;

  useEffect(() => {
    if (Object.keys(tableConfigData).length === 0) {
      dispatch(getTableConfig({ formUID: form_uid ?? "" }));
    }

    if (enumeratorsData.length === 0) {
      dispatch(getEnumerators({ formUID: form_uid ?? "" }));
    }
  }, []);

  useEffect(() => {
    if (enumeratorsData.length > 0) {
      setMainData(enumeratorsData);
    }
  }, [enumeratorsData]);

  if (loading) {
    return <FullScreenLoader />;
  }

  return (
    <>
      <SurveyorsTable
        rowSelection={rowSelection}
        columns={enumeratorTableColumns}
        dataSource={mainData}
        scroll={{ x: 2200 }}
        bordered={true}
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
