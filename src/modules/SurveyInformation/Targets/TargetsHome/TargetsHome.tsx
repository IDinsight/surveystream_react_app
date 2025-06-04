import { useNavigate, useParams } from "react-router-dom";
import { Button, Divider, Modal, Radio, Space, message } from "antd";
import { ClearOutlined } from "@ant-design/icons";

import { HeaderContainer, Title } from "../../../../shared/Nav.styled";
import SideMenu from "../../SideMenu";
import { TargetsHomeFormWrapper, TargetsTable } from "./TargetsHome.styled";

import { useEffect, useState } from "react";
import RowEditingModal from "./RowEditingModal";
import TargetsCountBox from "../../../../components/TargetsCountBox";
import {
  setLoading,
  setTargetsColumnMapping,
} from "../../../../redux/targets/targetSlice";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { RootState } from "../../../../redux/store";
import {
  getSurveyCTOForm,
  getSurveyCTOFormData,
} from "../../../../redux/surveyCTOInformation/surveyCTOInformationActions";
import {
  getTargets,
  getTargetConfig,
} from "../../../../redux/targets/targetActions";
import FullScreenLoader from "../../../../components/Loaders/FullScreenLoader";
import { useCSVDownloader } from "react-papaparse";
import TargetsReupload from "../TargetsReupload";
import TargetsRemap from "../TargetsRemap";
import { GlobalStyle } from "../../../../shared/Global.styled";
import Container from "../../../../components/Layout/Container";
import { getSurveyLocationsLong } from "../../../../redux/surveyLocations/surveyLocationsActions";
import { CustomBtn } from "../../SurveyUserRoles/SurveyUserRoles.styled";

function TargetsHome() {
  const navigate = useNavigate();

  const { CSVDownloader, Type } = useCSVDownloader();

  const { survey_uid } = useParams<{ survey_uid: string }>() ?? {
    survey_uid: "",
  };
  const { form_uid } = useParams<{ form_uid: string }>() ?? {
    form_uid: "",
  };

  const dispatch = useAppDispatch();

  const isLoading = useAppSelector((state: RootState) => state.targets.loading);
  const { loading: isSideMenuLoading } = useAppSelector(
    (state: RootState) => state.surveyConfig
  );

  const activeSurvey = useAppSelector(
    (state: RootState) => state.surveys.activeSurvey
  );
  const targetList = useAppSelector(
    (state: RootState) => state.targets.targetsList
  );

  const [targetsCount, setTargetsCount] = useState<number>(0);

  const [editMode, setEditMode] = useState<boolean>(false);
  const [editData, setEditData] = useState<boolean>(false);
  const [fieldData, setFieldData] = useState<any>([]);
  const [paginationPageSize, setPaginationPageSize] = useState<number>(10);
  const [dataTableColumn, setDataTableColumn] = useState<any>([]);
  const [tableDataSource, setTableDataSource] = useState<any>([]);
  const [targetsLastUpdated, setTargetsLastUpdated] = useState<string>("");
  const [formTimezone, setFormTimezone] = useState<string>("UTC");

  const formatDate = (date: any, tz_name: string) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "short",
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      timeZone: tz_name,
    };

    // find timezone abbreviation to append to the date
    const timeZone = Intl.DateTimeFormat(undefined, {
      timeZone: tz_name,
      timeZoneName: "shortGeneric",
    }).formatToParts();

    return (
      new Date(date).toLocaleDateString("en-US", options) +
      " " +
      timeZone[6].value
    );
  };
  // Row selection state and handler
  const [selectedRows, setSelectedRows] = useState<any>([]);

  /*
   * New design configs
   */
  const [screenMode, setScreenMode] = useState<string>("manage");
  const [newTargetModal, setNewTargetModal] = useState<boolean>(false);

  // Mode: overwrite or merge
  const [newTargetMode, setNewTargetMode] = useState<string>("");

  const [isTargetInUse, setIsTargetInUse] = useState<boolean>(false);

  const onSelectChange = (selectedRowKeys: React.Key[], selectedRows: any) => {
    const selectedTargetIds = selectedRows.map((row: any) => row.target_id);

    const selectedTargetData = targetList.filter((row: any) =>
      selectedTargetIds.includes(row.target_id)
    );
    setSelectedRows(selectedTargetData);
  };

  const [targetDataSource, setTargetDataSource] = useState<string>("");

  const rowSelection = {
    selectedRows,
    onChange: onSelectChange,
  };
  const hasSelected = selectedRows.length > 0;

  // Handler for Edit Data button
  const onEditDataHandler = async () => {
    if (!hasSelected) {
      message.error("No row selected for editing");
      return;
    }
    // Setting the fields to show on Modal
    const colNames = { ...selectedRows[0].custom_fields.column_mapping };
    const fields = Object.keys(colNames)
      .filter((field) => field !== "key" && field !== "location_id_column")
      .map((field: string) => {
        if (field === "custom_fields") {
          if (
            selectedRows[0][field] &&
            typeof selectedRows[0][field] === "object"
          ) {
            const customFields = selectedRows[0][field];

            return Object.keys(customFields)
              .filter((key) => key !== "column_mapping") // Filter out "column_mapping"
              .map((key) => ({
                labelKey: key,
                label: `custom_fields.${key}`,
              }));
          }
        }

        return {
          labelKey: field,
          label: dataTableColumn.find((col: any) => col.dataIndex === field)
            ?.title,
        };
      })
      .flat();
    // Ensure target_id is always at the top
    const targetIdField = fields.find(
      (field) => field.labelKey === "target_id"
    );
    if (targetIdField) {
      fields.splice(fields.indexOf(targetIdField), 1);
      fields.unshift(targetIdField);
    }

    const locationfields = [];
    if (
      selectedRows[0]["target_locations"] &&
      Array.isArray(selectedRows[0]["target_locations"])
    ) {
      const locationFields = selectedRows[0]["target_locations"];
      const locationDataPromises = locationFields
        .filter(
          (location: { location_uid: string }) =>
            location.location_uid === selectedRows[0].location_uid
        )
        .map(
          async (location: {
            geo_level_uid: string;
            geo_level_name: string;
          }) => {
            const locationData = await dispatch(
              getSurveyLocationsLong({
                survey_uid: activeSurvey.survey_uid,
                geo_level_uid: location.geo_level_uid,
              })
            );
            if (locationData) {
              const locationOptions = locationData.payload.map(
                (item: {
                  location_id: string;
                  location_name: string;
                  location_uid: string;
                }) => ({
                  label: `${item.location_id} - ${item.location_name}`,
                  value: item.location_uid,
                })
              );
              return {
                labelKey: location.geo_level_name + " ID",
                label: `target_locations.${location.geo_level_name}`,
                options: locationOptions,
              };
            }
            return {
              labelKey: location.geo_level_name + " ID",
              label: `target_locations.${location.geo_level_name}`,
            };
          }
        );

      const locationData = await Promise.all(locationDataPromises);
      locationfields.push(...locationData);
    }
    setFieldData([...fields, ...locationfields]);
    setEditData(true);
  };

  const onEditingCancel = () => {
    setEditData(false);
  };

  const onEditingUpdate = async () => {
    if (form_uid) {
      await getTargetsList(form_uid);
    }
    setEditData(false);
    setEditMode(false);
  };

  const handleFormUID = async () => {
    if (form_uid == "" || form_uid == undefined || form_uid == "undefined") {
      try {
        dispatch(setLoading(true));
        const sctoForm = await dispatch(
          getSurveyCTOForm({ survey_uid: survey_uid })
        );
        if (sctoForm?.payload[0]?.form_uid) {
          navigate(
            `/survey-information/targets/${survey_uid}/${sctoForm?.payload[0]?.form_uid}`
          );
        } else {
          message.error("Kindly configure SCTO Form to proceed");
          navigate(`/survey-information/survey-cto-information/${survey_uid}`);
        }
        dispatch(setLoading(false));
      } catch (error) {
        dispatch(setLoading(false));
        console.log("Error fetching sctoForm:", error);
      }
    }
  };
  const getTargetsList = async (form_uid: string) => {
    setLoading(true);
    const targetRes = await dispatch(getTargets({ formUID: form_uid }));
    const targetConfig = await dispatch(
      getTargetConfig({ form_uid: form_uid })
    );
    if (targetConfig.payload.success) {
      setTargetDataSource(targetConfig.payload.data.data.target_source);
      setTargetsLastUpdated(
        targetConfig.payload.data.data.targets_last_uploaded
      );

      const formData = await dispatch(getSurveyCTOFormData({ form_uid }));
      if (formData.payload) {
        setFormTimezone(formData.payload.tz_name);
      }
    }

    if (targetRes.payload.status == 200) {
      //create rowbox data
      const originalData = targetRes.payload.data.data;
      setTargetsCount(originalData.length);

      if (originalData.length == 0) {
        if (targetConfig.payload.success) {
          if (targetConfig.payload.data?.data.target_source === "csv") {
            navigate(
              `/survey-information/targets/upload/${survey_uid}/${form_uid}`
            );
          } else if (targetConfig.payload.data?.data.target_source === "scto") {
            setScreenMode("config");
          } else {
            navigate(
              `/survey-information/targets/config/${survey_uid}/${form_uid}`
            );
          }
        } else {
          navigate(
            `/survey-information/targets/config/${survey_uid}/${form_uid}`
          );
        }
        return;
      }

      const columnsToExclude = [
        "form_uid",
        "target_uid",
        "location_uid",
        "target_locations",
        "completed_flag",
        "last_attempt_survey_status",
        "last_attempt_survey_status_label",
        "final_survey_status",
        "final_survey_status_label",
        "num_attempts",
        "refusal_flag",
        "revisit_sections",
        "target_assignable",
        "webapp_tag_color",
      ];
      //set targets column mapping

      if (originalData[0]?.custom_fields?.column_mapping) {
        dispatch(
          setTargetsColumnMapping(
            originalData[0]?.custom_fields?.column_mapping
          )
        );
      } else {
        const columnMapping: any = {};

        for (const key in originalData[0]) {
          if (
            Object.prototype.hasOwnProperty.call(originalData[0], key) &&
            key !== "custom_fields" &&
            !columnsToExclude.includes(key)
          ) {
            columnMapping[key] = key;
          }
        }

        dispatch(setTargetsColumnMapping(columnMapping));
      }

      // Define column mappings
      let columnMappings = Object.keys(originalData[0])
        .filter((column) => !columnsToExclude.includes(column))
        .filter((column) =>
          originalData.some(
            (row: any) => row[column] !== null && column !== "custom_fields"
          )
        )
        .map((column) => {
          // Convert to title case, keeping ID uppercase if it's the last word
          const title = column
            .split("_")
            .map((word, index, arr) => {
              if (word.toLowerCase() === "id" && index === arr.length - 1) {
                return "ID";
              }
              return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
            })
            .join(" ");

          // Get unique values for filter
          const uniqueValues = Array.from(
            new Set(
              originalData
                .map((item: any) => item[column])
                .filter((value: any) => value !== null && value !== undefined)
            )
          ).map((value: any) => ({ text: value.toString(), value: value }));

          return {
            title,
            dataIndex: column,
            width: "25px",
            ellipsis: true,
            sorter: (a: any, b: any) => {
              const aVal = a[column];
              const bVal = b[column];
              if (typeof aVal === "number" && typeof bVal === "number") {
                return aVal - bVal;
              }
              return (aVal?.toString() || "").localeCompare(
                bVal?.toString() || ""
              );
            },
            filters: uniqueValues,
            filterMode: "menu",
            filterSearch: true,
            onFilter: (value: any, record: any) =>
              record[column]?.toString() === value.toString(),
          };
        });

      const customFieldsSet = new Set(); // Create a set to track unique custom fields
      const customFields = originalData.reduce((acc: any, row: any) => {
        if (row.custom_fields && typeof row.custom_fields === "object") {
          for (const key in row.custom_fields) {
            if (
              row.custom_fields[key] !== null &&
              !customFieldsSet.has(key) &&
              key !== "column_mapping"
            ) {
              customFieldsSet.add(key);
              const title = key
                .split("_")
                .map((word, index, arr) => {
                  if (word.toLowerCase() === "id" && index === arr.length - 1) {
                    return "ID";
                  }
                  return (
                    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                  );
                })
                .join(" ");

              // Get unique values for custom field filters
              const uniqueValues = Array.from(
                new Set(
                  originalData
                    .map((item: any) => item.custom_fields?.[key])
                    .filter(
                      (value: any) => value !== null && value !== undefined
                    )
                )
              ).map((value: any) => ({ text: value.toString(), value: value }));

              acc.push({
                title: title,
                dataIndex: `custom_fields.${key}`,
                width: "30px",
                ellipsis: true,
                sorter: (a: any, b: any) => {
                  const aVal = a.custom_fields?.[key];
                  const bVal = b.custom_fields?.[key];
                  if (typeof aVal === "number" && typeof bVal === "number") {
                    return aVal - bVal;
                  }
                  return (aVal?.toString() || "").localeCompare(
                    bVal?.toString() || ""
                  );
                },
                filters: uniqueValues,
                filterMode: "menu",
                filterSearch: true,
                onFilter: (value: any, record: any) =>
                  record.custom_fields?.[key]?.toString() === value.toString(),
              });
            }
          }
        }
        return acc;
      }, []);

      const locationFieldsSet = new Set(); // Create a set to track unique location fields
      const locationFields = originalData.reduce((acc: any, row: any) => {
        if (row.target_locations && typeof row.target_locations === "object") {
          for (const location of row.target_locations) {
            if (row.location_uid === location.location_uid) {
              const geoLevelName = location.geo_level_name;
              const geoLevelUID = `${geoLevelName} ID`;
              const geoLevelNameField = `${geoLevelName} name`;

              if (!locationFieldsSet.has(geoLevelUID)) {
                locationFieldsSet.add(geoLevelUID);
                // Get unique values for ID filters
                const uniqueIDValues = Array.from(
                  new Set(
                    originalData
                      .map(
                        (item: any) =>
                          item.target_locations?.find(
                            (loc: any) =>
                              loc.location_uid === item.location_uid &&
                              loc.geo_level_name === geoLevelName
                          )?.location_id
                      )
                      .filter(
                        (value: any) => value !== null && value !== undefined
                      )
                  )
                ).map((value: any) => ({
                  text: value.toString(),
                  value: value,
                }));

                acc.push({
                  title: geoLevelUID,
                  dataIndex: `target_locations.${geoLevelUID}`,
                  width: "30px",
                  ellipsis: true,
                  sorter: (a: any, b: any) => {
                    const aVal = a[`target_locations.${geoLevelUID}`];
                    const bVal = b[`target_locations.${geoLevelUID}`];
                    return (aVal?.toString() || "").localeCompare(
                      bVal?.toString() || ""
                    );
                  },
                  filters: uniqueIDValues,
                  filterMode: "menu",
                  filterSearch: true,
                  onFilter: (value: any, record: any) =>
                    record[`target_locations.${geoLevelUID}`]?.toString() ===
                    value.toString(),
                });
              }

              if (!locationFieldsSet.has(geoLevelNameField)) {
                locationFieldsSet.add(geoLevelNameField);
                // Get unique values for name filters
                const uniqueNameValues = Array.from(
                  new Set(
                    originalData
                      .map(
                        (item: any) =>
                          item.target_locations?.find(
                            (loc: any) =>
                              loc.location_uid === item.location_uid &&
                              loc.geo_level_name === geoLevelName
                          )?.location_name
                      )
                      .filter(
                        (value: any) => value !== null && value !== undefined
                      )
                  )
                ).map((value: any) => ({
                  text: value.toString(),
                  value: value,
                }));

                acc.push({
                  title: `${geoLevelName} Name`,
                  dataIndex: `target_locations.${geoLevelNameField}`,
                  width: "30px",
                  ellipsis: true,
                  sorter: (a: any, b: any) => {
                    const aVal = a[`target_locations.${geoLevelNameField}`];
                    const bVal = b[`target_locations.${geoLevelNameField}`];
                    return (aVal?.toString() || "").localeCompare(
                      bVal?.toString() || ""
                    );
                  },
                  filters: uniqueNameValues,
                  filterMode: "menu",
                  filterSearch: true,
                  onFilter: (value: any, record: any) =>
                    record[
                      `target_locations.${geoLevelNameField}`
                    ]?.toString() === value.toString(),
                });
              }
            }
          }
        }

        return acc;
      }, []);
      columnMappings = columnMappings.concat(customFields, locationFields);

      setDataTableColumn(columnMappings);

      const tableDataSource = originalData.map((item: any, index: any) => {
        const rowData: Record<string, any> = {
          key: index,
          ...item,
        };

        // Process location fields
        if (item.target_locations && Array.isArray(item.target_locations)) {
          const relevantLocation = item.target_locations.find(
            (loc: any) => loc.location_uid === item.location_uid
          );
          if (relevantLocation) {
            const geoLevelName = relevantLocation.geo_level_name;
            rowData[`target_locations.${geoLevelName} ID`] =
              relevantLocation.location_id;
            rowData[`target_locations.${geoLevelName} name`] =
              relevantLocation.location_name;
          }
        }

        // Process custom fields
        if (item.custom_fields) {
          Object.entries(item.custom_fields).forEach(([key, value]) => {
            if (key !== "column_mapping") {
              rowData[`custom_fields.${key}`] = value;
            }
          });
        }

        return rowData;
      });

      setTableDataSource(tableDataSource);
    } else {
      message.error("Targets failed to load, kindly reload to try again.");
    }
    setLoading(false);
  };

  const handleNewTargetMode = () => {
    // Emit error if no new targets mode is selected
    if (newTargetMode === "") {
      message.error("Please select the mode to add new targets.");
      return;
    }

    // Redirect to upload fresh targets, in case of fresh upload, otherwise start append mode
    if (newTargetMode === "overwrite") {
      navigate(`/survey-information/targets/upload/${survey_uid}/${form_uid}`);
      return;
    } else if (newTargetMode === "merge") {
      setScreenMode("reupload");
    }

    setNewTargetModal(false);
  };

  const handlerAddTargetBtn = () => {
    if (tableDataSource.length > 0) {
      setNewTargetModal(true);
    } else {
      navigate(`/survey-information/targets/upload/${survey_uid}/${form_uid}`);
    }
  };

  const [filters, setFilters] = useState({});
  const [sorter, setSorter] = useState({});

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    setFilters(filters);
    setSorter(sorter);
  };

  const clearFiltersAndSorters = () => {
    setFilters({});
    setSorter({});
    if (form_uid) {
      getTargetsList(form_uid);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await handleFormUID();

      if (form_uid && screenMode === "manage") {
        await getTargetsList(form_uid);
      }
      setLoading(false);
    };

    fetchData();
  }, [form_uid, screenMode]);

  return (
    <>
      <GlobalStyle />

      <Container surveyPage={true} />
      <HeaderContainer>
        <Title>Targets</Title>
        <TargetsCountBox targetCount={targetsCount} />

        {!isLoading && !isSideMenuLoading && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginLeft: "auto",
            }}
          >
            {screenMode === "manage" && (
              <div
                style={{
                  display: "flex",
                  marginLeft: "auto",
                }}
              >
                <CustomBtn
                  type="primary"
                  style={{ marginRight: 15 }}
                  onClick={() =>
                    navigate(
                      `/survey-information/targets/config/${survey_uid}/${form_uid}`
                    )
                  }
                >
                  Change Target Configuration
                </CustomBtn>
                <CustomBtn
                  type="primary"
                  style={{ marginRight: 15 }}
                  onClick={() =>
                    navigate(
                      `/survey-information/targets/scto_map/${survey_uid}/${form_uid}`
                    )
                  }
                  disabled={targetDataSource !== "scto"}
                >
                  Edit SurveyCTO Column Mapping
                </CustomBtn>
                {targetDataSource !== "scto" && (
                  <CustomBtn
                    type="primary"
                    style={{ marginRight: 15 }}
                    onClick={onEditDataHandler}
                    disabled={!editMode}
                  >
                    Edit
                  </CustomBtn>
                )}
                <CustomBtn
                  onClick={handlerAddTargetBtn}
                  type="primary"
                  style={{ marginRight: 15 }}
                >
                  Add Targets
                </CustomBtn>
                <CSVDownloader data={tableDataSource} filename={"targets.csv"}>
                  <CustomBtn type="primary" style={{ marginRight: 15 }}>
                    Download CSV
                  </CustomBtn>
                </CSVDownloader>
                <Button
                  onClick={clearFiltersAndSorters}
                  style={{
                    cursor: "pointer",
                    marginRight: 15,
                    padding: "8px 16px",
                    borderRadius: "5px",
                    fontSize: "14px",
                  }}
                  disabled={
                    Object.keys(filters).length === 0 &&
                    Object.keys(sorter).length === 0
                  }
                  icon={<ClearOutlined />}
                />
              </div>
            )}
          </div>
        )}
      </HeaderContainer>
      {isLoading || isSideMenuLoading ? (
        <FullScreenLoader />
      ) : (
        <div style={{ display: "flex" }}>
          <SideMenu />
          {screenMode === "manage" ? (
            <>
              <TargetsHomeFormWrapper>
                {targetsLastUpdated && (
                  <p
                    style={{
                      display: "flex",
                      alignItems: "right",
                      fontSize: 14,
                    }}
                  >
                    Targets last uploaded on:{" "}
                    {formatDate(targetsLastUpdated, formTimezone)}{" "}
                  </p>
                )}
                <TargetsTable
                  rowSelection={
                    targetDataSource !== "scto"
                      ? {
                          ...rowSelection,
                          onChange: (selectedRowKeys, selectedRows) => {
                            onSelectChange(selectedRowKeys, selectedRows);
                            setEditMode(selectedRows.length > 0);
                          },
                          columnWidth: 15,
                        }
                      : undefined
                  }
                  columns={dataTableColumn}
                  dataSource={tableDataSource}
                  tableLayout="auto"
                  scroll={{ x: "max-content" }}
                  onChange={handleTableChange}
                  bordered={true}
                  pagination={{
                    position: ["topRight"],
                    pageSize: paginationPageSize,
                    pageSizeOptions: [5, 10, 25, 50, 100],
                    showSizeChanger: true,
                    showQuickJumper: true,
                    onShowSizeChange: (_, size) => setPaginationPageSize(size),
                    style: { color: "#2F54EB" },
                  }}
                />
                {editData ? (
                  <RowEditingModal
                    data={selectedRows}
                    fields={fieldData}
                    onCancel={onEditingCancel}
                    onUpdate={onEditingUpdate}
                    visible={editData}
                  />
                ) : null}
              </TargetsHomeFormWrapper>
              <Modal
                title="Add Targets"
                open={newTargetModal}
                onOk={handleNewTargetMode}
                okText="Continue"
                onCancel={() => setNewTargetModal(false)}
              >
                <Divider style={{ margin: "0" }} />
                <p>Please select how you want to proceed:</p>
                <Radio.Group
                  style={{ marginBottom: 20 }}
                  onChange={(e) => setNewTargetMode(e.target.value)}
                  value={newTargetMode}
                >
                  <Space direction="vertical">
                    <Radio value="merge">
                      I want to add new targets / columns
                    </Radio>
                    <Radio
                      value="overwrite"
                      disabled={targetDataSource === "scto"}
                    >
                      <span>
                        {" "}
                        I want to start afresh ( This action will delete
                        previously uploaded targets as well as assignments.){" "}
                      </span>
                    </Radio>
                  </Space>
                </Radio.Group>
              </Modal>
            </>
          ) : null}
          {screenMode === "reupload" ? (
            <TargetsReupload setScreenMode={setScreenMode} />
          ) : null}
          {screenMode === "remap" ? (
            <TargetsRemap setScreenMode={setScreenMode} />
          ) : null}
          {screenMode === "config" ? (
            <TargetsHomeFormWrapper>
              <div style={{ textAlign: "left", marginTop: 50 }}>
                <p style={{ fontSize: 16, fontWeight: 500 }}>
                  Target configurations are complete.
                </p>
                <p style={{ fontSize: 16 }}>
                  Targets will be loaded on this screen shortly.
                </p>
                <p style={{ fontSize: 16 }}>
                  If you experience any delays, please contact the SurveyStream
                  team.
                </p>
              </div>
            </TargetsHomeFormWrapper>
          ) : null}
        </div>
      )}
    </>
  );
}

export default TargetsHome;
