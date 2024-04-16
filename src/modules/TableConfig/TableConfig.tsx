import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ChangeEvent, useEffect, useState } from "react";
import FullScreenLoader from "../../components/Loaders/FullScreenLoader";
import Header from "../../components/Header";
import NavItems from "../../components/NavItems";
import Container from "../../components/Layout/Container";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { getSurveyCTOForm } from "../../redux/surveyCTOInformation/surveyCTOInformationActions";
import NotFound from "../../components/NotFound";
import { Button, Checkbox, Input, Modal, Table, message } from "antd";
import TableCard from "./TableCard";
import { getTableConfig } from "../../redux/tableConfig/tableConfigActions";
import { RootState } from "../../redux/store";
import { properCase } from "../../utils/helper";
import { PlusOutlined } from "@ant-design/icons";
import SelectGroup from "./SelectGroup";
import { fetchEnumeratorsColumnConfig } from "../../redux/enumerators/apiService";
import { fetchTargetsColumnConfig } from "../../redux/targets/apiService";

function TableConfig() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Get the table parameter from the URL
  const [searchParam] = useSearchParams();
  const table = searchParam.get("table");

  const { survey_uid, form_uid } = useParams<{
    survey_uid: string;
    form_uid: string;
  }>();

  const { tableConfig } = useAppSelector(
    (state: RootState) => state.tableConfig
  );

  const [config, setConfig] = useState<any>(null);
  const [addColModel, setAddColModel] = useState(false);
  const [enumeratorsColumn, setEnumeratorsColumn] = useState<any>(null);
  const [targetsColumn, setTargetsColumn] = useState<any>(null);

  const [groupLabels, setGroupLabels] = useState<string[]>([]);

  // Ensure that the form_uid is available
  useEffect(() => {
    if (survey_uid == "" || survey_uid == undefined) return;
    if (form_uid == "" || form_uid == undefined) {
      const resp = dispatch(getSurveyCTOForm({ survey_uid }));
      resp.then((res) => {
        const formUid = res.payload[0]?.form_uid;
        if (formUid) {
          navigate(
            `/module-configuration/table-config/${survey_uid}/${formUid}`
          );
        }
      });
    }
  }, []);

  const tableColumns = [
    {
      title: "Available Columns",
      dataIndex: "available_col",
      key: "available_col",
    },
    {
      title: "Source",
      dataIndex: "source",
      key: "source",
    },
    {
      title: "Column Label",
      dataIndex: "col_label",
      key: "col_label",
    },
    {
      title: "Group",
      dataIndex: "group",
      key: "group",
    },
  ];

  // Handling the input change in Column Label
  const handleInputChange = (
    tableKey: string,
    groupIndex: number,
    columnIndex: number,
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const newVal = e.target.value;
    const newConfig = {
      ...config,
      [tableKey]: [
        ...config[tableKey].map((item: any, idx: number) => {
          if (idx === groupIndex) {
            return {
              ...item,
              columns: [
                ...item.columns.map((col: any, colIdx: number) => {
                  if (colIdx === columnIndex) {
                    return {
                      ...col,
                      column_label: newVal,
                    };
                  }
                  return col;
                }),
              ],
            };
          }
          return item;
        }),
      ],
    };

    // Update the state
    setConfig(newConfig);
  };

  const handleSelectChange = (
    tableKey: string,
    groupIndex: number,
    colIndex: number,
    gName: string
  ) => {
    let newConfig = { ...config };
    const colItem = newConfig[tableKey][groupIndex].columns[colIndex];

    // Find the group index for insertion
    const newGroupIndex = newConfig[tableKey].findIndex(
      (group: any) => group.group_label === gName
    );

    // If the group does not exist, create a new group
    if (newGroupIndex === -1) {
      newConfig = {
        ...newConfig,
        [tableKey]: [
          ...newConfig[tableKey],
          { group_label: gName, columns: [colItem] },
        ],
      };
    } else {
      // Otherwise, add the column to the existing group
      const currentColumns = [...newConfig[tableKey][newGroupIndex].columns];
      currentColumns.push(colItem);
      const tableItems = [...newConfig[tableKey]];
      tableItems[newGroupIndex] = {
        ...tableItems[newGroupIndex],
        columns: currentColumns,
      };
      newConfig = { ...newConfig, [tableKey]: tableItems };
    }

    // Remove the column from the previous group
    const oldGroupColumns = [...newConfig[tableKey][groupIndex].columns];
    const filteredGroupColumns = oldGroupColumns.filter(
      (col: any, i: number) => i !== colIndex
    );
    const oldTableItems = [...newConfig[tableKey]];
    oldTableItems[groupIndex] = {
      ...oldTableItems[groupIndex],
      columns: filteredGroupColumns,
    };
    newConfig = { ...newConfig, [tableKey]: oldTableItems };

    // Update the state
    setConfig(newConfig);
  };

  const tableDataSource = function () {
    if (config && Object.keys(config).length > 0) {
      if (table) {
        const tempD: any = [];
        const tableKey = table.toLowerCase();
        try {
          config[tableKey].forEach((item: any, itemIdx: number) => {
            // Loop through the columns
            item.columns.forEach((col: any, colIdx: number) => {
              tempD.push({
                key: col.column_key,
                available_col: col.column_key,
                source: properCase(table.toUpperCase().replaceAll("_", " ")),
                col_label: (
                  <Input
                    value={col.column_label}
                    style={{ width: 280 }}
                    onChange={(e) =>
                      handleInputChange(tableKey, itemIdx, colIdx, e)
                    }
                  />
                ),
                group: item.group_label ? (
                  <SelectGroup
                    label={item.group_label}
                    groups={groupLabels}
                    setGroup={setGroupLabels}
                    onSelectChange={(value: string) =>
                      handleSelectChange(tableKey, itemIdx, colIdx, value)
                    }
                  />
                ) : (
                  ""
                ),
              });
            });
          });
          return tempD;
        } catch (error) {
          message.error("An error occurred while generating the table");
        }
      }
    } else {
      return [];
    }
  };

  const selectedEnumCols = enumeratorsColumn?.filter((item: string) => {
    if (table && config[table]) {
      return config[table].some((group: any) => {
        return group.columns.some((col: any) => {
          return col.column_key === item;
        });
      });
    }
    return false;
  });

  // Checking if the data is loading
  const isLoading = tableConfig.loading;

  // Ensure that the survey_uid are available
  if (!survey_uid) {
    return <NotFound />;
  }

  // Fetch the table config on redux state
  useEffect(() => {
    if (form_uid) {
      dispatch(getTableConfig({ formUID: form_uid }));

      fetchEnumeratorsColumnConfig(form_uid).then((res: any) => {
        if (res.status === 200) {
          const enumCols = res.data.data?.map((item: any) => item.column_name);
          setEnumeratorsColumn(enumCols);
        } else {
          message.error(
            "An error occurred while fetching the Enumerators column config"
          );
        }
      });

      fetchTargetsColumnConfig(form_uid).then((res: any) => {
        if (res.status === 200) {
          const targetCols = res.data.data?.map(
            (item: any) => item.column_name
          );
          setTargetsColumn(targetCols);
        } else {
          message.error(
            "An error occurred while fetching the Enumerators column config"
          );
        }
      });
    }
  }, [form_uid]);

  // Set the config once the table config data is available
  useEffect(() => {
    if (!tableConfig.loading && tableConfig.data) {
      const config = tableConfig.data;
      setConfig(config);
    }
  }, [tableConfig]);

  // Get the group labels and set the state
  useEffect(() => {
    const groupLabelsTemp: any = [];
    if (config && Object.keys(config).length > 0 && table) {
      const tableKey = table.toLowerCase();
      try {
        config[tableKey].forEach((item: any) => {
          // Check if the group label is available
          if (item.group_label) {
            groupLabelsTemp.push(item.group_label);
          }
        });
        setGroupLabels(groupLabelsTemp);
      } catch (error) {
        message.error("An error occurred while gathering the group labels");
      }
    }
  }, [config, table]);

  return (
    <>
      <Header items={NavItems} />
      {isLoading ? (
        <FullScreenLoader />
      ) : (
        <>
          <Container />
          <div style={{ marginLeft: 56 }}>
            <p style={{ color: "rgba(0,0,0, 0.45)" }}>
              ACME / Assignments Column Configuration /{" "}
              {table
                ? properCase(table.toUpperCase().replaceAll("_", " "))
                : null}
            </p>
            {table && config && Object.keys(config).length > 0 ? (
              <>
                <Table
                  columns={tableColumns}
                  dataSource={tableDataSource()}
                  pagination={false}
                />
                <Button
                  style={{ marginTop: 16 }}
                  icon={<PlusOutlined />}
                  onClick={() => setAddColModel(true)}
                >
                  Add Custom column
                </Button>
              </>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  marginRight: 24,
                }}
              >
                <TableCard
                  title="Targets"
                  description="Selected columns will be visible for Targets table for
                  assignments."
                  btnLabel="View configuration"
                />
                <TableCard
                  title="Surveyors"
                  description="Selected columns will be visible for surveyors table for
                assignments."
                  btnLabel="View configuration"
                />
                <TableCard
                  title="Assignments Main"
                  description="Selected columns will be visible for assignments table for assignments."
                  btnLabel="View configuration"
                />
                <TableCard
                  title="Assignments Surveyors"
                  description="Selected columns will be visible for ‘assignments surveyors’ table for assignments."
                  btnLabel="View configuration"
                />
                <TableCard
                  title="Assignments Review"
                  description="Selected columns will be visible for ‘assignments review’ for assignments"
                  btnLabel="View configuration"
                />
              </div>
            )}
          </div>
          <Modal
            open={addColModel}
            title="Title"
            okText="Add Column"
            width={900}
            onCancel={() => setAddColModel(false)}
          >
            <p>Enumerator</p>
            <Checkbox.Group
              options={enumeratorsColumn}
              defaultValue={selectedEnumCols}
            />
            <p>Targets</p>
            <Checkbox.Group options={targetsColumn} />
          </Modal>
        </>
      )}
    </>
  );
}

export default TableConfig;
