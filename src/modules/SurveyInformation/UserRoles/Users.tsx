import {
  Button,
  Checkbox,
  Col,
  Dropdown,
  Form,
  Input,
  MenuProps,
  Modal,
  Radio,
  Row,
  Select,
  Space,
  message,
} from "antd";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  DescriptionText,
  DescriptionTitle,
  StyledFormItem,
  StyledTooltip,
} from "../SurveyInformation.styled";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { RootState } from "../../../redux/store";
import { setSupervisorRoles } from "../../../redux/userRoles/userRolesSlice";
import {
  getSupervisorRoles,
  postSupervisorRoles,
} from "../../../redux/userRoles/userRolesActions";
import { Key, useEffect, useState } from "react";
import FullScreenLoader from "../../../components/Loaders/FullScreenLoader";
import {
  BodyWrapper,
  MainContainer,
  RolesTable,
  SearchBox,
  UsersTable,
} from "./UserRoles.styled";
import {
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleFilled,
  FileAddOutlined,
  QuestionCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  BackArrow,
  BackLink,
  MainWrapper,
  NavWrapper,
  Title,
} from "../../../shared/Nav.styled";
import {
  FooterWrapper,
  SaveButton,
  ContinueButton,
} from "../../../shared/FooterBar.styled";
import SideMenu from "./SideMenu";
import Header from "../../../components/Header";
import Column from "antd/lib/table/Column";
import { FilterConfirmProps } from "antd/lib/table/interface";

function AddUsers() {
  const { survey_uid } = useParams<{ survey_uid?: string }>() ?? {
    survey_uid: "",
  };
  const [loading, setLoading] = useState(false);

  const supervisorRoles = useAppSelector(
    (state: RootState) => state.userRoles.supervisorRoles
  );
  const isLoading = useAppSelector(
    (state: RootState) => state.userRoles.loading
  );

  const [numRoleFields, setNumRoleFields] = useState(
    supervisorRoles.length !== 0 ? supervisorRoles.length : 1
  );
  const [isAllowedEdit, setIsAllowEdit] = useState<boolean>(true);

  const [paginationPageSize, setPaginationPageSize] = useState<number>(5);

  // Delete confirmation
  const [isOpenDeleteModel, setIsOpenDeleteModel] = useState<boolean>(false);

  const handleGoBack = () => {
    navigate(-1);
  };

  const permissionsTableDataSource: any = [];

  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const activeSurvey = useAppSelector(
    (state: RootState) => state.surveys.activeSurvey
  );

  const { path } = useParams();

  const fetchSupervisorRoles = async () => {
    const res = await dispatch(getSupervisorRoles({ survey_uid: survey_uid }));
    setNumRoleFields(res.payload.length === 0 ? 1 : res.payload.length);
    if (res.payload.length > 0) {
      setIsAllowEdit(false);
      form.setFieldValue("role_0", res.payload[0].role_name);
    } else {
      form.resetFields();
    }
  };
  const handleSelectChange = (value: string) => {
    console.log("value", value);
  };

  const handleFormValuesChange = async () => {
    const formValues = form.getFieldsValue();

    const filteredRoles = Object.keys(formValues).reduce(
      (role: any[], fieldName: string) => {
        const fieldValue = formValues[fieldName];

        if (fieldValue !== undefined && fieldValue !== "") {
          role.push({ role_name: fieldValue });
        }

        return role;
      },
      []
    );
    dispatch(setSupervisorRoles(filteredRoles));
  };

  const renderRolesField = () => {
    const fields = Array.from({ length: numRoleFields }, (_, index) => {
      const role: { role_name?: string; reporting_role_uid?: string } =
        numRoleFields === 1 ? {} : supervisorRoles[index];

      return (
        <StyledFormItem
          key={index}
          required
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 11 }}
          name={`role_${index}`}
          label={<span>Role {index + 1}</span>}
          initialValue={role?.role_name ? role.role_name : ""}
          rules={[
            {
              required: true,
              message: "Please enter a role name",
            },
            {
              validator: (_: any, value: any) => {
                if (
                  value &&
                  Object.values(supervisorRoles).filter(
                    (r: {
                      role_name: any;
                      reporting_role_uid?: string | undefined;
                    }) => r.role_name === value
                  ).length > 1
                ) {
                  return Promise.reject("Please use unique role names!");
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input
            placeholder="Enter role name"
            style={{ width: "100%" }}
            disabled={!isAllowedEdit}
          />
        </StyledFormItem>
      );
    });

    return fields;
  };

  const handleAddRole = () => {
    return form.validateFields().then(() => {
      setNumRoleFields(numRoleFields + 1);
    });
  };
  const handleContinue = async () => {
    try {
      const formValues = form.getFieldsValue();

      console.log("supervisorRoles", supervisorRoles);

      const filteredRoles = Object.keys(formValues).reduce(
        (role: any[], fieldName: string) => {
          const fieldValue = formValues[fieldName];

          if (fieldValue !== undefined && fieldValue !== "") {
            role.push({ role_name: fieldValue });
          }

          return role;
        },
        []
      );

      const updatedRoles = filteredRoles.map((role) => {
        const matchingRole = supervisorRoles.find(
          (filteredRole: { role_name: any }) =>
            filteredRole.role_name === role.role_name
        );

        if (matchingRole) {
          return {
            ...role,
            role_uid: matchingRole.role_uid || null,
            reporting_role_uid: matchingRole.reporting_role_uid || null,
          };
        }
        return {
          ...role,
          role_uid: null,
          reporting_role_uid: null,
        };
      });

      if (updatedRoles.length === 0) {
        message.error("Please fill in at least one role name!");
      } else {
        dispatch(setSupervisorRoles(updatedRoles));
      }

      setLoading(true);

      const supervisorRolesData = updatedRoles;
      if (survey_uid == undefined) {
        message.error(
          "Please check that the survey_uid is provided on the url!"
        );
        return;
      }
      const rolesRes = await dispatch(
        postSupervisorRoles({
          supervisorRolesData: supervisorRolesData,
          surveyUid: survey_uid,
        })
      );

      if (rolesRes.payload.status === false) {
        message.error(rolesRes.payload.message);
        return;
      } else {
        message.success("Roles updated successfully");
      }

      navigate(
        `/survey-information/field-supervisor-roles/hierarchy/${survey_uid}`
      );
    } catch (error) {
      message.error("Please fill in all required fields.");
    } finally {
      setLoading(false);
    }
  };

  const userTableDataSource: any = [];

  // Mock data
  for (let i = 0; i < 500; i++) {
    userTableDataSource.push({
      key: i,
      email: `amit.choudhary${i}@idinsight.org`,
      firstname: "Amit",
      lastname: "Choudhary",
      roles: "Field Manager",
    });
  }

  // Row selection state and handler
  const [selectedRows, setSelectedRows] = useState<any>([]);

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

  const handleSearch = (
    selectedKeys: Key[],
    confirm: {
      (param?: FilterConfirmProps | undefined): void;
      (param?: FilterConfirmProps | undefined): void;
      (): void;
    },
    dataIndex: string
  ) => {
    // confirm();
    // Perform the search logic based on dataIndex
    // This is where you should update your dataSource with filtered data
  };
  const clearFilters = () => {
    console.log("clearFilters");
  };

  const handleReset = (clearFilters: (() => void) | undefined) => {
    // clearFilters();
    // Reset the filters and display the original dataSource
  };

  useEffect(() => {
    fetchSupervisorRoles();
  }, [dispatch]);

  // Mock data
  for (let i = 0; i < 500; i++) {
    permissionsTableDataSource.push({
      key: i,
      permission: "Survey locations",
    });
  }

  const permissionsTableColumn = [
    {
      title: "Permission",
      dataIndex: "permission",
      key: "permission",
    },
    {
      title: "View",
      dataIndex: "view",
      key: "view",
      render: (text: any, record: any) => (
        <span>
          <Checkbox></Checkbox>
        </span>
      ),
    },
    {
      title: "Edit",
      dataIndex: "edit",
      key: "edit",
      render: (text: any, record: any) => (
        <span>
          <Checkbox></Checkbox>
        </span>
      ),
    },
    {
      title: "None",
      dataIndex: "none",
      key: "none",
      render: (text: any, record: any) => (
        <span>
          <Checkbox></Checkbox>
        </span>
      ),
    },
  ];

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
                dataSource={userTableDataSource}
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
                    // Filter options
                    filters={[
                      { text: "Male", value: "male" },
                      { text: "Female", value: "female" },
                    ]}
                    onFilter={(value, record: any) =>
                      record[column.dataIndex] === value
                    }
                    // Search options
                    filterIcon={(filtered) => (
                      <SearchOutlined
                        style={{ color: filtered ? "#1890ff" : undefined }}
                      />
                    )}
                    onFilterDropdownVisibleChange={(visible) => {
                      if (visible) {
                        // Perform any necessary actions when the filter dropdown becomes visible
                      }
                    }}
                    // render={(text, record) => (
                    //   <Space size="middle">
                    //     {text}
                    //     <a href="#">Details</a>
                    //   </Space>
                    // )}
                    // Search logic

                    filterDropdown={(props) => (
                      <div style={{ padding: 8 }}>
                        <Input
                          placeholder={`Search ${column.title}`}
                          // value={props.selectedKeys[0]}
                          // onChange={(e) =>
                          //   props.setSelectedKeys(
                          //     e.target.value ? [e.target.value] : []
                          //   )
                          // }
                          // onPressEnter={() =>
                          //   handleSearch(
                          //     props.selectedKeys,
                          //     props.confirm,
                          //     column.dataIndex
                          //   )
                          // }
                          style={{
                            width: 188,
                            marginBottom: 8,
                            display: "block",
                          }}
                        />
                        <Button
                          type="primary"
                          // onClick={() =>
                          //   handleSearch(
                          //     props.selectedKeys,
                          //     props.confirm,
                          //     column.dataIndex
                          //   )
                          // }
                          icon={<SearchOutlined />}
                          size="small"
                          style={{ width: 90, marginRight: 8 }}
                        >
                          Search
                        </Button>
                        <Button
                          // onClick={() => handleReset(props.clearFilters)}
                          size="small"
                          style={{ width: 90 }}
                        >
                          Reset
                        </Button>
                      </div>
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

export default AddUsers;
function handleEdit(record: any): void {
  throw new Error("Function not implemented.");
}

function handleDuplicate(record: any): void {
  throw new Error("Function not implemented.");
}

function handleDelete(record: any): void {
  throw new Error("Function not implemented.");
}
