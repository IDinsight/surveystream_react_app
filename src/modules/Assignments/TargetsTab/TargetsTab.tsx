import { useEffect, useState } from "react";
import { TargetsTable } from "./TargetsTab.styled";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { RootState } from "../../../redux/store";
import { buildColumnDefinition } from "../utils";
import { useParams } from "react-router-dom";
import {
  getTableConfig,
  getTargets,
} from "../../../redux/assignments/assignmentsActions";
import FullScreenLoader from "../../../components/Loaders/FullScreenLoader";

function TargetsTab() {
  const dispatch = useAppDispatch();
  const { form_uid } = useParams<{ form_uid: string }>() ?? {
    form_uid: "",
  };

  const { loading: tableConfigLoading, data: tableConfigData } = useAppSelector(
    (state: RootState) => state.assignments.tableConfig
  );
  const { data: targeData, loading } = useAppSelector(
    (state: RootState) => state.assignments.targets
  );

  const [paginationPageSize, setPaginationPageSize] = useState<number>(5);
  const [mainData, setMainData] = useState<any>([]);

  // Build table columns from config
  const targetTableColumns = tableConfigData?.targets?.map(
    (configItem: any, i: any) => {
      if (configItem.group_label) {
        return {
          title: configItem.group_label,
          children: configItem.columns.map((groupItem: any, i: any) => {
            return buildColumnDefinition(groupItem, targeData, null, null);
          }),
        };
      } else {
        return buildColumnDefinition(
          configItem.columns[0],
          targeData,
          null,
          null
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

    if (targeData.length === 0) {
      dispatch(getTargets({ formUID: form_uid ?? "" }));
    }
  }, []);

  useEffect(() => {
    if (targeData.length > 0) {
      setMainData(targeData);
    }
  }, [targeData]);

  if (loading) {
    return <FullScreenLoader />;
  }

  return (
    <>
      <TargetsTable
        rowSelection={rowSelection}
        columns={targetTableColumns}
        dataSource={mainData}
        scroll={{ x: 2500 }}
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
