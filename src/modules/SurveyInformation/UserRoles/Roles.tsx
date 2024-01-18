import { Button, Dropdown, Form, Input, MenuProps, Modal, message } from "antd";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  DescriptionText,
  DescriptionTitle,
  StyledFormItem,
} from "../SurveyInformation.styled";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { RootState } from "../../../redux/store";
import { setSupervisorRoles } from "../../../redux/userRoles/userRolesSlice";
import {
  getSupervisorRoles,
  postSupervisorRoles,
} from "../../../redux/userRoles/userRolesActions";
import { useEffect, useState } from "react";
import FullScreenLoader from "../../../components/Loaders/FullScreenLoader";
import {
  BodyWrapper,
  MainContainer,
  RolesTable,
  SearchBox,
  UsersTable,
} from "./UserRoles.styled";
import {
  CloudUploadOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleFilled,
  FileAddOutlined,
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

function Roles() {
  const { survey_uid } = useParams<{ survey_uid?: string }>() ?? {
    survey_uid: "",
  };
  const [loading, setLoading] = useState(false);

  const supervisorRoles = useAppSelector(
    (state: RootState) => state.filedSupervisorRoles.supervisorRoles
  );
  const isLoading = useAppSelector(
    (state: RootState) => state.filedSupervisorRoles.loading
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

  const rolesTableDataSource: any = [];

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

  const handleEdit = (record: any): void => {
    navigate(`/survey-information/user-roles/edit-role/${survey_uid}`);
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
          (filteredRole) => filteredRole.role_name === role.role_name
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

  useEffect(() => {
    fetchSupervisorRoles();
  }, [dispatch]);

  // Mock data
  for (let i = 0; i < 500; i++) {
    rolesTableDataSource.push({
      key: i,
      role: "Field Manager",
      reporting_role: "N/A",
      users_assigned: i,
    });
  }

  // Row selection state and handler
  const [selectedRows, setSelectedRows] = useState<any>([]);

  const onSelectChange = (selectedRowKeys: React.Key[], selectedRows: any) => {
    const selectedEmails = selectedRows.map((row: any) => row.email);

    const selectedUserData = rolesTableDataSource?.filter((row: any) =>
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

  const rolesTableColumn = [
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Reporting Role",
      dataIndex: "reporting_role",
      key: "reporting_role",
    },
    {
      title: "Users assigned",
      dataIndex: "users_assigned",
      key: "users_assigned",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: (text: any, record: any) => (
        <span>
          <Button type="link" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Button type="link" onClick={() => handleDuplicate(record)}>
            Duplicate
          </Button>

          <Button
            danger
            type="text"
            onClick={() => handleDelete(record)}
            style={{ marginLeft: 8 }}
          >
            Delete
          </Button>
          {/* Add more actions as needed */}
        </span>
      ),
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
              <DescriptionTitle>Roles</DescriptionTitle>
              <DescriptionText style={{ marginRight: "auto" }}>
                Manage the roles related to your survey here
              </DescriptionText>
              <div style={{ float: "right", marginTop: "-60px" }}>
                <Button
                  type="primary"
                  icon={<FileAddOutlined />}
                  style={{
                    marginLeft: "25px",
                    backgroundColor: "#2F54EB",
                  }}
                  onClick={() =>
                    navigate(
                      `/survey-information/user-roles/add-role/${survey_uid}`
                    )
                  }
                >
                  Add new role{" "}
                </Button>
              </div>
              <div style={{ display: "flex" }}></div>
              <RolesTable
                columns={rolesTableColumn}
                dataSource={rolesTableDataSource}
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
            </BodyWrapper>
          </div>

          <FooterWrapper>
            <SaveButton>Save</SaveButton>
            <ContinueButton loading={loading}>Finalize roles</ContinueButton>
          </FooterWrapper>
        </>
      )}
    </>
  );
}

export default Roles;

function handleDuplicate(record: any): void {
  throw new Error("Function not implemented.");
}

function handleDelete(record: any): void {
  throw new Error("Function not implemented.");
}
