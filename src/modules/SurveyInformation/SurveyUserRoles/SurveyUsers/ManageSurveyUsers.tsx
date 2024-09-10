import { Button, Dropdown, MenuProps, Modal, message } from "antd";
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
} from "@ant-design/icons";
import {
  BackArrow,
  BackLink,
  NavWrapper,
  Title,
} from "../../../../shared/Nav.styled";
import SideMenu from "../SideMenu";
import Header from "../../../../components/Header";
import Column from "antd/lib/table/Column";
import {
  getAllUsers,
  putUpdateUser,
} from "../../../../redux/userManagement/userManagementActions";
import { getSurveyModuleQuestionnaire } from "../../../../redux/surveyConfig/surveyConfigActions";
import { getSurveyLocationGeoLevels } from "../../../../redux/surveyLocations/surveyLocationsActions";
import { getSurveyBasicInformation } from "../../../../redux/surveyConfig/surveyConfigActions";
import { setEditUser } from "../../../../redux/userManagement/userManagementSlice";
import { getSupervisorRoles } from "../../../../redux/userRoles/userRolesActions";
import { GlobalStyle } from "../../../../shared/Global.styled";
import HandleBackButton from "../../../../components/HandleBackButton";
import { render } from "@testing-library/react";
import { each } from "cypress/types/bluebird";

function ManageSurveyUsers() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { survey_uid } = useParams<{ survey_uid?: string }>() ?? {
    survey_uid: "",
  };
  const [userTableDataSource, setUserTableDataSource] = useState<any[]>([]);
  const [selectedRows, setSelectedRows] = useState<any>([]);
  const [paginationPageSize, setPaginationPageSize] = useState<number>(25);
  const [hasSelected, setHasSelected] = useState<boolean>(false);
  const [searchText, setSearchText] = useState("");
  const [filteredUserTableData, setFilteredUserTableData] =
    useState(userTableDataSource);
  const [isOpenDeleteModel, setIsOpenDeleteModel] = useState<boolean>(false);
  const isLoading = useAppSelector(
    (state: RootState) => state.userManagement.loading
  );
  const [rolesTableData, setRolesTableData] = useState<any>([]);
  const [locationDetailsField, setLocationDetailsField] = useState<any>([]);
  const [surveyPrimeGeoLocation, setSurveyPrimeGeoLocation] =
    useState<any>("no_location");

  const activeSurvey = useAppSelector(
    (state: RootState) => state.surveys.activeSurvey
  );

  const moduleQuestionnaire = useAppSelector(
    (state: RootState) => state.surveyConfig.moduleQuestionnaire
  );
  const surveyLocationGeoLevels = useAppSelector(
    (state: RootState) => state.surveyLocations.surveyLocationGeoLevels
  );

  const fetchAllUsers = async () => {
    const usersRes = await dispatch(getAllUsers({ survey_uid }));
    if (usersRes?.payload?.length !== 0) {
      const usersWithKeys = usersRes?.payload?.map(
        (user: any, index: { toString: () => any }) => ({
          ...user,
          key: index.toString(),
          active: user?.status === "Active" ? true : false,
          supervisor: findUserName(user.supervisor_uid, usersRes.payload),
        })
      );

      setUserTableDataSource(usersWithKeys);
      setFilteredUserTableData(usersWithKeys);
    }
  };

  const findUserName = (user_uid: string, all_users: any) => {
    const user = all_users?.find((u: any) => u.user_uid === user_uid);
    if (user) {
      return user?.first_name + " " + user?.last_name;
    }
    return "";
  };

  const fetchSurveyBasicInformation = async () => {
    const surveyBasicInformationRes = await dispatch(
      getSurveyBasicInformation({ survey_uid: survey_uid })
    );
    if (surveyBasicInformationRes?.payload) {
      if (surveyBasicInformationRes.payload?.prime_geo_level_uid !== null) {
        console.log(
          "surveyBasicInformationRes.payload?.prime_geo_level_uid",
          surveyBasicInformationRes.payload?.prime_geo_level_uid
        );
        setSurveyPrimeGeoLocation(
          surveyBasicInformationRes.payload?.prime_geo_level_uid
        );
      }
    } else {
      message.error(
        "Could not load survey basic information, kindly reload to try again"
      );
    }
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
    if (survey_uid) {
      const moduleQQuestionnaireRes = await dispatch(
        getSurveyModuleQuestionnaire({ survey_uid: survey_uid })
      );

      if (moduleQQuestionnaireRes?.payload) {
        let location_required = false;
        if (moduleQQuestionnaireRes?.payload?.data?.target_mapping_criteria) {
          if (
            moduleQQuestionnaireRes?.payload?.data?.target_mapping_criteria.includes(
              "Location"
            )
          ) {
            location_required = true;
          }
        }
        if (moduleQQuestionnaireRes?.payload?.data?.surveyor_mapping_criteria) {
          if (
            moduleQQuestionnaireRes?.payload?.data?.surveyor_mapping_criteria.includes(
              "Location"
            )
          ) {
            location_required = true;
          }
        }

        if (location_required) {
          // use lowest geo level for target mapping location
          const locationRes = await dispatch(
            getSurveyLocationGeoLevels({ survey_uid: survey_uid })
          );

          const locationData = locationRes?.payload;

          const primeGeoLevel = findPrimeGeoLevel(locationData);

          if (primeGeoLevel?.geo_level_name) {
            setLocationDetailsField([
              {
                title: `${primeGeoLevel.geo_level_name} ID`,
                key: `location_id_column`,
              },
            ]);
          }
        }
      }
    }
  };

  // Row selection state and handler
  const onSelectChange = (selectedRowKeys: React.Key[], selectedRows: any) => {
    const selectedEmails = selectedRows.map((row: any) => row.email);

    const selectedUserData = userTableDataSource?.filter((row: any) =>
      selectedEmails.includes(row.email)
    );

    setSelectedRows(selectedUserData);

    if (selectedRows.length > 0) {
      setHasSelected(true);
    } else {
      setHasSelected(false);
    }
  };

  const rowSelection = {
    selectedRows,
    onChange: onSelectChange,
  };

  // Handler for Edit Data button
  const onDeleteUser = async () => {
    if (!hasSelected) {
      message.error("No row selected for editing");
      return;
    }
    setIsOpenDeleteModel(true);
  };

  const handleDeleteUser = async () => {
    const selectedUserData = selectedRows[0];

    const rolesToRemove = rolesTableData.filter((r: any) =>
      selectedUserData.roles.includes(r.role_uid)
    );

    selectedUserData.roles = selectedUserData.roles.filter(
      (role: any) => !rolesToRemove.map((r: any) => r.role_uid).includes(role)
    );

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
    if (updateRes.payload?.user_data) {
      message.success("User removed from project successfully");
      setHasSelected(false);
    } else {
      message.error("Failed to remove user from project, kindly try again");
    }
    fetchAllUsers();
    setIsOpenDeleteModel(false);
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
    },
    {
      title: "Roles",
      key: "user_survey_role_names",
      dataIndex: "user_survey_role_names",
      render: (text: any, record: any) => {
        if (
          record.user_admin_survey_names &&
          record.user_admin_survey_names.length > 0
        ) {
          return <>{`Survey Admin`}</>;
        } else if (
          record.user_survey_role_names &&
          record.user_survey_role_names.length > 0
        ) {
          return <>{record.user_survey_role_names[0]["role_name"]}</>;
        } else {
          return <>{``}</>;
        }
      },
    },
    {
      title: "Supervisor Name",
      key: "supervisor",
      dataIndex: "supervisor",
    },
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
  };

  useEffect(() => {
    fetchAllUsers();
    fetchSupervisorRoles();
    fetchSurveyBasicInformation();
    fetchSurveyModuleQuestionnaire();
  }, []);

  return (
    <>
      <GlobalStyle />
      <Header />
      <NavWrapper>
        <HandleBackButton></HandleBackButton>

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
      {isLoading ? (
        <FullScreenLoader />
      ) : (
        <>
          <div style={{ display: "flex" }}>
            <SideMenu />
            <BodyWrapper>
              <DescriptionTitle>Users</DescriptionTitle>
              <DescriptionText style={{ marginRight: "auto" }}>
                Manage your survey users
              </DescriptionText>
              <div style={{ float: "right", marginTop: "-60px" }}>
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
                <Dropdown
                  menu={{ items: addUserOptions }}
                  placement="bottomLeft"
                >
                  {!hasSelected ? (
                    <Button
                      type="primary"
                      icon={<FileAddOutlined />}
                      style={{
                        marginLeft: "25px",
                        backgroundColor: "#2F54EB",
                      }}
                      onClick={() =>
                        navigate(
                          `/survey-information/survey-users/add/${survey_uid}`
                        )
                      }
                    >
                      Add new user
                    </Button>
                  ) : (
                    <>
                      <Button
                        type="primary"
                        icon={<EditOutlined />}
                        style={{
                          marginLeft: "25px",
                          backgroundColor: "#2F54EB",
                        }}
                        onClick={handleEditUser}
                      >
                        Edit user
                      </Button>
                      <Button
                        type="primary"
                        icon={<DeleteOutlined />}
                        style={{
                          marginLeft: "25px",
                          backgroundColor: "#2F54EB",
                        }}
                        onClick={onDeleteUser}
                      >
                        Remove User
                      </Button>
                    </>
                  )}
                </Dropdown>
              </div>

              <div style={{ display: "flex" }}></div>
              <UsersTable
                dataSource={filteredUserTableData}
                rowSelection={rowSelection}
                pagination={{
                  pageSize: paginationPageSize,
                  pageSizeOptions: [10, 25, 50, 100],
                  showSizeChanger: true,
                  showQuickJumper: true,
                  onShowSizeChange: (_, size) => setPaginationPageSize(size),
                }}
              >
                {usersTableColumn.map((column) => (
                  <Column
                    key={column.dataIndex}
                    title={column.title}
                    dataIndex={column.dataIndex}
                    render={column.render}
                    sorter={{
                      compare: (a: any, b: any) =>
                        a[column.dataIndex] - b[column.dataIndex],
                    }}
                    onFilter={(value, record: any) =>
                      record[column.dataIndex] === value
                    }
                    filterIcon={(filtered) => (
                      <SearchOutlined
                        style={{ color: filtered ? "#1890ff" : undefined }}
                      />
                    )}
                  />
                ))}
              </UsersTable>

              <Modal
                open={isOpenDeleteModel}
                title={
                  <div style={{ display: "flex" }}>
                    <ExclamationCircleFilled
                      style={{ color: "orange", fontSize: 20 }}
                    />
                    <p style={{ marginLeft: "10px" }}>Remove the user</p>
                  </div>
                }
                okText="Yes, remove user"
                onOk={() => handleDeleteUser()} // Write the logic to delete
                onCancel={() => setIsOpenDeleteModel(false)}
              >
                <p>
                  Are you sure you want to remove this user from this project?
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
