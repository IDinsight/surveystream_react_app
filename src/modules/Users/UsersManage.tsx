import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Dropdown,
  Input,
  MenuProps,
  Modal,
  Table,
  message,
} from "antd";
import {
  CloudDownloadOutlined,
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

function UsersManage() {
  const navigate = useNavigate();

  const [paginationPageSize, setPaginationPageSize] = useState<number>(5);

  // Delete confirmation
  const [isOpenDeleteModel, setIsOpenDeleteModel] = useState<boolean>(false);

  // This need to be come from redux state
  const isLoading = false;

  const handleGoBack = () => {
    navigate(-1);
  };

  const userTableDataSource: any = [];

  // Mock data
  for (let i = 0; i < 500; i++) {
    userTableDataSource.push({
      key: i,
      email: `amit.choudhary${i}@idinsight.org`,
      firstname: "Amit",
      lastname: "Choudhary",
      roles: "[ADP 2.0, FM], [IEIC, Field Manager]",
      status: "Active",
    });
  }

  // Row selection state and handler
  const [selectedRows, setSelectedRows] = useState<any>([]);

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
      dataIndex: "firstname",
      key: "firstname",
    },
    {
      title: "Last Name",
      dataIndex: "lastname",
      key: "lastname",
    },
    {
      title: "Roles",
      dataIndex: "roles",
      key: "roles",
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
                    onSearch={(val) => console.log(val)}
                    onChange={(e) => console.log(e.target.value)}
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
                rowSelection={rowSelection}
                columns={usersTableColumn}
                dataSource={userTableDataSource}
                pagination={{
                  pageSize: paginationPageSize,
                  pageSizeOptions: [10, 25, 50, 100],
                  showSizeChanger: true,
                  showQuickJumper: true,
                  onShowSizeChange: (_, size) => setPaginationPageSize(size),
                }}
              />
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
            </MainContainer>
          </BodyWrapper>
        </>
      )}
      <Footer />
    </>
  );
}

export default UsersManage;
