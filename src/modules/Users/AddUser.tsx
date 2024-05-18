import { useNavigate, useParams } from "react-router-dom";
import { Button, Form, Input, Radio, Select, message } from "antd";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { RootState } from "../../redux/store";
import {
  postCheckUser,
  postAddUser,
  putUpdateUser,
} from "../../redux/userManagement/userManagementActions";
import { BodyWrapper, DescriptionText, MainContainer } from "./Users.styled";
import FullScreenLoader from "../../components/Loaders/FullScreenLoader";
import Header from "../../components/Header";
import NavItems from "../../components/NavItems";
import { GlobalStyle } from "../../shared/Global.styled";
import { HeaderContainer, Title } from "../../shared/Nav.styled";
import {
  ClockCircleOutlined,
  CloseCircleOutlined,
  CloseOutlined,
} from "@ant-design/icons";

function AddUser() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [verificationForm] = Form.useForm();
  const [updateUserForm] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [isExistingUser, setIsExistingUser] = useState<boolean>(false);
  const [userDetails, setUserDetails] = useState<any>({
    email: null,
    first_name: null,
    last_name: null,
    roles: [],
  });

  const isLoading = useAppSelector(
    (state: RootState) => state.userManagement.loading
  );

  const userList = useAppSelector(
    (state: RootState) => state.userManagement.userList
  );

  const onCheckUser = async () => {
    const email = verificationForm.getFieldValue("email");
    const checkResponse = await dispatch(postCheckUser(email));
    if (checkResponse?.payload.status == 200) {
      message.success(checkResponse?.payload.data.message);
      setIsExistingUser(true);
      //add data for roles
      const userRolesData = userList?.filter((user: any) => {
        return (
          user.user_uid == parseInt(checkResponse.payload.data.user.user_uid)
        );
      });

      setUserDetails((prev: any) => {
        return {
          ...prev,
          ...checkResponse.payload.data.user,
          status: checkResponse.payload.data.user?.active
            ? "Active"
            : "Deactivated",
          user_role_names: userRolesData[0]?.user_role_names,
          user_survey_names: userRolesData[0]?.user_survey_names,
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
        userDetails.can_create_survey =
          userDetails?.is_super_admin || userDetails?.is_survey_admin
            ? true
            : userDetails.can_create_survey;
        //perform update user
        const updateRes = await dispatch(
          putUpdateUser({
            userUId: userDetails.user_uid,
            userData: userDetails,
          })
        );

        if (updateRes.payload?.user_data) {
          //update user hierarchy here
          message.success("User updated successfully");
          navigate(`/users`);
        } else {
          message.error("Failed to update user kindly check");
          console.log("error", updateRes.payload);
        }
      } else {
        //perform add user
        //do not set any roles for new user
        //update if user is survey_admin
        userDetails.can_create_survey =
          userDetails?.is_super_admin || userDetails?.is_survey_admin
            ? true
            : userDetails.can_create_survey;

        const addRes = await dispatch(postAddUser(userDetails));

        if (addRes.payload?.status == 200) {
          //no need to update user hierarchy
          message.success(
            "User Added! An email has been sent to the user with the login information."
          );
          navigate(`/users`);
        } else {
          message.error("Failed to add user kindly check");
          console.log("error", addRes.payload);
        }
      }
    });

    setLoading(false);
  };

  return (
    <>
      <GlobalStyle />
      <Header items={NavItems} />
      <HeaderContainer>
        <Title> Add new user</Title>

        <div style={{ display: "flex", marginLeft: "auto" }}>
          <Button
            onClick={() => navigate(`/users/`)}
            style={{ marginLeft: 20 }}
            icon={<CloseCircleOutlined />}
          >
            Dismiss
          </Button>
        </div>
      </HeaderContainer>
      {isLoading ? (
        <FullScreenLoader />
      ) : (
        <>
          <BodyWrapper>
            <MainContainer>
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

                    {isExistingUser &&
                      userDetails?.user_role_names &&
                      userDetails?.user_role_names[0] != null && (
                        <>
                          <DescriptionText>Existing Roles</DescriptionText>
                          {userDetails.user_role_names.map(
                            (role: any, i: any) => (
                              <>
                                <Form.Item
                                  label="Project name"
                                  initialValue={
                                    userDetails.user_survey_names[i]
                                  }
                                  hasFeedback
                                  rules={[
                                    {
                                      required: true,
                                    },
                                  ]}
                                >
                                  <Input
                                    value={userDetails.user_survey_names[i]}
                                    required
                                    disabled={isExistingUser}
                                  />
                                </Form.Item>
                                <Form.Item
                                  label="Role"
                                  initialValue={role}
                                  hasFeedback
                                  rules={[
                                    {
                                      required: true,
                                    },
                                  ]}
                                >
                                  <Input
                                    value={role}
                                    required
                                    disabled={isExistingUser}
                                  />
                                </Form.Item>
                              </>
                            )
                          )}
                        </>
                      )}

                    <>
                      <Form.Item
                        label="Activate this user?"
                        labelAlign="right"
                        labelCol={{ span: 24 }}
                        style={{ display: "block" }}
                        initialValue={userDetails?.active}
                        rules={[
                          {
                            required: false,
                            message: "Please select if the user is active",
                          },
                        ]}
                        hasFeedback
                        name="active"
                      >
                        <Radio.Group
                          style={{ display: "flex", width: "100%" }}
                          onChange={(e) =>
                            setUserDetails((prev: any) => ({
                              ...prev,
                              active: e.target.value,
                            }))
                          }
                          defaultValue={userDetails?.active}
                        >
                          <Radio.Button
                            value={true}
                            style={{ marginRight: "8px" }}
                          >
                            Yes
                          </Radio.Button>
                          <Radio.Button
                            value={false}
                            style={{ marginRight: "8px" }}
                          >
                            No
                          </Radio.Button>
                        </Radio.Group>
                      </Form.Item>
                    </>
                    <>
                      <Form.Item
                        label="Assign Super Admin role to this user??"
                        labelAlign="right"
                        labelCol={{ span: 24 }}
                        style={{ display: "block" }}
                        rules={[
                          {
                            required: false,
                            message: "Please select if the user is super admin",
                          },
                        ]}
                        hasFeedback
                        name="is_super_admin"
                      >
                        <Radio.Group
                          style={{ display: "flex", width: "100%" }}
                          onChange={(e) =>
                            setUserDetails((prev: any) => ({
                              ...prev,
                              is_super_admin: e.target.value,
                            }))
                          }
                          defaultValue={userDetails?.is_super_admin}
                        >
                          <Radio.Button
                            value={true}
                            style={{ marginRight: "8px" }}
                          >
                            Yes
                          </Radio.Button>
                          <Radio.Button
                            value={false}
                            style={{ marginRight: "8px" }}
                          >
                            No
                          </Radio.Button>
                        </Radio.Group>
                      </Form.Item>
                      {!userDetails?.is_super_admin && (
                        <Form.Item
                          label="Assign Survey Admin role to this user??"
                          labelAlign="right"
                          labelCol={{ span: 24 }}
                          style={{ display: "block" }}
                          rules={[
                            {
                              required: false,
                              message:
                                "Please select if the user is survey admin",
                            },
                          ]}
                          hasFeedback
                          name="can_create_survey"
                        >
                          <Radio.Group
                            style={{ display: "flex", width: "100%" }}
                            onChange={(e) =>
                              setUserDetails((prev: any) => ({
                                ...prev,
                                can_create_survey: e.target.value,
                              }))
                            }
                            defaultValue={userDetails?.can_create_survey}
                          >
                            <Radio.Button
                              value={true}
                              style={{ marginRight: "8px" }}
                            >
                              Yes
                            </Radio.Button>
                            <Radio.Button
                              value={false}
                              style={{ marginRight: "8px" }}
                            >
                              No
                            </Radio.Button>
                          </Radio.Group>
                        </Form.Item>
                      )}
                    </>

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
                    </Form.Item>
                  </Form>
                )}
              </div>
            </MainContainer>
          </BodyWrapper>
        </>
      )}
    </>
  );
}

export default AddUser;
