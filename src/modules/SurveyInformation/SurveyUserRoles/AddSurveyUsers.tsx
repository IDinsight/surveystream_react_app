import { useNavigate, useParams } from "react-router-dom";
import { Button, Form, Input, Select, message } from "antd";
import { useEffect, useState } from "react";
import FullScreenLoader from "../../../components/Loaders/FullScreenLoader";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import {
  postAddUser,
  postCheckUser,
  putUpdateUser,
} from "../../../redux/userManagement/userManagementActions";
import { DescriptionText } from "../SurveyInformation.styled";
import { BodyWrapper } from "./UserRoles.styled";
import Header from "../../../components/Header";
import {
  BackArrow,
  BackLink,
  NavWrapper,
  Title,
} from "../../../shared/Nav.styled";
import SideMenu from "./SideMenu";
import { RootState } from "../../../redux/store";
import { getSupervisorRoles } from "../../../redux/userRoles/userRolesActions";

function AddSurveyUsers() {
  const { survey_uid } = useParams<{ survey_uid?: string }>() ?? {
    survey_uid: "",
  };

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [verificationForm] = Form.useForm();
  const [updateUserForm] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [isExistingUser, setIsExistingUser] = useState<boolean>(false);
  const [rolesTableData, setRolesTableData] = useState<any>([]);
  const [userDetails, setUserDetails] = useState<any>({
    email: null,
    first_name: null,
    last_name: null,
    roles: [],
  });

  const activeSurvey = useAppSelector(
    (state: RootState) => state.surveys.activeSurvey
  );

  // This need to be come from redux state
  const isLoading = false;

  const handleGoBack = () => {
    navigate(-1);
  };

  const onCheckUser = async () => {
    const email = verificationForm.getFieldValue("email");
    const checkResponse = await dispatch(postCheckUser(email));
    if (checkResponse?.payload.status == 200) {
      message.success(checkResponse?.payload.data.message);
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
    console.log("handleUpdateUser");
    setLoading(true);
    updateUserForm.validateFields().then(async (formValues) => {
      if (isExistingUser) {
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
          message.success("User updated successfully");
          navigate(`/survey-information/user-roles/users/${survey_uid}`);
        } else {
          message.error("Failed to update user kindly check");
          console.log("error", updateRes.payload);
        }
      } else {
        //perform add user
        const addRes = await dispatch(postAddUser(userDetails));

        console.log("addRes", addRes);

        if (addRes.payload?.status == 200) {
          //update user hierarchy here
          message.success(
            "User Added! An email has been sent to the user with the login information."
          );
          navigate(`/survey-information/user-roles/users/${survey_uid}`);
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
    console.log("res", res);

    if (Array.isArray(res.payload) && res.payload.length > 0) {
      const transformedData: any[] = (
        Array.isArray(res.payload) ? res.payload : [res.payload]
      ).map((item: any) => ({
        role_uid: item.role_uid,
        role: item.role_name,
      }));

      console.log("transformedData", transformedData);

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
                            `/survey-information/user-roles/users/${survey_uid}`
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
                        disabled={isExistingUser}
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
                        disabled={isExistingUser}
                        placeholder="Enter last name"
                      />
                    </Form.Item>

                    <Form.Item
                      name="roles"
                      label="Role"
                      initialValue={userDetails?.roles}
                      rules={[{ required: true }]}
                      hasFeedback
                    >
                      <Select
                        showSearch={true}
                        allowClear={true}
                        placeholder="Select role"
                        onChange={(value) => {
                          setUserDetails((prev: any) => {
                            return {
                              ...prev,
                              roles: [value],
                            };
                          });
                        }}
                      >
                        {rolesTableData.map(
                          (r: { role_uid: any; role: any }, i: any) => (
                            <Select.Option key={i} value={r.role_uid}>
                              {r.role}
                            </Select.Option>
                          )
                        )}
                      </Select>
                    </Form.Item>

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
                            `/survey-information/user-roles/users/${survey_uid}`
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
