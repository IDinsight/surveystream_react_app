import { FilterValue, TablePaginationConfig } from "antd/es/table/interface";

type TableOnChangeType = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: any,
    extra: any
) => void;

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
}

export interface ISurveyorsTabProps {
    tableConfig: any;
    mainData: any[];
    filter: any;
    handleTableChange: TableOnChangeType;
}

export interface ITargetsTabProps {
    tableConfig: any;
    mainData: any[];
    filter: any;
    handleTableChange: TableOnChangeType;
}
