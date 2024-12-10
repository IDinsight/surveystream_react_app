import { useNavigate, useParams } from "react-router-dom";
import { Key, useCallback, useEffect, useState } from "react";
import FullScreenLoader from "../../components/Loaders/FullScreenLoader";

import { CustomTab } from "./Assignments.styled";
import Container from "../../components/Layout/Container";
import { Button, TabsProps } from "antd";
import {
  ArrowUpOutlined,
  ClearOutlined,
  UploadOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import NotebooksImg from "./../../assets/notebooks.svg";
import AssignmentsTab from "./AssignmentsTab/AssignmentsTab";
import SurveyorsTab from "./SurveyorsTab/SurveyorsTab";
import TargetsTab from "./TargetsTab/TargetsTab";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  getAssignments,
  getAssignmentEnumerators,
  getTableConfig,
  getAssignmentTargets,
} from "../../redux/assignments/assignmentsActions";
import { getSurveyCTOForm } from "../../redux/surveyCTOInformation/surveyCTOInformationActions";
import AssignmentsStatus from "../../components/AssignmentsStats";
import { debounce } from "lodash";
import NotFound from "../../components/NotFound";
import { RootState } from "../../redux/store";
import { performSearch, getDataFromFilters, makeKeyRefs } from "./utils";
import { IAssignmentsStats } from "./types";
import { ErrorBoundary } from "react-error-boundary";
import ErrorHandler from "../../components/ErrorHandler";
import CSVDownloadButton from "../../components/CSVDownloadButton";
import { GlobalStyle } from "../../shared/Global.styled";
import { HeaderContainer, SearchBox, Title } from "../../shared/Nav.styled";
import { userHasPermission } from "../../utils/helper";

function Assignments() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { survey_uid, form_uid } = useParams<{
    survey_uid: string;
    form_uid: string;
  }>();

  // Fetch the data from the store
  const form = useAppSelector(
    (state: RootState) => state.surveyCTOInformation.surveyCTOForm
  );
  const { loading: tableConfigLoading, data: tableConfigData } = useAppSelector(
    (state: RootState) => state.assignments.tableConfig
  );
  const { loading: assignmentsLoading, data: assignmentsData } = useAppSelector(
    (state: RootState) => state.assignments.assignments
  );
  const { data: enumeratorData, loading: enumeratorLoading } = useAppSelector(
    (state: RootState) => state.assignments.assignmentEnumerators
  );
  const { data: targetData, loading: targetLoading } = useAppSelector(
    (state: RootState) => state.assignments.assignmentTargets
  );

  const userProfile = useAppSelector((state: RootState) => state.auth.profile);
  const canUserUpload = userHasPermission(
    userProfile,
    survey_uid,
    "WRITE Assignments Upload"
  );

  // State variables for component
  const [tabItemIndex, setTabItemIndex] = useState<string>("assignments");
  const [assignmentsStats, setAssignmentsStats] = useState<IAssignmentsStats>({
    completed: 0,
    assigned: 0,
    unassigned: 0,
  });
  const [mainData, setMainData] = useState<any>([]);
  const [searchValue, setSearchValue] = useState<string>("");
  const [dataFilter, setDataFilter] = useState<any>(null);
  const [searchedData, setSearchedData] = useState<any>(null);
  const [keyRefs, setKeyRefs] = useState<any>({});
  const [columns, setColumn] = useState<any>({});

  // Assignment's row selection state and handler
  const [selectedAssignmentRows, setSelectedAssignmentRows] = useState<any>([]);
  const [selecteAssignmentdRowKeys, setSelectedAssignmentRowKeys] = useState<
    Key[]
  >([]);

  const onAssignmentSelect = (record: any, selected: any, selectedRow: any) => {
    if (record["target_uid"] !== undefined) {
      const existingKey = selecteAssignmentdRowKeys?.includes(
        record["target_uid"]
      );
      if (existingKey) {
        if (record.target_assignable) {
          const newRowKeys = selecteAssignmentdRowKeys.filter(
            (k: any) => k !== record["target_uid"]
          );

          setSelectedAssignmentRows(selectedRow);
          setSelectedAssignmentRowKeys(newRowKeys);
        }
      } else {
        if (record.target_assignable) {
          setSelectedAssignmentRows(selectedRow);
          setSelectedAssignmentRowKeys([
            ...selecteAssignmentdRowKeys,
            record["target_uid"],
          ]);
        }
      }
    }
  };

  const onAssignmentSelectAll = (
    selected: boolean,
    selectedRows: any,
    changeRows: any
  ) => {
    if (selected) {
      if (selectedRows.length === changeRows.length) {
        const newSelectedRows = mainData?.filter(
          (row: any) => row.target_assignable
        );
        const newKeys = newSelectedRows.map((row: any) => row["target_uid"]);
        setSelectedAssignmentRowKeys(newKeys);
        setSelectedAssignmentRows(newSelectedRows);
      } else {
        setSelectedAssignmentRowKeys([]);
        setSelectedAssignmentRows([]);
      }
    } else {
      setSelectedAssignmentRowKeys([]);
      setSelectedAssignmentRows([]);
    }
  };

  const rowSelection = {
    selectedAssignmentRows,
    onSelect: onAssignmentSelect,
    onSelectAll: onAssignmentSelectAll,
  };
  const hasRowSelected = selectedAssignmentRows.length > 0;

  // Get the tab data based on the tab item index
  const getTabData = () => {
    switch (tabItemIndex) {
      case "assignments":
        return assignmentsData;
      case "surveyors":
        return enumeratorData;
      case "targets":
        return targetData;
      default:
        return [];
    }
  };

  // Handle the make assignments button
  const handleMakeAssignments = () => {
    navigate(
      `/module-configuration/assignments/${survey_uid}/${form_uid}/create`,
      {
        state: { selectedAssignmentRows, formID: form_uid },
      }
    );
  };

  // Handle the make assignments button
  const handleUploadAssignments = () => {
    navigate(
      `/module-configuration/assignments/${survey_uid}/${form_uid}/upload`
    );
  };

  const resetData = () => {
    setSearchValue("");
    setDataFilter(null);
    setSearchedData(null);
  };

  // Clear the search and filter
  const onClear = (): void => {
    resetData();
    setMainData(getTabData());
  };

  // Search functionality
  const onSearch = (value: string): void => {
    if (value === "") {
      if (dataFilter) {
        const filterArr = getDataFromFilters(dataFilter, getTabData(), keyRefs);

        setMainData(filterArr);
        setSearchedData(filterArr);
        setSearchValue("");
        return;
      }
      setMainData(getTabData());
      setSearchedData(null);
      setSearchValue("");
      return;
    }

    // Creating and assigning values to tempArr based on dataFilter
    // tempArr will be pass as the source for calculating search
    let tempArr: any = [];

    if (!dataFilter) {
      tempArr = [...getTabData()];
    } else {
      tempArr = getDataFromFilters(dataFilter, [...getTabData()], keyRefs);
    }

    const filteredData = performSearch(tempArr, value, keyRefs);
    setMainData(filteredData);
    setSearchedData(filteredData);
  };

  /**
   * Creating a debounce with 350 milliseconds of delay
   * This will ensure that user gets appropriate time to type the keyword
   * and then makes only expensive operations.
   */
  const debounceCallback = useCallback(debounce(onSearch, 350), [
    getTabData(),
    keyRefs,
  ]);
  const debounceSearch = (value: string) => {
    setSearchValue(value);
    debounceCallback(value);
  };

  // Handle the table change
  const handleTableChange = (_pagination: any, filters: any, _sorter: any) => {
    setDataFilter(filters);

    // Set to true if no filters are active but there are filter keys in the filters object (meaning that filters were selected but then reset)
    const isReset = Object.values(filters).every((value) => {
      if (value === null) return true;
      return false;
    });

    // Create array that will hold all the records we want to filter to
    let filterArr: any = [];

    // Subset our filtering to currently searched records (if applicable)
    if (searchedData?.length) {
      filterArr = getDataFromFilters(filters, searchedData, keyRefs);
    } else {
      filterArr = getDataFromFilters(filters, getTabData(), keyRefs);
    }
    setMainData(filterArr);

    if (isReset) {
      setDataFilter(null);
      if (searchedData?.length && searchValue !== "") {
        const tempArr = performSearch(getTabData(), searchValue, keyRefs);
        setMainData(tempArr);
      } else {
        setMainData(getTabData());
      }
    }
  };

  // Ensure that the form_uid is available
  useEffect(() => {
    if (survey_uid == "" || survey_uid == undefined) return;
    if (form_uid == "" || form_uid == undefined) {
      const resp = dispatch(getSurveyCTOForm({ survey_uid }));
      resp.then((res) => {
        const formUid = res.payload[0]?.form_uid;
        if (formUid) {
          navigate(
            `/module-configuration/assignments/${survey_uid}/${formUid}`
          );
        }
      });
    }
  }, []);

  // Dispatch the actions to populate the data
  useEffect(() => {
    if (form_uid == "" || form_uid == undefined) return;
    dispatch(getSurveyCTOForm({ survey_uid }));
    dispatch(
      getTableConfig({ formUID: form_uid || "", filter_supervisors: true })
    );
    dispatch(getAssignments({ formUID: form_uid ?? "" }));
    dispatch(getAssignmentEnumerators({ formUID: form_uid ?? "" }));
    dispatch(getAssignmentTargets({ formUID: form_uid ?? "" }));
  }, [form_uid]);

  // Update the main data and stats when the assignments data changes
  useEffect(() => {
    if (tabItemIndex === "assignments" && assignmentsData.length > 0) {
      setMainData(assignmentsData);

      const keys = makeKeyRefs(tableConfigData?.assignments_main);
      setKeyRefs(keys);

      // Get the number of completed, assigned and unassigned assignments
      let completedAssignments = 0;
      let assignedAssignments = 0;
      let unassignedAssignments = 0;

      assignmentsData.forEach((assignment: any) => {
        if (assignment.completed_flag) {
          completedAssignments++;
          return;
        }

        if (assignment.assigned_enumerator_uid !== null) {
          assignedAssignments++;
        } else {
          unassignedAssignments++;
        }
      });

      // Update the assignments status
      setAssignmentsStats({
        completed: completedAssignments,
        assigned: assignedAssignments,
        unassigned: unassignedAssignments,
      });

      resetData();
    } else if (tabItemIndex === "surveyors" && enumeratorData.length > 0) {
      // Update the main data to the enumerators data
      setMainData(enumeratorData);

      const keys = makeKeyRefs(tableConfigData?.surveyors);
      setKeyRefs(keys);

      resetData();
    } else if (tabItemIndex === "targets" && targetData.length > 0) {
      // Update the main data to the targets data
      setMainData(targetData);

      const keys = makeKeyRefs(tableConfigData?.targets);
      setKeyRefs(keys);

      resetData();
    }
  }, [
    tableConfigData,
    assignmentsData,
    enumeratorData,
    targetData,
    tabItemIndex,
  ]);

  // Create the tab items
  const tabItems: TabsProps["items"] = [
    {
      key: "assignments",
      label: "Assignments",
      children: (
        <AssignmentsTab
          mainData={mainData}
          tableConfig={tableConfigData}
          rowSelection={rowSelection}
          filter={dataFilter}
          handleTableChange={handleTableChange}
          setColumn={setColumn}
        />
      ),
    },
    {
      key: "surveyors",
      label: "Surveyors",
      children: (
        <SurveyorsTab
          mainData={mainData}
          tableConfig={tableConfigData}
          filter={dataFilter}
          handleTableChange={handleTableChange}
          setColumn={setColumn}
        />
      ),
    },
    {
      key: "targets",
      label: "Targets",
      children: (
        <TargetsTab
          mainData={mainData}
          tableConfig={tableConfigData}
          filter={dataFilter}
          handleTableChange={handleTableChange}
          setColumn={setColumn}
        />
      ),
    },
  ];

  const formatDate = (date: any, tz_name: string) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "short",
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      timeZone: "UTC", // UTC is used to get the correct date and time
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

  // Checking if the data is loading
  const isLoading: boolean = tableConfigLoading || assignmentsLoading;

  // Ensure that the survey_uid are available
  if (!survey_uid) {
    return <NotFound />;
  }

  return (
    <>
      <GlobalStyle />

      {isLoading ? (
        <FullScreenLoader />
      ) : (
        <>
          <Container surveyPage={true} />
          <div>
            <HeaderContainer>
              <Title>Assignments</Title>
              {assignmentsData.length > 0 ? (
                <AssignmentsStatus stats={assignmentsStats} />
              ) : null}
              <SearchBox
                placeholder="Search"
                enterButton
                style={{ width: 250, marginLeft: "auto" }}
                value={searchValue}
                onSearch={(val) => debounceSearch(val)}
                onChange={(e) => debounceSearch(e.target.value)}
              />
              <Button
                icon={<UserAddOutlined />}
                style={{ marginLeft: "8px" }}
                disabled={!hasRowSelected}
                onClick={handleMakeAssignments}
              >
                Make assignments
              </Button>
              {canUserUpload && (
                <Button
                  icon={<UploadOutlined />}
                  style={{ marginLeft: "8px" }}
                  onClick={handleUploadAssignments}
                >
                  Upload assignments
                </Button>
              )}
              <CSVDownloadButton
                keyRef={keyRefs}
                columns={columns}
                disabled={mainData?.length === 0}
                tabItemIndex={tabItemIndex}
                data={getTabData()}
                filterData={mainData}
              />
              <Button
                disabled={searchValue === "" && !dataFilter}
                icon={<ClearOutlined />}
                style={{ marginLeft: "16px" }}
                onClick={onClear}
              ></Button>
            </HeaderContainer>

            {getTabData().length > 0 ? (
              <div style={{ backgroundColor: "#f5f5f5", minHeight: "80vh" }}>
                <CustomTab
                  style={{ paddingLeft: 48, paddingRight: 48 }}
                  defaultActiveKey={tabItemIndex}
                  items={tabItems}
                  onChange={(key) => setTabItemIndex(key)}
                  tabBarExtraContent={
                    <div style={{ display: "flex" }}>
                      <div
                        style={{
                          display: "flex",
                          color: "#595959",
                        }}
                      >
                        <p>
                          Last updated on:{" "}
                          {form?.last_ingested_at && form?.tz_name
                            ? formatDate(form.last_ingested_at, form.tz_name)
                            : "NA"}
                        </p>
                      </div>
                    </div>
                  }
                />
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "calc(100vh - 190px)",
                }}
              >
                <div>
                  <img
                    src={NotebooksImg}
                    height={220}
                    width={225}
                    alt="Empty data"
                  />
                  <p
                    style={{
                      color: "#8C8C8C",
                      fontFamily: "Lato",
                      fontSize: "14px",
                      lineHeight: "22px",
                    }}
                  >
                    {tabItemIndex.charAt(0).toUpperCase() +
                      tabItemIndex.slice(1)}{" "}
                    have not yet been uploaded.
                  </p>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}

function AssignmentsWithErrorBoundary() {
  return (
    <ErrorBoundary FallbackComponent={ErrorHandler}>
      <Assignments />
    </ErrorBoundary>
  );
}

export default AssignmentsWithErrorBoundary;
