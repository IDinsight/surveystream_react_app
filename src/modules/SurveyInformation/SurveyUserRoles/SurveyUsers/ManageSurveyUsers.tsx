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
import { setEditUser } from "../../../../redux/userManagement/userManagementSlice";
import { getSupervisorRoles } from "../../../../redux/userRoles/userRolesActions";

function ManageSurveyUsers() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { survey_uid } = useParams<{ survey_uid?: string }>() ?? {
    survey_uid: "",
  };
  const [userTableDataSource, setUserTableDataSource] = useState<any[]>([]);
  const [selectedRows, setSelectedRows] = useState<any>([]);
  const [paginationPageSize, setPaginationPageSize] = useState<number>(15);
  const [hasSelected, setHasSelected] = useState<boolean>(false);
  const [searchText, setSearchText] = useState("");
  const [filteredUserTableData, setFilteredUserTableData] =
    useState(userTableDataSource);
  const [isOpenDeleteModel, setIsOpenDeleteModel] = useState<boolean>(false);
  const isLoading = useAppSelector(
    (state: RootState) => state.userManagement.loading
  );
  const [rolesTableData, setRolesTableData] = useState<any>([]);

  const activeSurvey = useAppSelector(
    (state: RootState) => state.surveys.activeSurvey
  );

  const handleGoBack = () => {
    navigate(-1);
  };

  const fetchAllUsers = async () => {
    const usersRes = await dispatch(getAllUsers({ survey_uid }));
    if (usersRes?.payload?.length !== 0) {
      const usersWithKeys = usersRes?.payload?.map(
        (user: any, index: { toString: () => any }) => ({
          ...user,
          key: index.toString(),
        })
      );
      setUserTableDataSource(usersWithKeys);
      setFilteredUserTableData(usersWithKeys);
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

    const updateRes = await dispatch(
      putUpdateUser({
        userUId: selectedUserData.user_uid,
        userData: selectedUserData,
      })
    );
    if (updateRes.payload?.user_data) {
      message.success("User removed from project successfully");
      setHasSelected(false);
      fetchAllUsers();
    } else {
      message.error("Failed to remove user from project, kindly try again");
      console.log("error", updateRes.payload);
    }
    setIsOpenDeleteModel(false);
  };

  const usersTableColumn = [
    {
      title: "Email ID",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "First Name",
      dataIndex: "first_name",
      key: "first_name",
    },
    {
      title: "Last Name",
      dataIndex: "last_name",
      key: "last_name",
    },
    {
      title: "Roles",
      key: "user_role_names",
      dataIndex: "user_role_names",
      render: (text: any, record: any) => {
        if (record.user_admin_surveys && record.user_admin_surveys.length > 0) {
          return <>{`Survey Admin`}</>;
        } else {
          return <>{record.user_role_names}</>;
        }
      },
    },
  ];

  const addUserOptions: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <Link to="/survey-information/survey-users/add/">Add manually</Link>
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
    } else {
      console.log("missing roles");
    }
  };

  useEffect(() => {
    fetchAllUsers();
    fetchSupervisorRoles();
  }, []);

  return (
    <>
      <Header />
      <NavWrapper>
        <BackLink onClick={handleGoBack}>
          <BackArrow />
        </BackLink>
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
