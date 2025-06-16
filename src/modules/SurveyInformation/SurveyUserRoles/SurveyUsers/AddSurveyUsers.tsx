import { useNavigate, useParams } from "react-router-dom";
import { Button, Form, Input, Select, message } from "antd";
import { useEffect, useState } from "react";
import FullScreenLoader from "../../../../components/Loaders/FullScreenLoader";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { getSurveyModuleQuestionnaire } from "../../../../redux/surveyConfig/surveyConfigActions";
import { QuestionCircleOutlined } from "@ant-design/icons";
import {
  getSurveyLocationGeoLevels,
  getSurveyLocationsLong,
} from "../../../../redux/surveyLocations/surveyLocationsActions";
import { getSurveyBasicInformation } from "../../../../redux/surveyConfig/surveyConfigActions";
import {
  postAddUser,
  postCheckUser,
  putUpdateUser,
} from "../../../../redux/userManagement/userManagementActions";
import { DescriptionText } from "../../SurveyInformation.styled";

import { BodyWrapper, StyledTooltip } from "../SurveyUserRoles.styled";
import Header from "../../../../components/Header";
import {
  BackArrow,
  BackLink,
  NavWrapper,
  Title,
  HeaderContainer,
} from "../../../../shared/Nav.styled";

import SideMenu from "../../SideMenu";
import { RootState } from "../../../../redux/store";
import {
  deleteUserHierarchy,
  getSupervisorRoles,
  getUserHierarchy,
  putUserHierarchy,
} from "../../../../redux/userRoles/userRolesActions";
import { GlobalStyle } from "../../../../shared/Global.styled";
import HandleBackButton from "../../../../components/HandleBackButton";

import { resolveSurveyNotification } from "../../../../redux/notifications/notificationActions";

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
  const [filteredUserList, setFilteredUserList] = useState<any>(
    userList ? [...userList] : []
  );

  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [isExistingUser, setIsExistingUser] = useState<boolean>(false);
  const [rolesTableData, setRolesTableData] = useState<any>([]);
  const [newRole, setNewRole] = useState<string>("");
  const [isNewUserHierarchy, setNewUserHierarchy] = useState<boolean>(true);
  const [existingUserHierarchy, setExistingUserHierarchy] = useState<any>();
  const [isRoleRequired, setIsRoleRequired] = useState(true);
  const [locationDetailsField, setLocationDetailsField] = useState<any>([]);
  const [mappingCriteriaFields, setMappingCriteriaFields] = useState<any>([]);
  const [surveyPrimeGeoLocation, setSurveyPrimeGeoLocation] =
    useState<any>("no_location");
  const [lowestRole, setLowestRole] = useState<string>("");
  const [isLowestRole, setisLowestRole] = useState<boolean>(false);

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

  const { loading: isSideMenuLoading } = useAppSelector(
    (state: RootState) => state.surveyConfig
  );

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
    const checkResponse = await dispatch(
      postCheckUser({ email, survey_uid: survey_uid ?? "" })
    );

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
        checkResponse?.payload?.data?.user?.roles?.includes(r?.role_uid)
      );
      setNewRole(role?.role_uid);

      if (role?.has_reporting_role) {
        setHasReportingRole(true);

        const _filteredUserList = userList?.filter((user: any) => {
          return (
            user?.roles?.includes(role?.reporting_role_uid) &&
            user?.user_uid !== checkResponse.payload.data.user.user_uid
          );
        });
        setFilteredUserList(_filteredUserList);
      } else {
        setHasReportingRole(false);
      }

      if (role?.role_uid === lowestRole) {
        setisLowestRole(true);
      } else {
        setisLowestRole(false);
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
          initialUserData.roles.length >= userDetails.roles.length &&
          !userDetails.is_survey_admin
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
            await updateUserHierarchy(
              userDetails?.user_uid,
              survey_uid,
              newRole,
              userDetails?.supervisor
            );
          }
          message.success("User updated successfully");
          if (lowestRole) {
            dispatch(
              resolveSurveyNotification({
                survey_uid: survey_uid,
                module_id: 4,
                resolution_status: "done",
              })
            );
          }
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
            addRes.payload?.data?.user.user_uid,
            survey_uid,
            newRole,
            userDetails?.supervisor
          );
          if (lowestRole) {
            dispatch(
              resolveSurveyNotification({
                survey_uid: survey_uid,
                module_id: 4,
                resolution_status: "done",
              })
            );
          }
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

  const fetchSurveyBasicInformation = async () => {
    const surveyBasicInformationRes = await dispatch(
      getSurveyBasicInformation({ survey_uid: survey_uid })
    );
    if (surveyBasicInformationRes?.payload) {
      if (surveyBasicInformationRes.payload?.prime_geo_level_uid !== null) {
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

  const fetchSurveyModuleQuestionnaire = async () => {
    if (survey_uid) {
      const moduleQQuestionnaireRes = await dispatch(
        getSurveyModuleQuestionnaire({ survey_uid: survey_uid })
      );
      let mapping_criteria_fields: any[] = [];
      if (moduleQQuestionnaireRes?.payload) {
        if (moduleQQuestionnaireRes?.payload?.data?.target_mapping_criteria) {
          mapping_criteria_fields = [
            ...(moduleQQuestionnaireRes?.payload?.data
              ?.target_mapping_criteria || []),
          ];
        }
        if (moduleQQuestionnaireRes?.payload?.data?.surveyor_mapping_criteria) {
          mapping_criteria_fields = [
            ...mapping_criteria_fields,
            ...(moduleQQuestionnaireRes?.payload?.data
              ?.surveyor_mapping_criteria || []),
          ];
        }
        // remove duplicates and "Manual" from the list
        mapping_criteria_fields = mapping_criteria_fields.filter(
          (value, index, array) =>
            array.indexOf(value) === index && array[index] !== "Manual"
        );
        setMappingCriteriaFields(mapping_criteria_fields);
      }
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

  const fetchLocationDetails = async () => {
    if (survey_uid) {
      // Get location levels
      const locationlevelsRes = await dispatch(
        getSurveyLocationGeoLevels({ survey_uid: survey_uid })
      );

      if (locationlevelsRes?.payload) {
        const primeGeoLevel = findPrimeGeoLevel(locationlevelsRes?.payload);
        if (primeGeoLevel) {
          const locationRes = await dispatch(
            getSurveyLocationsLong({
              survey_uid: survey_uid,
              geo_level_uid: primeGeoLevel?.geo_level_uid,
            })
          );
          if (locationRes?.payload.length > 0) {
            // filter out the prime geo level locations columns
            const primeGeoLevelLocations: any[] = locationRes?.payload.map(
              (location: any) => ({
                location_uid: location.location_uid,
                location_id: location.location_id,
                location_name: location.location_name,
              })
            );
            setLocationDetailsField([
              {
                title: `${primeGeoLevel.geo_level_name}`,
                key: `location_id_column`,
                values: primeGeoLevelLocations,
              },
            ]);
          }
        }
      }
    }
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

      // lowest role is the role which is not a reporting role for any other role
      const lowestRole = transformedData.find(
        (role) =>
          !transformedData.some(
            (r) => r.reporting_role_uid === role.role_uid
          ) && role.role !== "Super Admin"
      );
      setLowestRole(lowestRole?.role_uid);
    } else {
      console.log("missing roles");
    }
  };

  useEffect(() => {
    fetchSupervisorRoles();
    fetchSurveyBasicInformation();
    fetchSurveyModuleQuestionnaire();
  }, [survey_uid]);

  useEffect(() => {
    if (
      mappingCriteriaFields.includes("Location") &&
      surveyPrimeGeoLocation !== "no_location"
    ) {
      fetchLocationDetails();
    }
  }, [survey_uid, mappingCriteriaFields, surveyPrimeGeoLocation]);

  return (
    <>
      <GlobalStyle />

      <NavWrapper>
        <HandleBackButton surveyPage={true}></HandleBackButton>

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
      <HeaderContainer>
        <Title>Users: Add new user</Title>
      </HeaderContainer>
      {isLoading || isSideMenuLoading ? (
        <FullScreenLoader />
      ) : (
        <>
          <div style={{ display: "flex" }}>
            <SideMenu />
            <BodyWrapper>
              <DescriptionText>
                Add users for the survey. Pro tip: Start with users with the top
                most role in the survey, in order to be able to select them as
                supervisors for their reportees when adding them.
              </DescriptionText>
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
                        onClick={() =>
                          navigate(
                            `/survey-information/survey-users/users/${survey_uid}`
                          )
                        }
                      >
                        Cancel
                      </Button>
                      <Button
                        type="primary"
                        htmlType="submit"
                        style={{ backgroundColor: "#2F54EB", marginLeft: 20 }}
                      >
                        Check for user
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
                        disabled={isExistingUser}
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
                        disabled={isExistingUser}
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
                          ? rolesTableData.find((r: any) =>
                              userDetails?.roles?.includes(r.role_uid)
                            ).role_uid
                          : userDetails?.is_survey_admin
                          ? "Survey Admin"
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
                        optionFilterProp="children"
                        placeholder="Select role"
                        onChange={(value) => {
                          //check if value has reporting role
                          const role = rolesTableData.find(
                            (r: any) => r.role_uid === value
                          );

                          if (value == null && role?.role === "Survey Admin") {
                            setIsRoleRequired(false);
                            setHasReportingRole(false);
                            setisLowestRole(false);

                            return setUserDetails((prev: any) => ({
                              ...prev,
                              is_survey_admin: true,
                              location_uids: [],
                              location_ids: [],
                              location_names: [],
                              languages: [],
                            }));
                          } else {
                            setUserDetails((prev: any) => ({
                              ...prev,
                              is_survey_admin: false,
                            }));
                            setNewRole(role?.role_uid);
                            if (role?.has_reporting_role) {
                              setHasReportingRole(true);

                              const _filteredUserList = userList?.filter(
                                (user: any) => {
                                  return (
                                    user?.roles?.includes(
                                      role?.reporting_role_uid
                                    ) &&
                                    user?.user_uid !== userDetails?.user_uid
                                  );
                                }
                              );
                              setFilteredUserList(_filteredUserList);
                            } else {
                              setHasReportingRole(false);
                            }
                            if (role?.role_uid === lowestRole) {
                              setisLowestRole(true);
                            } else {
                              setisLowestRole(false);

                              // also remove location details
                              setUserDetails((prev: any) => ({
                                ...prev,
                                location_uids: [],
                                location_ids: [],
                                location_names: [],
                                languages: [],
                              }));
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
                          optionFilterProp="children"
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

                    {isLowestRole && mappingCriteriaFields.length > 0 && (
                      <DescriptionText>
                        The user is assigned the smallest field supervisor role.
                        The following fields will be used for mapping
                        supervisors to surveyors or targets as per the mapping
                        criteria selected under module questionnaire.
                      </DescriptionText>
                    )}

                    {mappingCriteriaFields.includes("Gender") &&
                      isLowestRole && (
                        <Form.Item
                          name="gender"
                          label={
                            <span>
                              Gender&nbsp;
                              {isExistingUser ? (
                                <StyledTooltip title="Gender can't be updated at a survey level. Kindly contact SurveyStream team if gender needs to be updated.">
                                  <QuestionCircleOutlined />
                                </StyledTooltip>
                              ) : (
                                ""
                              )}
                            </span>
                          }
                          rules={[
                            isExistingUser
                              ? {}
                              : {
                                  required: true,
                                  message: `Please enter the Gender`,
                                },
                          ]}
                          initialValue={userDetails?.gender}
                          hasFeedback
                        >
                          <Select
                            style={{ width: "100%" }}
                            allowClear={true}
                            disabled={isExistingUser}
                            value={userDetails?.gender}
                            onSelect={(val: any) => {
                              setUserDetails((prev: any) => ({
                                ...prev,
                                gender: val,
                              }));
                            }}
                          >
                            <Select.Option value="Male">Male</Select.Option>
                            <Select.Option value="Female">Female</Select.Option>
                          </Select>
                        </Form.Item>
                      )}
                    {mappingCriteriaFields.includes("Location") &&
                      isLowestRole &&
                      locationDetailsField.length > 0 && (
                        <Form.Item
                          name="location_id"
                          label={
                            <span>
                              {locationDetailsField[0].title}&nbsp;
                              <StyledTooltip title="Prime geo locations associated with the given user. Dropdown values are in the format: 'Location ID - Name'.">
                                <QuestionCircleOutlined />
                              </StyledTooltip>
                            </span>
                          }
                          initialValue={userDetails?.location_uids}
                          rules={[
                            {
                              required: true,
                              message: `Please enter the ${locationDetailsField[0].title}`,
                            },
                          ]}
                          hasFeedback
                        >
                          <Select
                            showSearch={true}
                            optionFilterProp="children"
                            allowClear={true}
                            placeholder="Select locations (format: id - name)"
                            mode="multiple"
                            onChange={(value) => {
                              setUserDetails((prev: any) => ({
                                ...prev,
                                location_uids: value,
                              }));
                            }}
                          >
                            {locationDetailsField[0].values?.map(
                              (location: any, i: any) => (
                                <Select.Option
                                  key={i}
                                  value={location?.location_uid}
                                >
                                  {location?.location_id} -{" "}
                                  {location?.location_name}
                                </Select.Option>
                              )
                            )}
                          </Select>
                        </Form.Item>
                      )}
                    {mappingCriteriaFields.includes("Language") &&
                      isLowestRole && (
                        <Form.Item
                          name="language"
                          label={
                            <span>
                              Languages&nbsp;
                              <StyledTooltip title="Languages associated with the given user. Kindly enter the values in a comma separated format like Hindi, Swahili, Odia">
                                <QuestionCircleOutlined />
                              </StyledTooltip>
                            </span>
                          }
                          initialValue={userDetails?.languages}
                          rules={[
                            {
                              required: true,
                              message: `Please enter the languages`,
                            },
                          ]}
                          hasFeedback
                        >
                          <Input
                            onChange={(e) =>
                              setUserDetails((prev: any) => ({
                                ...prev,
                                languages: e.target.value
                                  .split(",")
                                  .map((l) => l.trim()),
                              }))
                            }
                            placeholder="Example: Hindi, Swahili, Odia"
                          />
                        </Form.Item>
                      )}
                    <Form.Item style={{ marginTop: 20 }}>
                      <Button
                        onClick={() =>
                          navigate(
                            `/survey-information/survey-users/users/${survey_uid}`
                          )
                        }
                      >
                        Cancel
                      </Button>
                      <Button
                        loading={loading}
                        type="primary"
                        htmlType="submit"
                        style={{ backgroundColor: "#2F54EB", marginLeft: 20 }}
                      >
                        {isExistingUser && <>Update User</>}
                        {!isExistingUser && <>Add User</>}
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
