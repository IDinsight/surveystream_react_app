import { NavigateFunction, useNavigate, useParams } from "react-router-dom";
import { Key, useCallback, useEffect, useState } from "react";
import FullScreenLoader from "../../components/Loaders/FullScreenLoader";
import Header from "../../components/Header";
import NavItems from "../../components/NavItems";
import {
  CustomTab,
  HeaderContainer,
  SearchBox,
  TextHeading,
} from "./Assignments.styled";
import Container from "../../components/Layout/Container";
import { Button, TabsProps } from "antd";
import {
  ArrowUpOutlined,
  ClearOutlined,
  DownloadOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import NotebooksImg from "./../../assets/notebooks.svg";
import AssignmentsTab from "./AssignmentsTab/AssignmentsTab";
import SurveyorsTab from "./SurveyorsTab/SurveyorsTab";
import TargetsTab from "./TargetsTab/TargetsTab";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  getAssignments,
  getAssignableEnumerators,
  getTableConfig,
  getTargets,
} from "../../redux/assignments/assignmentsActions";
import { getSurveyCTOForm } from "../../redux/surveyCTOInformation/surveyCTOInformationActions";
import AssignmentsStatus from "../../components/AssignmentsStatus";
import { debounce } from "lodash";
import NotFound from "../NotFound";
import { RootState } from "../../redux/store";
import { calculateSearch, getDataFromFilters } from "./utils";

let access_keys: any = {};

function Assignments() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { survey_uid, form_uid } = useParams<{
    survey_uid: string;
    form_uid: string;
  }>();

  // Ensure that the survey_uid are available
  if (!survey_uid) {
    return <NotFound />;
  }

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

  // State variables for component
  const [assignmentsStats, setAssignmentsStats] = useState<{
    completed: number;
    assigned: number;
    unassigned: number;
  }>({
    completed: 0,
    assigned: 0,
    unassigned: 0,
  });
  const [mainData, setMainData] = useState<any>([]);
  const [searchValue, setSearchValue] = useState<string>("");
  const [assignmentsFilter, setAssignmentsFilter] = useState(null);
  const [searchedData, setSearchedData] = useState([]);

  // Assignment's row selection state and handler
  const [selectedAssignmentRows, setSelectedAssignmentRows] = useState<any>([]);
  const [selecteAssignmentdRowKeys, setSelectedAssignmentRowKeys] = useState<
    Key[]
  >([]);

  const onSelectRow = (record: any, selected: any, selectedRow: any) => {
    if (record["target_uid"] !== undefined) {
      const existingKey = selecteAssignmentdRowKeys?.includes(
        record["target_uid"]
      );
      if (existingKey) {
        // if (record.target_assignable) {
        const newRowKeys = selecteAssignmentdRowKeys.filter(
          (k: any) => k !== record["target_uid"]
        );

        setSelectedAssignmentRows(selectedRow);
        setSelectedAssignmentRowKeys(newRowKeys);
        // }
      } else {
        // if (record.target_assignable) {
        setSelectedAssignmentRows(selectedRow);
        setSelectedAssignmentRowKeys([
          ...selecteAssignmentdRowKeys,
          record["target_uid"],
        ]);
        // }
      }
    }
  };

  const rowSelection = {
    selectedAssignmentRows,
    onSelect: onSelectRow,
  };
  const hasRowSelected = selectedAssignmentRows.length > 0;

  // Handle the make assignments button
  const handleMakeAssignments = () => {
    navigate(
      `/module-configuration/assignments/${survey_uid}/${form_uid}/create`,
      {
        state: { selectedAssignmentRows, formID: form_uid },
      }
    );
  };

  // Clear the search and filter
  const onClear = (): void => {
    setSearchValue("");
    setAssignmentsFilter(null);
    setSearchedData([]);
    setMainData(assignmentsData);
  };

  // Search functionality
  const onSearch = (value: string): void => {
    if (value === "") {
      if (assignmentsFilter) {
        let filterArr = getDataFromFilters(
          assignmentsFilter,
          assignmentsData,
          access_keys
        );

        setMainData(filterArr);
        setSearchedData(filterArr);
        setSearchValue("");
        return;
      }
      setMainData(assignmentsData);
      setSearchedData([]);
      setSearchValue("");
      return;
    }

    // Creating and assigning values to tempArr based on dataFilter
    // tempArr will be pass as the source for calculating search
    let tempArr: any = [];

    if (!assignmentsFilter) {
      tempArr = [...assignmentsData];
    } else {
      tempArr = getDataFromFilters(
        assignmentsFilter,
        assignmentsData,
        access_keys
      );
    }

    const filteredData = calculateSearch(tempArr, value, access_keys);
    console.log(filteredData);
    setMainData(filteredData);
    setSearchedData(filteredData);
  };

  /**
   * Creating a debounce with 350 milliseconds of delay
   * This will ensure that user gets appropriate time to type the keyword
   * and then makes only expensive operations.
   */
  const debounceCallback = useCallback(debounce(onSearch, 350), [
    assignmentsData,
  ]);
  const debounceSearch = (value: string) => {
    setSearchValue(value);
    debounceCallback(value);
  };

  // Handle the table change
  const handleTableChange = (_pagination: any, filters: any, _sorter: any) => {
    setAssignmentsFilter(filters);

    // Set to true if no filters are active but there are filter keys in the filters object (meaning that filters were selected but then reset)
    const isReset = Object.values(filters).every((value) => {
      if (value === null) return true;
      return false;
    });

    // Create array that will hold all the records we want to filter to
    let filterArr: any = [];

    // Subset our filtering to currently searched records (if applicable)
    if (searchedData?.length) {
      filterArr = getDataFromFilters(filters, searchedData, access_keys);
    } else {
      filterArr = getDataFromFilters(filters, assignmentsData, access_keys);
    }
    setMainData(filterArr);

    if (isReset) {
      setAssignmentsFilter(null);
      if (searchedData?.length && searchValue !== "") {
        const tempArr = calculateSearch(
          assignmentsData,
          searchValue,
          access_keys
        );
        setMainData(tempArr);
      } else {
        setMainData(assignmentsData);
      }
    }
  };

  // Create the tab items
  const tabItems: TabsProps["items"] = [
    {
      key: "1",
      label: "Assignments",
      children: (
        <AssignmentsTab
          mainData={mainData}
          tableConfig={tableConfigData}
          rowSelection={rowSelection}
          filter={assignmentsFilter}
          keyRefs={access_keys}
          handleTableChange={handleTableChange}
        />
      ),
    },
    {
      key: "2",
      label: "Surveyors",
      children: <SurveyorsTab />,
    },
    {
      key: "3",
      label: "Targets",
      children: <TargetsTab />,
    },
  ];

  // Ensure that the form_uid is available
  useEffect(() => {
    if (form_uid == "" || form_uid == undefined) {
      console.log(form);
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
    dispatch(getSurveyCTOForm({ survey_uid }));
    dispatch(getTableConfig({ formUID: form_uid || "" }));
    dispatch(getAssignments({ formUID: form_uid ?? "" }));
    dispatch(getAssignableEnumerators({ formUID: form_uid ?? "" }));
    dispatch(getTargets({ formUID: form_uid ?? "" }));
  }, [form_uid]);

  // Update the main data and stats when the assignments data changes
  useEffect(() => {
    if (assignmentsData.length > 0) {
      setMainData(assignmentsData);

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
    }
  }, [assignmentsData]);

  // Checking if the data is loading
  const isLoading: boolean = tableConfigLoading && assignmentsLoading;

  return (
    <>
      <Header items={NavItems} />
      {isLoading ? (
        <FullScreenLoader />
      ) : (
        <>
          <Container />
          <div>
            <HeaderContainer>
              <TextHeading>Assignments</TextHeading>
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
                style={{ marginLeft: "16px" }}
                disabled={!hasRowSelected}
                onClick={handleMakeAssignments}
              >
                Make assignments
              </Button>
              <Button
                disabled
                icon={<DownloadOutlined />}
                style={{ marginLeft: "16px" }}
              ></Button>
              <Button
                disabled={searchValue === "" && assignmentsFilter === null}
                icon={<ClearOutlined />}
                style={{ marginLeft: "16px" }}
                onClick={onClear}
              ></Button>
            </HeaderContainer>

            {assignmentsData.length > 0 ? (
              <div>
                <CustomTab
                  style={{ paddingLeft: 48, paddingRight: 48 }}
                  defaultActiveKey="1"
                  items={tabItems}
                  onChange={(key) => console.log(key)}
                  tabBarExtraContent={
                    <div style={{ display: "flex" }}>
                      <div
                        style={{
                          display: "flex",
                          color: "#595959",
                          marginRight: 16,
                        }}
                      >
                        <p>
                          Last updated: {form?.last_ingested_at ?? "Unknown"}
                        </p>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          color: "#2F54EB",
                          cursor: "pointer",
                        }}
                        onClick={() => window.open("#")}
                      >
                        <p>Assigning criteria</p>
                        <ArrowUpOutlined
                          style={{ fontSize: 16, transform: "rotate(45deg)" }}
                        />
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
                      fontFamily: "Inter",
                      fontSize: "14px",
                      lineHeight: "22px",
                    }}
                  >
                    Assignments have not yet been uploaded.
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

export default Assignments;
