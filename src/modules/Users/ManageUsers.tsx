import { Link, useNavigate } from "react-router-dom";
import { Button, Dropdown, MenuProps, Modal, message } from "antd";
import {
  CloudUploadOutlined,
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import FullScreenLoader from "../../components/Loaders/FullScreenLoader";
import Header from "../../components/Header";
import NavItems from "../../components/NavItems";
import Footer from "../../components/Footer";
import {
  BodyWrapper,
  DescriptionText,
  MainContainer,
  SearchBox,
  UsersTable,
} from "./Users.styled";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  deleteUser,
  getAllUsers,
} from "../../redux/userManagement/userManagementActions";
import { RootState } from "../../redux/store";
import Column from "antd/lib/table/Column";
import { setEditUser } from "../../redux/userManagement/userManagementSlice";

function UsersManage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const isLoading = useAppSelector(
    (state: RootState) => state.userManagement.loading
  );
  const [userTableDataSource, setUserTableDataSource] = useState<any[]>([]);
  const [searchText, setSearchText] = useState("");
  const [filteredUserTableData, setFilteredUserTableData] =
    useState(userTableDataSource);
  const [selectedRows, setSelectedRows] = useState<any>([]);
  const [paginationPageSize, setPaginationPageSize] = useState<number>(20);
  const [hasSelected, setHasSelected] = useState<boolean>(false);

  // Delete confirmation
  const [isOpenDeleteModel, setIsOpenDeleteModel] = useState<boolean>(false);

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
      key: "user_roles",
      dataIndex: "user_roles",
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
      label: <Link to="/users/add">Add manually</Link>,
    },
    {
      key: "2",
      label: <Link to="/users/add">Upload CSV</Link>,
      disabled: true,
    },
  ];

  const fetchAllUsers = async () => {
    const usersRes = await dispatch(getAllUsers({}));
    if (usersRes?.payload?.length !== 0) {
      const usersWithKeys = usersRes?.payload?.map(
        (user: any, index: { toString: () => any }) => {
          const roles = user?.user_role_names || [];
          const surveys = user?.user_survey_names || [];

          const superAdminRole = user.is_super_admin ? "[Super Admin]" : "";

          let surveyAdminRole = "";

          if (user.user_admin_surveys.length > 0) {
            if (user.user_admin_survey_names.length > 0) {
              for (const survey_name of user.user_admin_survey_names) {
                surveyAdminRole = `${surveyAdminRole} [Survey Admin, ${survey_name}]`;
              }
            } else {
              surveyAdminRole = `[Survey Admin]`;
            }
          }

          const userRoles =
            roles.length > 0
              ? [
                  superAdminRole,
                  surveyAdminRole,
                  ...roles.map((role: any, i: any) => {
                    if (role !== null) {
                      return `[${role}, ${surveys[i]}]`;
                    }
                  }),
                ]
                  .filter(Boolean) // Remove empty strings from the array
                  .join(", ")
              : [superAdminRole, surveyAdminRole].filter(Boolean).join(", ");

          return {
            ...user,
            key: index.toString(),
            user_roles: userRoles,
          };
        }
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

    const isUserDeletable = true;
    if (!isUserDeletable) {
      message.warning("User cannot be deleted as they have active projects");
      return;
    }

    setIsOpenDeleteModel(true);
  };

  const handleDeleteUser = async () => {
    selectedRows.forEach(async (row: any) => {
      const selectedUserData = row;
      const deleteRes = await dispatch(
        deleteUser({
          user_uid: selectedUserData.user_uid,
        })
      );
      if (deleteRes.payload?.message) {
        fetchAllUsers();
        message.success("User removed from the system successfully");
        setHasSelected(false);
      } else {
        message.error(
          "User cannot be deleted from the system,kindly check active projects."
        );
        console.log("error", deleteRes.payload);
      }
    });
    setIsOpenDeleteModel(false);
  };

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
    if (selectedRows.length > 1) {
      message.error("Kindly select only one user to edit");
      return;
    }

    if (selectedRows.length < 1) {
      message.error("Kindly select user to edit");
      return;
    }
    dispatch(setEditUser({ ...selectedRows[0] }));

    navigate(`/users/edit/`);
  };

  useEffect(() => {
    fetchAllUsers();
  }, [dispatch]);

  return (
    <>
      <Header items={NavItems} />
      {isLoading ? (
        <FullScreenLoader />
      ) : (
        <>
          <BodyWrapper>
            <MainContainer>
              <div style={{ display: "flex" }}>
                <DescriptionText style={{ marginRight: "auto" }}>
                  Users
                </DescriptionText>
                <div style={{ display: "flex" }}>
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
                        icon={<CloudUploadOutlined />}
                        style={{
                          marginLeft: "25px",
                          backgroundColor: "#2F54EB",
                        }}
                        onClick={() => navigate(`/users/add`)}
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
                          Delete
                        </Button>
                      </>
                    )}
                  </Dropdown>
                </div>
              </div>
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
                    sorter={{
                      compare: (a: any, b: any) =>
                        a[column.key] - b[column.key],
                    }}
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
                    <p style={{ marginLeft: "10px" }}>Delete the user</p>
                  </div>
                }
                okText="Yes, delete user"
                onOk={() => handleDeleteUser()} // Write the logic to delete
                onCancel={() => setIsOpenDeleteModel(false)}
              >
                <p>Are you sure you want to delete this user?</p>
              </Modal>
            </MainContainer>
          </BodyWrapper>
        </>
      )}
      <Footer />
    </>
  );
}

export default UsersManage;
