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
  getAllPermissions,
  getSupervisorRoles,
  postSupervisorRoles,
} from "../../../redux/userRoles/userRolesActions";
import {
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactNode,
  ReactPortal,
  useEffect,
  useState,
} from "react";
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
  QuestionCircleOutlined,
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
import PermissionsTable from "../../../components/PermissionsTable";

function AddRoles() {
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

  // Delete confirmation
  const [isOpenDeleteModel, setIsOpenDeleteModel] = useState<boolean>(false);

  const [allPermissions, setAllPermissions] = useState<any>([]);

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

  const fetchAllPermissions = async () => {
    const res = await dispatch(getAllPermissions());
    console.log("getAllPermissions", res.payload);
    setAllPermissions(res.payload);
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
  const handlePermissionsChange = async () => {
    console.log("chnages wooo");
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

  // Row selection state and handler
  const [selectedRows, setSelectedRows] = useState<any>([]);

  const onSelectChange = (selectedRowKeys: React.Key[], selectedRows: any) => {
    const selectedEmails = selectedRows.map((row: any) => row.email);

    const selectedUserData = permissionsTableDataSource?.filter((row: any) =>
      selectedEmails.includes(row.email)
    );

    setSelectedRows(selectedUserData);
  };

  useEffect(() => {
    fetchAllPermissions();
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
              <DescriptionTitle>Roles</DescriptionTitle>
              <DescriptionText style={{ marginRight: "auto" }}>
                Create new role
              </DescriptionText>

              <div style={{ display: "flex" }}></div>

              <Form form={form} onValuesChange={handleFormValuesChange}>
                <Row gutter={36} style={{ marginBottom: "30px" }}>
                  <Col span={12}>
                    <StyledFormItem
                      label="Role name"
                      labelAlign="right"
                      name="role_name"
                      style={{ display: "block" }}
                      rules={[
                        {
                          required: true,
                          message: "Please enter a role name",
                        },
                      ]}
                    >
                      <Input style={{ width: "100%" }} />
                    </StyledFormItem>

                    <StyledFormItem
                      label="Does this role report to someone?"
                      labelAlign="right"
                      labelCol={{ span: 24 }}
                      style={{ display: "block" }}
                      rules={[
                        {
                          required: true,
                          message:
                            "Please select if the role has a reporting role",
                        },
                      ]}
                    >
                      <Radio.Group style={{ display: "flex", width: "100px" }}>
                        <Radio.Button value={true}>Yes</Radio.Button>
                        <Radio.Button value={false}>No</Radio.Button>
                      </Radio.Group>
                    </StyledFormItem>

                    <StyledFormItem
                      label="Reporting role"
                      labelAlign="right"
                      name="reporting_role"
                      rules={[
                        {
                          validator: (_: any, value: string | undefined) => {
                            // Create a mapping of role_uid to reporting_role_uids
                            const rolesMap: { [key: string]: string[] } =
                              supervisorRoles.reduce(
                                (
                                  map: { [x: string]: any[] },
                                  role: {
                                    role_uid: any;
                                    reporting_role_uid: any;
                                  }
                                ) => {
                                  const { role_uid, reporting_role_uid } = role;
                                  if (reporting_role_uid !== null) {
                                    if (!map[reporting_role_uid]) {
                                      map[reporting_role_uid] = [];
                                    }
                                    map[reporting_role_uid].push(role_uid);
                                  }
                                  return map;
                                },
                                {} as { [key: string]: string[] }
                              );

                            const hasCycle = (
                              node: string,
                              visited: string[] = []
                            ) => {
                              visited.push(node);

                              const children = rolesMap[node] || [];

                              for (let i = 0; i < children.length; i++) {
                                const child = children[i];

                                if (visited.includes(child)) {
                                  return true; // Cycle detected
                                }

                                if (hasCycle(child, [...visited])) {
                                  return true; // Cycle detected in child subtree
                                }
                              }

                              return false; // No cycle detected
                            };

                            if (value === null) {
                              return Promise.resolve();
                            }

                            // if (value && value === role.role_uid) {
                            //   return Promise.reject(
                            //     "A role cannot report to itself!"
                            //   );
                            // }

                            // if (
                            //   value &&
                            //   supervisorRoles.some(
                            //     (r) =>
                            //       r.reporting_role_uid === value && r !== role
                            //   )
                            // ) {
                            //   return Promise.reject(
                            //     "Please select a unique reporting role!"
                            //   );
                            // }
                            // if (role.role_uid && hasCycle(role.role_uid)) {
                            //   return Promise.reject(
                            //     "Role hierarchy cycle detected!"
                            //   );
                            // }
                            return Promise.resolve();
                          },
                        },
                      ]}
                    >
                      <Select
                        showSearch={true}
                        allowClear={true}
                        placeholder="Select reporting role"
                        style={{ width: "100%" }}
                        onChange={(value) => handleSelectChange(value)}
                      >
                        <Select.Option value={null}>
                          No reporting role
                        </Select.Option>
                        {supervisorRoles.map(
                          (
                            r: {
                              role_uid: any;
                              role_name:
                                | string
                                | number
                                | boolean
                                | ReactElement<
                                    any,
                                    string | JSXElementConstructor<any>
                                  >
                                | Iterable<ReactNode>
                                | ReactPortal
                                | null
                                | undefined;
                            },
                            i: Key | null | undefined
                          ) => (
                            <Select.Option key={i} value={r.role_uid}>
                              {r.role_name}
                            </Select.Option>
                          )
                        )}
                      </Select>
                    </StyledFormItem>
                  </Col>
                </Row>

                <DescriptionTitle>Role permissions</DescriptionTitle>
                <DescriptionText style={{ marginRight: "auto" }}>
                  Please select the respective permission by selecting edit,
                  view or none against the permission{" "}
                </DescriptionText>

                <PermissionsTable
                  permissions={allPermissions}
                  onPermissionsChange={handlePermissionsChange}
                />
              </Form>

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

export default AddRoles;
function handleEdit(record: any): void {
  throw new Error("Function not implemented.");
}

function handleDuplicate(record: any): void {
  throw new Error("Function not implemented.");
}

function handleDelete(record: any): void {
  throw new Error("Function not implemented.");
}
