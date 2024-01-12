import { useNavigate, useParams } from "react-router-dom";
import { Button, Form, Input, Select, message } from "antd";
import { useEffect, useState } from "react";
import FullScreenLoader from "../../../components/Loaders/FullScreenLoader";
import { DescriptionText, DescriptionTitle } from "../SurveyInformation.styled";
import { BodyWrapper, MainContainer } from "./UserRoles.styled";
import Header from "../../../components/Header";
import {
  BackArrow,
  BackLink,
  NavWrapper,
  Title,
} from "../../../shared/Nav.styled";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { RootState } from "../../../redux/store";
import SideMenu from "./SideMenu";
import { getSupervisorRoles } from "../../../redux/userRoles/userRolesActions";
import { putUpdateUser } from "../../../redux/userManagement/userManagementActions";

function EditSurveyUsers() {
  const { survey_uid } = useParams<{ survey_uid?: string }>() ?? {
    survey_uid: "",
  };

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [updateUserForm] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const [rolesTableData, setRolesTableData] = useState<any>([]);

  const activeSurvey = useAppSelector(
    (state: RootState) => state.surveys.activeSurvey
  );

  const isLoading = useAppSelector(
    (state: RootState) => state.userManagement.loading
  );

  const editUser = useAppSelector(
    (state: RootState) => state.userManagement.editUser
  );

  const [userDetails, setUserDetails] = useState<any>({
    ...editUser,
  });

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleUpdateUser = async () => {
    console.log("handleUpdateUser");
    setLoading(true);
    updateUserForm.validateFields().then(async (formValues) => {
      //perform update user
      const updateRes = await dispatch(
        putUpdateUser({
          userUId: userDetails.user_id,
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
    if (!editUser) {
      message.error("Kindly select user to edit");
      navigate(`/survey-information/user-roles/users/${survey_uid}`);
    }
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
                      Update user
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
              </div>
            </BodyWrapper>
          </div>
        </>
      )}
    </>
  );
}

export default EditSurveyUsers;
