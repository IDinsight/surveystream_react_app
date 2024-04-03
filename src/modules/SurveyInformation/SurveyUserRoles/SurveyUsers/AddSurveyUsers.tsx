import { useNavigate, useParams } from "react-router-dom";
import { Button, Form, Input, Select, message } from "antd";
import { useEffect, useState } from "react";
import FullScreenLoader from "../../../../components/Loaders/FullScreenLoader";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import {
  postAddUser,
  postCheckUser,
  putUpdateUser,
} from "../../../../redux/userManagement/userManagementActions";
import { DescriptionText } from "../../SurveyInformation.styled";
import { BodyWrapper } from "../SurveyUserRoles.styled";
import Header from "../../../../components/Header";
import {
  BackArrow,
  BackLink,
  NavWrapper,
  Title,
} from "../../../../shared/Nav.styled";
import SideMenu from "../SideMenu";
import { RootState } from "../../../../redux/store";
import {
  deleteUserHierarchy,
  getSupervisorRoles,
  getUserHierarchy,
  putUserHierarchy,
} from "../../../../redux/userRoles/userRolesActions";

function AddSurveyUsers() {
  const { survey_uid } = useParams<{ survey_uid?: string }>() ?? {
    survey_uid: "",
  };
  const userList = useAppSelector(
    (state: RootState) => state.userManagement.userList
  );

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [verificationForm] = Form.useForm();
  const [updateUserForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [filteredUserList, setFilteredUserList] = useState<any>([...userList]);

  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [isExistingUser, setIsExistingUser] = useState<boolean>(false);
  const [rolesTableData, setRolesTableData] = useState<any>([]);
  const [newRole, setNewRole] = useState<string>("");
  const [isNewUserHierarchy, setNewUserHierarchy] = useState<boolean>(true);
  const [existingUserHierarchy, setExistingUserHierarchy] = useState<any>();
  const [isRoleRequired, setIsRoleRequired] = useState(true);

  const [hasReportingRole, setHasReportingRole] = useState<boolean>(false);
  const [userDetails, setUserDetails] = useState<any>({
    email: null,
    first_name: null,
    last_name: null,
    roles: [],
  });

  const activeSurvey = useAppSelector(
    (state: RootState) => state.surveys.activeSurvey
  );

  const checkedUser = useAppSelector(
    (state: RootState) => state.userManagement.userChecked
  );

  const isLoading = useAppSelector(
    (state: RootState) => state.userManagement.loading
  );

  const handleGoBack = () => {
    navigate(-1);
  };

  const updateUserHierarchy = async (
    userUid: any,
    surveyUid: any,
    roleUid: any,
    parentUid: any
  ) => {
    const payload = {
      survey_uid: surveyUid,
      user_uid: userUid,
      role_uid: roleUid,
      parent_user_uid: parentUid,
    };

    if (!hasReportingRole) {
      const deleteHierarchyRes = await dispatch(
        deleteUserHierarchy({ survey_uid: surveyUid, user_uid: userUid })
      );
    } else {
      const updateHierarchyRes = await dispatch(
        putUserHierarchy({ hierarchyData: payload })
      );
    }
  };

  const onCheckUser = async () => {
    const email = verificationForm.getFieldValue("email");
    const checkResponse = await dispatch(postCheckUser(email));

    if (checkResponse?.payload.status == 200) {
      message.success(checkResponse?.payload.data.message);

      //find the user hierarchy here
      const userHierarchyRes = await dispatch(
        getUserHierarchy({
          survey_uid: survey_uid ?? "",
          user_uid: checkResponse.payload.data.user.user_uid,
        })
      );

      if (userHierarchyRes?.payload.success) {
        // set supervisor here
        setUserDetails((prev: any) => ({
          ...prev,
          supervisor: userHierarchyRes?.payload?.data?.parent_user_uid,
        }));
        setNewUserHierarchy(false);
        setExistingUserHierarchy(userHierarchyRes?.payload?.data);
      }

      const role = rolesTableData.find((r: any) =>
        checkResponse?.payload?.data?.user?.roles?.includes(r.role_uid)
      );
      setNewRole(role?.role_uid);

      if (role?.has_reporting_role) {
        setHasReportingRole(true);
      } else {
        setHasReportingRole(false);
      }

      setIsExistingUser(true);
      setUserDetails((prev: any) => {
        return {
          ...prev,
          ...checkResponse.payload.data.user,
        };
      });
    } else {
      message.info("User not found, proceed to invite user");
      setIsExistingUser(false);
      setUserDetails((prev: any) => {
        return {
          ...prev,
          email: email,
        };
      });
    }
    setIsVerified(true);
  };

  const handleUpdateUser = async () => {
    setLoading(true);
    updateUserForm.validateFields().then(async (formValues) => {
      if (isExistingUser) {
        const initialUserData = checkedUser?.user;

        if (
          initialUserData?.roles &&
          initialUserData.roles.length >= userDetails.roles.length
        ) {
          setNewRole(initialUserData?.roles[0]);
          userDetails.roles = initialUserData?.roles;
        } else {
          const commonRoles = rolesTableData.filter((r: any) =>
            initialUserData?.roles?.includes(r.role_uid)
          );
          if (commonRoles.length > 0) {
            userDetails.roles = userDetails.roles.filter(
              (role: any) =>
                !commonRoles.map((r: any) => r.role_uid).includes(role)
            );
          }
        }
        if (userDetails.is_survey_admin || userDetails.is_super_admin) {
          userDetails.can_create_survey = true;
        }
        userDetails.survey_uid = survey_uid ? parseInt(survey_uid, 10) : null;
        //perform update user
        const updateRes = await dispatch(
          putUpdateUser({
            userUId: userDetails.user_uid,
            userData: userDetails,
          })
        );
        if (updateRes.payload?.user_data) {
          if (newRole && userDetails?.supervisor) {
            updateUserHierarchy(
              userDetails?.user_uid,
              survey_uid,
              newRole,
              userDetails?.supervisor
            );
          }
          message.success("User updated successfully");
          navigate(`/survey-information/survey-users/users/${survey_uid}`);
        } else {
          message.error("Failed to update user kindly check");
          console.log("error", updateRes.payload);
        }
      } else {
        userDetails.survey_uid = survey_uid;
        //perform add user
        if (userDetails.is_survey_admin || userDetails.is_super_admin) {
          userDetails.can_create_survey = true;
        }
        const addRes = await dispatch(postAddUser(userDetails));

        const newRole = userDetails.roles[userDetails.roles.length - 1];

        if (addRes.payload?.status == 200) {
          //update user hierarchy here

          updateUserHierarchy(
            addRes.payload?.data?.user_uid,
            survey_uid,
            newRole,
            userDetails?.supervisor
          );

          message.success(
            "User Added! An email has been sent to the user with the login information."
          );
          navigate(`/survey-information/survey-users/users/${survey_uid}`);
        } else {
          message.error("Failed to add user kindly check");
          console.log("error", addRes.payload);
        }
      }
    });

    setLoading(false);
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
        reporting_role_uid: item.reporting_role_uid,
      }));

      setRolesTableData(transformedData);
    } else {
      console.log("missing roles");
    }
  };

  useEffect(() => {
    fetchSupervisorRoles();
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
              <DescriptionText>Add new user</DescriptionText>
              <div>
                {!isVerified ? (
                  <Form
                    labelCol={{ span: 6 }}
                    labelAlign="left"
                    wrapperCol={{ span: 12 }}
                    form={verificationForm}
                    onFinish={onCheckUser}
                    style={{ maxWidth: 600 }}
                  >
                    <Form.Item
                      name="email"
                      label="Email ID"
                      rules={[
                        {
                          required: true,
                          type: "email",
                          message: "Please enter a valid email",
                        },
                      ]}
                      hasFeedback
                    >
                      <Input placeholder="Enter email" />
                    </Form.Item>
                    <Form.Item style={{ marginTop: 20 }}>
                      <Button
                        type="primary"
                        htmlType="submit"
                        style={{ backgroundColor: "#2F54EB" }}
                      >
                        Check for user
                      </Button>
                      <Button
                        onClick={() =>
                          navigate(
                            `/survey-information/survey-users/users/${survey_uid}`
                          )
                        }
                        style={{ marginLeft: 20 }}
                      >
                        Dismiss
                      </Button>
                    </Form.Item>
                  </Form>
                ) : (
                  <Form
                    form={updateUserForm}
                    labelCol={{ span: 6 }}
                    labelAlign="left"
                    wrapperCol={{ span: 12 }}
                    style={{ maxWidth: 600 }}
                    onFinish={handleUpdateUser}
                  >
                    <Form.Item
                      name="email"
                      label="Email ID"
                      initialValue={userDetails.email}
                      rules={[
                        {
                          required: true,
                          type: "email",
                          message: "Please enter a valid email",
                        },
                      ]}
                      hasFeedback
                    >
                      <Input disabled />
                    </Form.Item>

                    {isExistingUser && (
                      <DescriptionText>
                        User already exists in the system
                      </DescriptionText>
                    )}

                    <Form.Item
                      name="first_name"
                      label="First name"
                      initialValue={userDetails.first_name}
                      rules={[
                        {
                          required: true,
                          message: "Please enter the first name",
                        },
                      ]}
                      hasFeedback
                    >
                      <Input
                        onChange={(e) =>
                          setUserDetails((prev: any) => ({
                            ...prev,
                            first_name: e.target.value,
                          }))
                        }
                        placeholder="Enter first name"
                      />
                    </Form.Item>
                    <Form.Item
                      name="last_name"
                      label="Last name"
                      initialValue={userDetails.last_name}
                      rules={[
                        {
                          required: true,
                          message: "Please enter the last name",
                        },
                      ]}
                      hasFeedback
                    >
                      <Input
                        onChange={(e) =>
                          setUserDetails((prev: any) => ({
                            ...prev,
                            last_name: e.target.value,
                          }))
                        }
                        placeholder="Enter last name"
                      />
                    </Form.Item>

                    <Form.Item
                      name="roles"
                      label="Role"
                      initialValue={
                        userDetails?.roles &&
                        rolesTableData.some((r: any) =>
                          userDetails?.roles?.includes(r.role_uid)
                        )
                          ? userDetails.roles
                          : undefined
                      }
                      rules={
                        isRoleRequired
                          ? [
                              {
                                required: true,
                                message: "Please select a role",
                              },
                            ]
                          : []
                      }
                      hasFeedback
                    >
                      <Select
                        showSearch={true}
                        allowClear={true}
                        placeholder="Select role"
                        onChange={(value) => {
                          //check if value has reporting role
                          const role = rolesTableData.find(
                            (r: any) => r.role_uid === value
                          );

                          if (value == null && role?.role === "Survey Admin") {
                            setIsRoleRequired(false);
                            return setUserDetails((prev: any) => ({
                              ...prev,
                              is_survey_admin: true,
                            }));
                          } else {
                            setUserDetails((prev: any) => ({
                              ...prev,
                              is_survey_admin: false,
                            }));

                            setNewRole(role?.role_uid);
                            if (role?.has_reporting_role) {
                              setHasReportingRole(true);

                              const _filteredUserList = userList.filter(
                                (user: any) => {
                                  return user?.roles?.includes(
                                    role?.reporting_role_uid
                                  );
                                }
                              );

                              setFilteredUserList(_filteredUserList);
                            } else {
                              setHasReportingRole(false);
                            }

                            setUserDetails((prev: any) => {
                              const updatedRoles = [
                                ...(checkedUser?.user?.roles || []),
                              ];

                              const index = updatedRoles.findIndex(
                                (role: any) => role === value
                              );
                              if (index != -1) {
                                updatedRoles[index] = value;
                              } else {
                                updatedRoles.push(value);
                              }

                              return {
                                ...prev,
                                roles: updatedRoles,
                              };
                            });
                          }
                        }}
                      >
                        {rolesTableData.map((r: any, i: any) => (
                          <Select.Option key={i} value={r.role_uid}>
                            {r.role}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>

                    {hasReportingRole && (
                      <Form.Item
                        name="supervisor"
                        label="Supervisor"
                        initialValue={userDetails?.supervisor}
                        rules={[{ required: false }]}
                        hasFeedback
                      >
                        <Select
                          showSearch={true}
                          allowClear={true}
                          placeholder="Select supervisor"
                          onChange={(value) => {
                            setUserDetails((prev: any) => ({
                              ...prev,
                              supervisor: value,
                            }));
                          }}
                        >
                          {filteredUserList?.map((user: any, i: any) => (
                            <Select.Option key={i} value={user?.user_uid}>
                              {user?.first_name} {user?.last_name}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                    )}
                    <Form.Item style={{ marginTop: 20 }}>
                      <Button
                        loading={loading}
                        type="primary"
                        htmlType="submit"
                        style={{ backgroundColor: "#2F54EB" }}
                      >
                        {isExistingUser && <>Update User</>}
                        {!isExistingUser && <>Add User</>}
                      </Button>
                      <Button
                        onClick={() =>
                          navigate(
                            `/survey-information/survey-users/users/${survey_uid}`
                          )
                        }
                        style={{ marginLeft: 20 }}
                      >
                        Dismiss
                      </Button>
                    </Form.Item>
                  </Form>
                )}
              </div>
            </BodyWrapper>
          </div>
        </>
      )}
    </>
  );
}

export default AddSurveyUsers;
