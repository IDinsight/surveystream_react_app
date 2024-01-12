import { Button, Dropdown, Input, MenuProps, Modal, message } from "antd";
import { Link, useNavigate, useParams } from "react-router-dom";
import { DescriptionText, DescriptionTitle } from "../SurveyInformation.styled";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { RootState } from "../../../redux/store";
import { Key, useEffect, useState } from "react";
import FullScreenLoader from "../../../components/Loaders/FullScreenLoader";
import { BodyWrapper, SearchBox, UsersTable } from "./UserRoles.styled";
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
} from "../../../shared/Nav.styled";
import SideMenu from "./SideMenu";
import Header from "../../../components/Header";
import Column from "antd/lib/table/Column";
import { FilterConfirmProps } from "antd/lib/table/interface";
import { getAllUsers } from "../../../redux/userManagement/userManagementActions";

function SurveyUsers() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { survey_uid } = useParams<{ survey_uid?: string }>() ?? {
    survey_uid: "",
  };
  const [userTableDataSource, setUserTableDataSource] = useState<any[]>([]);
  const [selectedRows, setSelectedRows] = useState<any>([]);
  const [paginationPageSize, setPaginationPageSize] = useState<number>(15);
  const [searchText, setSearchText] = useState("");
  const [filteredUserTableData, setFilteredUserTableData] =
    useState(userTableDataSource);
  const [isOpenDeleteModel, setIsOpenDeleteModel] = useState<boolean>(false);
  const isLoading = useAppSelector(
    (state: RootState) => state.userRoles.loading
  );

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
          key: index.toString(), // or use a unique identifier if available, like user_id
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
  };

  const rowSelection = {
    selectedRows,
    onChange: onSelectChange,
  };
  const hasSelected = selectedRows.length > 0;

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
      dataIndex: "user_role_names",
      key: "user_role_names",
    },
  ];

  const addUserOptions: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <Link to="/survey-information/user-roles/add-users/">Add manually</Link>
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

  const clearFilters = () => {
    // Clear the filters and display the original dataSource
    setFilteredUserTableData(userTableDataSource);
  };

  const handleReset = (clearFilters: (() => void) | undefined) => {
    clearFilters?.();
  };

  useEffect(() => {
    fetchAllUsers();
  }, [dispatch]);

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
                          `/survey-information/user-roles/add-user/${survey_uid}`
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
                        onClick={() =>
                          navigate(
                            `/survey-information/user-roles/edit-user/${survey_uid}`
                          )
                        }
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
                    <p style={{ marginLeft: "10px" }}>Delete the user</p>
                  </div>
                }
                okText="Yes, delete user"
                onOk={() => setIsOpenDeleteModel(false)} // Write the logic to delete
                onCancel={() => setIsOpenDeleteModel(false)}
              >
                <p>Are you sure you want to delete this user?</p>
              </Modal>
            </BodyWrapper>
          </div>
        </>
      )}
    </>
  );
}

export default SurveyUsers;
