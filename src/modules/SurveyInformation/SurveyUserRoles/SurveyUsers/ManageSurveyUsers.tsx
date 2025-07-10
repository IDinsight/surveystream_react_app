import { Button, Dropdown, MenuProps, Modal, message, Tooltip } from "antd";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  DescriptionText,
  DescriptionTitle,
} from "../../SurveyInformation.styled";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { RootState } from "../../../../redux/store";
import { useEffect, useState } from "react";
import FullScreenLoader from "../../../../components/Loaders/FullScreenLoader";
import { BodyWrapper, SearchBox, UsersTable } from "../SurveyUserRoles.styled";
import {
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleFilled,
  FileAddOutlined,
  SearchOutlined,
  ClearOutlined,
} from "@ant-design/icons";
import {
  BackArrow,
  BackLink,
  NavWrapper,
  Title,
  HeaderContainer,
} from "../../../../shared/Nav.styled";
import SideMenu from "../../SideMenu";

import Column from "antd/lib/table/Column";
import {
  getAllUsers,
  putUpdateUser,
} from "../../../../redux/userManagement/userManagementActions";
import { deleteUserHierarchy } from "../../../../redux/userRoles/userRolesActions";
import { getSurveyModuleQuestionnaire } from "../../../../redux/surveyConfig/surveyConfigActions";
import {
  getSurveyLocationGeoLevels,
  getSurveyLocationsLong,
} from "../../../../redux/surveyLocations/surveyLocationsActions";
import { getSurveyBasicInformation } from "../../../../redux/surveyConfig/surveyConfigActions";
import { setEditUser } from "../../../../redux/userManagement/userManagementSlice";
import { getSupervisorRoles } from "../../../../redux/userRoles/userRolesActions";
import { GlobalStyle } from "../../../../shared/Global.styled";
import HandleBackButton from "../../../../components/HandleBackButton";
import UsersCountBox from "../../../../components/UsersCountBox";
import { CustomBtn } from "../../../../shared/Global.styled";

function ManageSurveyUsers() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { survey_uid } = useParams<{ survey_uid?: string }>() ?? {
    survey_uid: "",
  };
  const [userTableDataSource, setUserTableDataSource] = useState<any[]>([]);
  const [selectedRows, setSelectedRows] = useState<any>([]);
  const [paginationPageSize, setPaginationPageSize] = useState<number>(10);
  const [hasSelected, setHasSelected] = useState<boolean>(false);
  const [searchText, setSearchText] = useState("");
  const [filteredUserTableData, setFilteredUserTableData] =
    useState(userTableDataSource);
  const [isOpenDeleteModel, setIsOpenDeleteModel] = useState<boolean>(false);
  const isuserManagementLoading = useAppSelector(
    (state: RootState) => state.userManagement.loading
  );
  const [rolesTableData, setRolesTableData] = useState<any>([]);
  const [mappingCriteriaFields, setMappingCriteriaFields] = useState<any>([]);
  const [locationDetailsField, setLocationDetailsField] = useState<any>([]);
  const [surveyPrimeGeoLocation, setSurveyPrimeGeoLocation] =
    useState<any>("no_location");

  const [filteredInfo, setFilteredInfo] = useState<Record<string, any>>({});
  const [sortedInfo, setSortedInfo] = useState<Record<string, any>>({});

  const [activeUsersCount, setActiveUsersCount] = useState<number>(0);
  const [inactiveUsersCount, setInactiveUsersCount] = useState<number>(0);

  const [loading, setLoading] = useState(false);
  const [isUsersLoading, setisUsersLoading] = useState<boolean>(false);
  const [isBasicInformationLoading, setisBasicInformationLoading] =
    useState<boolean>(false);
  const [isSupervisorRolesLoading, setisSupervisorRolesLoading] =
    useState<boolean>(false);
  const [isLocationDetailsLoading, setisLocationDetailsLoading] =
    useState<boolean>(false);
  const [isModuleQuestionnaireLoading, setisModuleQuestionnaireLoading] =
    useState<boolean>(false);

  const activeSurvey = useAppSelector(
    (state: RootState) => state.surveys.activeSurvey
  );

  const moduleQuestionnaire = useAppSelector(
    (state: RootState) => state.surveyConfig.moduleQuestionnaire
  );
  const surveyLocationGeoLevels = useAppSelector(
    (state: RootState) => state.surveyLocations.surveyLocationGeoLevels
  );
  const { loading: isSideMenuLoading } = useAppSelector(
    (state: RootState) => state.surveyConfig
  );

  const fetchAllUsers = async () => {
    setisUsersLoading(true);
    const usersRes = await dispatch(getAllUsers({ survey_uid }));
    if (usersRes?.payload?.length !== 0) {
      const usersWithKeys = usersRes?.payload?.map(
        (user: any, index: { toString: () => any }) => ({
          ...user,
          key: index.toString(),
          active: user?.status === "Active" ? true : false,
          supervisor: findUserName(user.supervisor_uid, usersRes.payload),
          role_name:
            user.user_admin_survey_names &&
            user.user_admin_survey_names.length > 0
              ? "Survey Admin"
              : user.user_survey_role_names &&
                user.user_survey_role_names.length > 0
              ? user.user_survey_role_names[0]["role_name"]
              : "",
        })
      );

      const activeUsersCount = usersWithKeys.filter(
        (user: any) => user?.status === "Active"
      ).length;
      const inactiveUsersCount = usersWithKeys.filter(
        (user: any) => user?.status !== "Active"
      ).length;
      setUserTableDataSource(usersWithKeys);
      setFilteredUserTableData(usersWithKeys);
      setActiveUsersCount(activeUsersCount);
      setInactiveUsersCount(inactiveUsersCount);
    }
    setisUsersLoading(false);
  };

  const findUserName = (user_uid: string, all_users: any) => {
    const user = all_users?.find((u: any) => u.user_uid === user_uid);
    if (user) {
      return user?.first_name + " " + user?.last_name;
    }
    return "";
  };

  const fetchSurveyBasicInformation = async () => {
    setisBasicInformationLoading(true);
    const surveyBasicInformationRes = await dispatch(
      getSurveyBasicInformation({ survey_uid: survey_uid })
    );
    if (surveyBasicInformationRes?.payload) {
      if (surveyBasicInformationRes.payload?.prime_geo_level_uid !== null) {
        setSurveyPrimeGeoLocation(
          surveyBasicInformationRes.payload?.prime_geo_level_uid
        );
      }
    } else {
      message.error(
        "Could not load survey basic information, kindly reload to try again"
      );
    }
    setisBasicInformationLoading(false);
  };

  const findPrimeGeoLevel = (locationData: any) => {
    let primeGeoLevel = null;
    for (const item of locationData) {
      if (item.geo_level_uid === surveyPrimeGeoLocation) {
        primeGeoLevel = item;
      }
    }

    return primeGeoLevel;
  };

  const fetchSurveyModuleQuestionnaire = async () => {
    setisModuleQuestionnaireLoading(true);
    if (survey_uid) {
      const moduleQQuestionnaireRes = await dispatch(
        getSurveyModuleQuestionnaire({ survey_uid: survey_uid })
      );
      let mapping_criteria_fields: any[] = [];
      if (moduleQQuestionnaireRes?.payload) {
        if (moduleQQuestionnaireRes?.payload?.data?.target_mapping_criteria) {
          mapping_criteria_fields = [
            ...(moduleQQuestionnaireRes?.payload?.data
              ?.target_mapping_criteria || []),
          ];
        }
        if (moduleQQuestionnaireRes?.payload?.data?.surveyor_mapping_criteria) {
          mapping_criteria_fields = [
            ...mapping_criteria_fields,
            ...(moduleQQuestionnaireRes?.payload?.data
              ?.surveyor_mapping_criteria || []),
          ];
        }
        // remove duplicates and "Manual" from the list
        mapping_criteria_fields = mapping_criteria_fields.filter(
          (value, index, array) =>
            array.indexOf(value) === index && array[index] !== "Manual"
        );
        setMappingCriteriaFields(mapping_criteria_fields);
      }
    }
    setisModuleQuestionnaireLoading(false);
  };

  const fetchLocationDetails = async () => {
    setisLocationDetailsLoading(true);
    if (survey_uid) {
      // Get location levels
      const locationlevelsRes = await dispatch(
        getSurveyLocationGeoLevels({ survey_uid: survey_uid })
      );

      if (locationlevelsRes?.payload) {
        const primeGeoLevel = findPrimeGeoLevel(locationlevelsRes?.payload);
        if (primeGeoLevel) {
          const locationRes = await dispatch(
            getSurveyLocationsLong({
              survey_uid: survey_uid,
              geo_level_uid: primeGeoLevel?.geo_level_uid,
            })
          );
          if (locationRes?.payload.length > 0) {
            // filter out the prime geo level locations columns
            const primeGeoLevelLocations: any[] = locationRes?.payload.map(
              (location: any) => ({
                location_uid: location.location_uid,
                location_id: location.location_id,
                location_name: location.location_name,
              })
            );
            setLocationDetailsField([
              {
                title: `${primeGeoLevel.geo_level_name}`,
                key: `location_id_column`,
                values: primeGeoLevelLocations,
              },
            ]);
          }
        }
      }
    }
    setisLocationDetailsLoading(false);
  };

  // Row selection state and handler
  const onSelectChange = (selectedRowKeys: React.Key[], selectedRows: any) => {
    // Only keep the most recently selected row
    const lastSelectedRow = selectedRows[selectedRows.length - 1] || null;

    if (lastSelectedRow) {
      setSelectedRows([lastSelectedRow]);
      setHasSelected(true);
    } else {
      setSelectedRows([]);
      setHasSelected(false);
    }
  };

  const rowSelection = {
    selectedRows,
    onChange: onSelectChange,
    hideSelectAll: true,
    type: "checkbox" as const,
    selectedRowKeys: selectedRows.map((row: any) => row.key),
  };

  // Handler for Edit Data button
  const onDeleteUser = async () => {
    if (!hasSelected) {
      message.error("No row selected for editing");
      return;
    } else if (
      selectedRows[0].user_admin_survey_names &&
      selectedRows[0].user_admin_survey_names.length > 0
    ) {
      // check if there are other survey admins
      const surveyAdmins = userTableDataSource.filter(
        (user: any) =>
          user.user_admin_survey_names &&
          user.user_admin_survey_names?.length > 0
      );
      if (surveyAdmins.length < 2) {
        message.error("Cannot remove the only survey admin from the survey");
        return;
      }
    }
    setIsOpenDeleteModel(true);
  };

  const handleDeleteUser = async () => {
    setLoading(true);
    const selectedUserData = selectedRows[0];

    const rolesToRemove = rolesTableData.filter((r: any) =>
      selectedUserData.roles.includes(r.role_uid)
    );

    selectedUserData.roles = selectedUserData.roles.filter(
      (role: any) => !rolesToRemove.map((r: any) => r.role_uid).includes(role)
    );

    // also reset all survey level details - locations and languages
    selectedUserData.survey_uid = survey_uid;
    selectedUserData.location_uids = [];
    selectedUserData.languages = [];

    if (rolesToRemove.length < 1) {
      //handle survey admin removal
      selectedUserData.is_survey_admin = false;
      selectedUserData.survey_uid = survey_uid
        ? parseInt(survey_uid, 10)
        : null;
    }

    const updateRes = await dispatch(
      putUpdateUser({
        userUId: selectedUserData.user_uid,
        userData: selectedUserData,
      })
    );

    // Remove user from user hierarchy as well
    const deleteHierarchyRes = await dispatch(
      deleteUserHierarchy({
        survey_uid: survey_uid || "",
        user_uid: selectedUserData.user_uid,
      })
    );

    // for all reportees, remove the supervisor_uid
    const reporties = userTableDataSource.filter(
      (user: any) => user.supervisor_uid === selectedUserData.user_uid
    );

    if (reporties.length > 0) {
      for (const reportee of reporties) {
        reportee.supervisor_uid = null;
        await dispatch(
          deleteUserHierarchy({
            survey_uid: survey_uid || "",
            user_uid: reportee.user_uid,
          })
        );
      }
    }

    if (updateRes.payload?.user_data) {
      message.success("User removed from survey successfully");
      setHasSelected(false);
    } else {
      message.error("Failed to remove user from survey, kindly try again");
    }
    fetchAllUsers();
    setIsOpenDeleteModel(false);
    setLoading(false);
  };

  const usersTableColumn = [
    {
      title: "Email ID",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text: any, record: any) => {
        return `${record.first_name} ${record.last_name}`;
      },
      sorter: (a: any, b: any) =>
        `${a.first_name} ${a.last_name}`.localeCompare(
          `${b.first_name} ${b.last_name}`
        ),
    },
    {
      title: "Roles",
      key: "role_name",
      dataIndex: "role_name",
    },
    {
      title: "Supervisor Name",
      key: "supervisor",
      dataIndex: "supervisor",
    },
    ...(mappingCriteriaFields.includes("Gender")
      ? [
          {
            title: "Gender",
            key: "gender",
            dataIndex: "gender",
          },
        ]
      : []),
    ...(mappingCriteriaFields.includes("Location") &&
    locationDetailsField.length > 0
      ? [
          {
            title: locationDetailsField[0]?.title,
            key: locationDetailsField[0]?.key,
            dataIndex: "location_names",
            render: (text: any, record: any) => {
              return record.location_names.join(", ") || "";
            },
            sorter: (a: any, b: any) =>
              a.location_names
                .join(", ")
                .localeCompare(b.location_names.join(", ")),
            width: 200,
          },
        ]
      : []),
    ...(mappingCriteriaFields.includes("Language")
      ? [
          {
            title: "Language",
            dataIndex: "languages",
            key: "languages",
            render: (text: any, record: any) => {
              return record.languages.join(", ");
            },
            sorter: (a: any, b: any) =>
              a.languages.join(", ").localeCompare(b.languages.join(", ")),
            width: 150,
          },
        ]
      : []),
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
  ];

  const addUserOptions: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <Link to={`/survey-information/survey-users/add/${survey_uid}`}>
          Add manually
        </Link>
      ),
    },
    {
      key: "2",
      label: <Link to="">Upload CSV</Link>,
      disabled: true,
    },
  ];

  const filterTableData = (searchValue: any) => {
    const filteredData = userTableDataSource.filter((record) => {
      return Object.values(record).some(
        (value) =>
          value &&
          value.toString().toLowerCase().includes(searchValue.toLowerCase())
      );
    });

    setFilteredUserTableData(filteredData);
  };

  const handleEditUser = () => {
    if (selectedRows.length < 1) {
      message.error("Kindly select user to edit");
      return;
    }
    dispatch(setEditUser({ ...selectedRows[0] }));

    navigate(`/survey-information/survey-users/edit/${survey_uid}`);
  };

  const fetchSupervisorRoles = async () => {
    setisSupervisorRolesLoading(true);
    const res = await dispatch(getSupervisorRoles({ survey_uid: survey_uid }));

    if (Array.isArray(res.payload) && res.payload.length > 0) {
      const transformedData: any[] = (
        Array.isArray(res.payload) ? res.payload : [res.payload]
      ).map((item: any) => ({
        role_uid: item.role_uid,
        role: item.role_name,
        has_reporting_role: item.reporting_role_uid ? true : false,
      }));
      setRolesTableData(transformedData);
    }
    setisSupervisorRolesLoading(false);
  };

  const handleClearFiltersAndSort = async () => {
    setFilteredInfo({});
    setSortedInfo({});
    setSearchText("");
    if (survey_uid) {
      await fetchAllUsers();
    }
  };

  useEffect(() => {
    fetchAllUsers();
    fetchSupervisorRoles();
    fetchSurveyBasicInformation();
    fetchSurveyModuleQuestionnaire();
  }, [survey_uid]);

  useEffect(() => {
    if (
      mappingCriteriaFields.includes("Location") &&
      surveyPrimeGeoLocation !== "no_location"
    ) {
      fetchLocationDetails();
    }
  }, [survey_uid, mappingCriteriaFields, surveyPrimeGeoLocation]);

  const isLoading =
    isUsersLoading ||
    isSupervisorRolesLoading ||
    isBasicInformationLoading ||
    isModuleQuestionnaireLoading ||
    isLocationDetailsLoading ||
    loading ||
    isSideMenuLoading;

  return (
    <>
      <GlobalStyle />

      <NavWrapper>
        <HandleBackButton surveyPage={true}></HandleBackButton>

        <Title>
          {(() => {
            const activeSurveyData = localStorage.getItem("activeSurvey");
            return (
              activeSurvey?.survey_name ||
              (activeSurveyData && JSON.parse(activeSurveyData).survey_name) ||
              ""
            );
          })()}
        </Title>
      </NavWrapper>
      <HeaderContainer>
        <Title>Users</Title>
        <UsersCountBox
          active={activeUsersCount}
          inactive={inactiveUsersCount}
        />
        <div
          style={{ display: "flex", marginLeft: "auto", marginBottom: "15px" }}
        ></div>
        <div style={{ float: "right", marginTop: "0px" }}>
          <SearchBox
            placeholder="Search"
            enterButton
            style={{ width: 367 }}
            onSearch={(val) => {
              setSearchText(val);
              filterTableData(val);
            }}
            onChange={(e) => {
              const { value } = e.target;
              setSearchText(value);
              filterTableData(value);
            }}
          />

          <Dropdown menu={{ items: addUserOptions }} placement="bottomLeft">
            <CustomBtn
              style={{
                marginLeft: "20px",
              }}
              onClick={() =>
                navigate(`/survey-information/survey-users/add/${survey_uid}`)
              }
            >
              Add
            </CustomBtn>
          </Dropdown>
          <>
            <CustomBtn
              style={{
                marginLeft: "15px",
                backgroundColor: "#2F54EB",
              }}
              disabled={!hasSelected}
              onClick={handleEditUser}
            >
              Edit
            </CustomBtn>
            <CustomBtn
              style={{
                marginLeft: "15px",
                backgroundColor: "#2F54EB",
              }}
              disabled={!hasSelected}
              onClick={onDeleteUser}
            >
              Remove
            </CustomBtn>
            <Tooltip title="Clear sort and filters">
              <Button
                onClick={handleClearFiltersAndSort}
                style={{
                  cursor: "pointer",
                  marginLeft: 15,
                  padding: "8px 16px",
                  borderRadius: "5px",
                  fontSize: "14px",
                }}
                disabled={
                  Object.keys(filteredInfo).length === 0 &&
                  Object.keys(sortedInfo).length === 0 &&
                  searchText === ""
                }
                icon={<ClearOutlined />}
              />
            </Tooltip>
          </>
        </div>
      </HeaderContainer>
      {isuserManagementLoading || isLoading ? (
        <FullScreenLoader />
      ) : (
        <>
          <div style={{ display: "flex" }}>
            <SideMenu />
            <BodyWrapper>
              <UsersTable
                dataSource={filteredUserTableData}
                rowSelection={rowSelection}
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
                onChange={(pagination, filters, sorter) => {
                  setFilteredInfo(filters);
                  setSortedInfo(sorter);
                }}
              >
                {usersTableColumn.map((column) => (
                  <Column
                    key={column.dataIndex}
                    title={column.title}
                    dataIndex={column.dataIndex}
                    render={column.render}
                    width={column?.width}
                    sorter={
                      column?.sorter
                        ? column.sorter
                        : (a: any, b: any) =>
                            a[column.dataIndex] && b[column.dataIndex]
                              ? a[column.dataIndex].localeCompare(
                                  b[column.dataIndex]
                                )
                              : a[column.dataIndex]
                              ? -1
                              : 1
                    }
                    filterSearch={true}
                    onFilter={(value, record: any) => {
                      if (
                        column.dataIndex === "location_names" &&
                        record[column.dataIndex] &&
                        Array.isArray(record[column.dataIndex])
                      ) {
                        return record[column.dataIndex]
                          .map((v: any) => v.trim())
                          .includes(value);
                      } else if (column.dataIndex === "languages") {
                        return record[column.dataIndex]
                          .map((v: any) => v.trim())
                          .includes(value);
                      } else if (column.dataIndex === "name") {
                        return (
                          `${record.first_name} ${record.last_name}` === value
                        );
                      } else {
                        return record[column.dataIndex] === value;
                      }
                    }}
                    filters={Array.from(
                      new Set(
                        userTableDataSource
                          .flatMap((item: any) => {
                            if (
                              ["location_names", "languages"].includes(
                                column.dataIndex
                              ) &&
                              item[column.dataIndex]
                            ) {
                              return item[column.dataIndex].map((v: any) =>
                                v.trim()
                              );
                            }
                            if (column.dataIndex === "name")
                              return [`${item.first_name} ${item.last_name}`];
                            return item[column.dataIndex];
                          })
                          .filter(
                            (item: any) =>
                              item !== null && item !== undefined && item !== ""
                          )
                      )
                    ).map((value: any) => ({
                      text: value,
                      value: value,
                    }))}
                  />
                ))}
              </UsersTable>

              <Modal
                open={isOpenDeleteModel}
                title={
                  <div
                    style={{
                      display: "flex",
                      marginTop: "-15px",
                      marginBottom: "-10px",
                    }}
                  >
                    <ExclamationCircleFilled
                      style={{ color: "orange", fontSize: 20 }}
                    />
                    <p style={{ marginLeft: "15px" }}>Deletion Confirmation</p>
                  </div>
                }
                okText="Yes, remove user"
                onOk={() => handleDeleteUser()} // Write the logic to delete
                onCancel={() => setIsOpenDeleteModel(false)}
              >
                <p style={{ marginBottom: "30px" }}>
                  Are you sure you want to remove this user from the survey?
                </p>
              </Modal>
            </BodyWrapper>
          </div>
        </>
      )}
    </>
  );
}

export default ManageSurveyUsers;
