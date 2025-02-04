import { useNavigate, useParams } from "react-router-dom";
import { Button, Form, Input, Select, message } from "antd";
import { useEffect, useState } from "react";
import FullScreenLoader from "../../../../components/Loaders/FullScreenLoader";
import { QuestionCircleOutlined } from "@ant-design/icons";
import {
  DescriptionText,
  DescriptionTitle,
} from "../../SurveyInformation.styled";
import { BodyWrapper, StyledTooltip } from "../SurveyUserRoles.styled";
import Header from "../../../../components/Header";
import {
  BackArrow,
  BackLink,
  NavWrapper,
  Title,
  HeaderContainer,
} from "../../../../shared/Nav.styled";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { RootState } from "../../../../redux/store";
import SideMenu from "../../SideMenu";
import {
  getSupervisorRoles,
  getUserHierarchy,
  putUserHierarchy,
  deleteUserHierarchy,
} from "../../../../redux/userRoles/userRolesActions";
import { putUpdateUser } from "../../../../redux/userManagement/userManagementActions";
import { getSurveyBasicInformation } from "../../../../redux/surveyConfig/surveyConfigActions";
import { getSurveyModuleQuestionnaire } from "../../../../redux/surveyConfig/surveyConfigActions";
import {
  getSurveyLocationGeoLevels,
  getSurveyLocationsLong,
} from "../../../../redux/surveyLocations/surveyLocationsActions";
import { GlobalStyle } from "../../../../shared/Global.styled";
import HandleBackButton from "../../../../components/HandleBackButton";
import { resolveSurveyNotification } from "../../../../redux/notifications/notificationActions";

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
  const [isRoleRequired, setIsRoleRequired] = useState(true);
  const [surveyPrimeGeoLocation, setSurveyPrimeGeoLocation] =
    useState<any>("no_location");
  const [mappingCriteriaFields, setMappingCriteriaFields] = useState<any>([]);
  const [locationDetailsField, setLocationDetailsField] = useState<any>([]);
  const [lowestRole, setLowestRole] = useState<string>("");
  const [isLowestRole, setisLowestRole] = useState<boolean>(false);

  const [isUserHierarchyLoading, setisUserHierarchyLoading] =
    useState<boolean>(false);
  const [isBasicInformationLoading, setisBasicInformationLoading] =
    useState<boolean>(false);
  const [isSupervisorRolesLoading, setisSupervisorRolesLoading] =
    useState<boolean>(false);
  const [isLocationDetailsLoading, setisLocationDetailsLoading] =
    useState<boolean>(false);
  const [isModuleQuestionnaireLoading, setisModuleQuestionnaireLoading] =
    useState<boolean>(false);

  const [hasReportingRole, setHasReportingRole] = useState<boolean>(false);

  const activeSurvey = useAppSelector(
    (state: RootState) => state.surveys.activeSurvey
  );

  const isuserManagementLoading = useAppSelector(
    (state: RootState) => state.userManagement.loading
  );

  const rolesLoading = useAppSelector(
    (state: RootState) => state.userRoles.loading
  );

  const editUser = useAppSelector(
    (state: RootState) => state.userManagement.editUser
  );

  const userList = useAppSelector(
    (state: RootState) => state.userManagement.userList
  );

  const [userDetails, setUserDetails] = useState<any>({
    ...editUser,
    is_survey_admin:
      editUser?.user_admin_survey_names?.length > 0 ? true : false,
  });

  const [filteredUserList, setFilteredUserList] = useState<any>([...userList]);

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

  const handleUpdateUser = async () => {
    setLoading(true);

    const initialUserData = editUser;
    const commonRoles = rolesTableData.filter((r: any) =>
      initialUserData?.roles?.includes(r.role_uid)
    );

    if (
      initialUserData?.user_admin_survey_names.length > 0 &&
      !userDetails.is_survey_admin
    ) {
      // Check if the survey has other survey admins
      const otherAdmins = userList.filter(
        (user: any) =>
          user.user_uid !== initialUserData.user_uid &&
          user.user_admin_survey_names.length > 0
      );
      if (otherAdmins.length === 0) {
        message.error(
          "There should be at least one survey admin in the survey. Kindly assign another user as survey admin before removing this user's survey admin role."
        );
        setLoading(false);
        return;
      }
    }

    // For non survey admins, if there were survey roles before and
    // now there are less roles, it means no new role was added
    if (
      initialUserData?.roles &&
      initialUserData.roles.length >= userDetails.roles.length &&
      !userDetails.is_survey_admin
    ) {
      setNewRole(initialUserData?.roles[0]);
      userDetails.roles = initialUserData?.roles;
    } else {
      // Remove the old survey roles from the user details if new roles are added
      if (commonRoles.length > 0) {
        userDetails.roles = userDetails.roles.filter(
          (role: any) => !commonRoles.map((r: any) => r.role_uid).includes(role)
        );
      }
    }

    userDetails.survey_uid = survey_uid ? parseInt(survey_uid, 10) : null;

    if (userDetails.is_survey_admin || userDetails.is_super_admin) {
      userDetails.can_create_survey = true;
    }

    updateUserForm.validateFields().then(async (formValues) => {
      //perform update user
      const updateRes = await dispatch(
        putUpdateUser({
          userUId: userDetails.user_uid,
          userData: userDetails,
        })
      );

      if (updateRes.payload?.user_data) {
        //update user hierarchy here

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
      }
    });
    if (lowestRole) {
      console.log("resolveSurveyNotification");
      dispatch(
        resolveSurveyNotification({
          survey_uid: survey_uid,
          module_id: 4,
          resolution_status: "done",
        })
      );
    }
    setLoading(false);
  };

  const fetchSupervisorRoles = async () => {
    setisSupervisorRolesLoading(true);
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
      const _lowestRole = transformedData.find(
        (role) =>
          !transformedData.some(
            (r) => r.reporting_role_uid === role.role_uid
          ) && role.role !== "Super Admin"
      );
      setLowestRole(_lowestRole?.role_uid);

      const role = transformedData?.find((r: any) =>
        editUser?.roles?.includes(r.role_uid)
      );
      setNewRole(role?.role_uid);

      if (role?.has_reporting_role) {
        setHasReportingRole(true);

        let _filteredUserList = userList.filter(
          (user: any) => user.user_uid !== editUser?.user_uid
        );
        _filteredUserList = _filteredUserList.filter((user: any) =>
          user?.roles?.includes(role?.reporting_role_uid)
        );
        setFilteredUserList(_filteredUserList);
      } else {
        setHasReportingRole(false);
      }
      if (role?.role_uid === _lowestRole?.role_uid) {
        setisLowestRole(true);
      } else {
        setisLowestRole(false);
      }
    }
    setisSupervisorRolesLoading(false);
  };

  const fetchUserHierarchy = async () => {
    setisUserHierarchyLoading(true);
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
    setisUserHierarchyLoading(false);
  };

  const fetchSurveyBasicInformation = async () => {
    setisBasicInformationLoading(true);
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
    setisBasicInformationLoading(false);
  };

  const fetchSurveyModuleQuestionnaire = async () => {
    setisModuleQuestionnaireLoading(true);
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
    setisModuleQuestionnaireLoading(false);
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
    setisLocationDetailsLoading(true);
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
    setisLocationDetailsLoading(false);
  };

  useEffect(() => {
    if (!editUser) {
      message.error("Kindly select a user to edit");
      navigate(`/survey-information/survey-users/users/${survey_uid}`);
      return;
    }
    // Fetch user hierarchy and supervisor roles
    fetchUserHierarchy();
    fetchSupervisorRoles();

    fetchSurveyBasicInformation();
    fetchSurveyModuleQuestionnaire();

    // Update state with filtered user list and editUser details
    setUserDetails({ ...editUser });
  }, [survey_uid, editUser]);

  useEffect(() => {
    if (
      mappingCriteriaFields.includes("Location") &&
      surveyPrimeGeoLocation !== "no_location"
    ) {
      fetchLocationDetails();
    }
  }, [survey_uid, mappingCriteriaFields, surveyPrimeGeoLocation]);

  const isLoading =
    isSupervisorRolesLoading ||
    isLocationDetailsLoading ||
    isModuleQuestionnaireLoading ||
    isBasicInformationLoading ||
    isUserHierarchyLoading;

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
        <Title>Survey Users - Edit user</Title>
      </HeaderContainer>
      {isLoading || isuserManagementLoading || rolesLoading ? (
        <FullScreenLoader />
      ) : (
        <>
          <div style={{ display: "flex" }}>
            <SideMenu />
            <BodyWrapper>
              <DescriptionText>
                Edit existing user in the survey.
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
                        ? rolesTableData.find((r: any) =>
                            userDetails?.roles?.includes(r.role_uid)
                          ).role_uid
                        : userDetails?.is_survey_admin
                        ? "Survey Admin"
                        : undefined
                    }
                    rules={
                      isRoleRequired
                        ? [{ required: true, message: "Please select a role" }]
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
                          //this will run incase user does not select survey Admin
                          setUserDetails((prev: any) => ({
                            ...prev,
                            is_survey_admin: false,
                          }));
                          setNewRole(role?.role_uid);

                          if (role?.has_reporting_role) {
                            setHasReportingRole(true);
                            //filter out users without the reporting role
                            let _filteredUserList = userList.filter(
                              (user: any) =>
                                user.user_uid !== editUser?.user_uid
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
                            const updatedRoles = [...editUser.roles];
                            const index = updatedRoles.findIndex(
                              (role: any) => role === value
                            );
                            if (index !== -1) {
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
                        onChange={(value) => {
                          setUserDetails((prev: any) => ({
                            ...prev,
                            supervisor: value,
                          }));
                        }}
                        placeholder="Select supervisor"
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
                      The following fields will be used for mapping supervisors
                      to surveyors or targets as per the mapping criteria
                      selected under module questionnaire.
                    </DescriptionText>
                  )}

                  {mappingCriteriaFields.includes("Gender") && isLowestRole && (
                    <Form.Item
                      name="gender"
                      label={
                        <span>
                          Gender&nbsp;
                          <StyledTooltip title="Gender can't be updated at a survey level. Kindly contact SurveyStream team if gender needs to be updated.">
                            <QuestionCircleOutlined />
                          </StyledTooltip>
                        </span>
                      }
                      initialValue={userDetails?.gender}
                      hasFeedback
                    >
                      <Select
                        style={{ width: "100%" }}
                        allowClear={true}
                        disabled={true}
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
                      Dismiss
                    </Button>
                    <Button
                      loading={loading}
                      type="primary"
                      htmlType="submit"
                      style={{ backgroundColor: "#2F54EB", marginLeft: 20 }}
                    >
                      Update user
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
