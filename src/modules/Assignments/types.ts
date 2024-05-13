import { FilterValue, TablePaginationConfig } from "antd/es/table/interface";
import { Dispatch, SetStateAction } from "react";

type TableOnChangeType = (
  pagination: TablePaginationConfig,
  filters: Record<string, FilterValue | null>,
  sorter: any,
  extra: any
) => void;

export interface IColumnItem {
  column_key: string;
  column_label: string;
}

export interface IConfigItem {
  columns: IColumnItem[];
  group_label: string;
}

type SetColumn = Dispatch<SetStateAction<any>>;

export interface IAssignmentsStats {
  completed: number;
  assigned: number;
  unassigned: number;
}

export interface IAssignmentsTabProps {
  tableConfig: any;
  mainData: any[];
  rowSelection: any;
  filter: any;
  handleTableChange: TableOnChangeType;
  setColumn: SetColumn;
}

export interface ISurveyorsTabProps {
  tableConfig: any;
  mainData: any[];
  filter: any;
  handleTableChange: TableOnChangeType;
  setColumn: SetColumn;
}

export interface ITargetsTabProps {
  tableConfig: any;
  mainData: any[];
  filter: any;
  handleTableChange: TableOnChangeType;
  setColumn: SetColumn;
}
