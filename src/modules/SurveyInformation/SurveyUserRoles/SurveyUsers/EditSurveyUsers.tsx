import { useNavigate, useParams } from "react-router-dom";
import { Button, Form, Input, Select, message } from "antd";
import { useEffect, useState } from "react";
import FullScreenLoader from "../../../../components/Loaders/FullScreenLoader";
import {
  DescriptionText,
  DescriptionTitle,
} from "../../SurveyInformation.styled";
import { BodyWrapper } from "../SurveyUserRoles.styled";
import Header from "../../../../components/Header";
import {
  BackArrow,
  BackLink,
  NavWrapper,
  Title,
} from "../../../../shared/Nav.styled";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { RootState } from "../../../../redux/store";
import SideMenu from "../SideMenu";
import {
  getSupervisorRoles,
  getUserHierarchy,
  putUserHierarchy,
  deleteUserHierarchy,
} from "../../../../redux/userRoles/userRolesActions";
import { putUpdateUser } from "../../../../redux/userManagement/userManagementActions";

function EditSurveyUsers() {
  const { survey_uid } = useParams<{ survey_uid?: string }>() ?? {
    survey_uid: "",
  };

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [updateUserForm] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const [rolesTableData, setRolesTableData] = useState<any>([]);
  const [newRole, setNewRole] = useState<string>("");
  const [isNewUserHierarchy, setNewUserHierarchy] = useState<boolean>(true);
  const [existingUserHierarchy, setExistingUserHierarchy] = useState<any>();

  const [hasReportingRole, setHasReportingRole] = useState<boolean>(false);

  const activeSurvey = useAppSelector(
    (state: RootState) => state.surveys.activeSurvey
  );

  const isLoading = useAppSelector(
    (state: RootState) => state.userManagement.loading
  );

  const editUser = useAppSelector(
    (state: RootState) => state.userManagement.editUser
  );

  const userList = useAppSelector(
    (state: RootState) => state.userManagement.userList
  );

  const [userDetails, setUserDetails] = useState<any>({
    ...editUser,
  });

  const [filteredUserList, setFilteredUserList] = useState<any>([...userList]);

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

      console.log("deleteHierarchyRes", deleteHierarchyRes);
    } else {
      const updateHierarchyRes = await dispatch(
        putUserHierarchy({ hierarchyData: payload })
      );

      console.log("updateHierarchyRes", updateHierarchyRes);
    }
  };

  const handleUpdateUser = async () => {
    console.log("handleUpdateUser");
    setLoading(true);

    console.log("editUser", editUser);

    const initialUserData = editUser;
    const commonRoles = rolesTableData.filter((r: any) =>
      initialUserData?.roles?.includes(r.role_uid)
    );

    if (
      initialUserData?.roles &&
      initialUserData.roles.length >= userDetails.roles.length
    ) {
      setNewRole(initialUserData?.roles[0]);
      userDetails.roles = initialUserData?.roles;
    } else {
      if (commonRoles.length > 0) {
        userDetails.roles = userDetails.roles.filter(
          (role: any) => !commonRoles.map((r: any) => r.role_uid).includes(role)
        );
      }
    }

    console.log("userDetails.roles", userDetails.roles);

    updateUserForm.validateFields().then(async (formValues) => {
      //perform update user
      const updateRes = await dispatch(
        putUpdateUser({
          userUId: userDetails.user_uid,
          userData: userDetails,
        })
      );

      console.log("updateRes", updateRes);

      if (updateRes.payload?.user_data) {
        //update user hierarchy here
        console.log(newRole, userDetails);

        if (newRole && userDetails?.supervisor) {
          console.log("updateUserHierarchy", updateUserHierarchy);
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
    });

    setLoading(false);
  };

  const fetchSupervisorRoles = async () => {
    const res = await dispatch(getSupervisorRoles({ survey_uid: survey_uid }));
    console.log("res", res);

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

      const role = transformedData?.find((r: any) =>
        editUser?.roles?.includes(r.role_uid)
      );
      setNewRole(role?.role_uid);

      if (role?.has_reporting_role) {
        setHasReportingRole(true);
      } else {
        setHasReportingRole(false);
      }
    } else {
      console.log("missing roles");
    }
  };

  const fetchUserHierarchy = async () => {
    //find the user hierarchy here
    const userHierarchyRes = await dispatch(
      getUserHierarchy({
        survey_uid: survey_uid ?? "",
        user_uid: editUser?.user_uid,
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
  };

  useEffect(() => {
    if (!editUser) {
      message.error("Kindly select user to edit");
      navigate(`/survey-information/survey-users/users/${survey_uid}`);
      return;
    } else {
      //remove the editUser from the userList
      const _filteredUserList = userList.filter(
        (user: any) => user.user_uid !== editUser?.user_uid
      );

      setFilteredUserList(_filteredUserList);

      setUserDetails({ ...editUser });
      fetchUserHierarchy();
      fetchSupervisorRoles();
    }
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
                Edit user role
              </DescriptionText>
              <div>
                <Form
                  labelCol={{ span: 6 }}
                  form={updateUserForm}
                  labelAlign="left"
                  wrapperCol={{ span: 12 }}
                  onFinish={handleUpdateUser}
                  style={{ maxWidth: 600 }}
                >
                  <Form.Item
                    initialValue={userDetails.email}
                    label="Email ID"
                    name="email"
                    rules={[{ required: true }]}
                  >
                    <Input
                      required
                      onChange={(e) =>
                        setUserDetails((prev: any) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      disabled
                    />
                  </Form.Item>
                  <Form.Item
                    name="first_name"
                    label="First name"
                    initialValue={userDetails?.first_name}
                    rules={[{ required: true }]}
                  >
                    <Input
                      required
                      onChange={(e) =>
                        setUserDetails((prev: any) => ({
                          ...prev,
                          first_name: e.target.value,
                        }))
                      }
                      disabled
                    />
                  </Form.Item>
                  <Form.Item
                    name="last_name"
                    label="Last name"
                    rules={[{ required: true }]}
                    initialValue={userDetails?.last_name}
                  >
                    <Input
                      onChange={(e) =>
                        setUserDetails((prev: any) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      disabled
                      required
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
                    rules={[{ required: true }]}
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

                        if (role?.has_reporting_role) {
                          setHasReportingRole(true);
                          //filter out users without the reporting role
                          let _filteredUserList = userList.filter(
                            (user: any) => user.user_uid !== editUser?.user_uid
                          );
                          _filteredUserList = _filteredUserList.filter(
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
                          const updatedRoles = [...editUser.roles];
                          const index = updatedRoles.findIndex(
                            (role: any) => role === value
                          );
                          if (index !== -1) {
                            updatedRoles[index] = value;
                          } else {
                            updatedRoles.push(value);
                          }
                          console.log("setUserDetails", {
                            ...prev,
                            roles: updatedRoles,
                          });
                          return {
                            ...prev,
                            roles: updatedRoles,
                          };
                        });
                      }}
                    >
                      {rolesTableData?.map(
                        (r: { role_uid: any; role: any }, i: any) => (
                          <Select.Option key={i} value={r.role_uid}>
                            {r.role}
                          </Select.Option>
                        )
                      )}
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
                          console.log("value", value);
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
                      Update user
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
              </div>
            </BodyWrapper>
          </div>
        </>
      )}
    </>
  );
}

export default EditSurveyUsers;
