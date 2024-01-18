import { useNavigate } from "react-router-dom";
import { Button, Form, Input, Select } from "antd";
import { useState } from "react";
import FullScreenLoader from "../../../components/Loaders/FullScreenLoader";
import NavItems from "../../../components/NavItems";
import { DescriptionText, DescriptionTitle } from "../SurveyInformation.styled";
import { BodyWrapper, MainContainer } from "./UserRoles.styled";
import Header from "../../../components/Header";
import {
  BackArrow,
  BackLink,
  NavWrapper,
  Title,
} from "../../../shared/Nav.styled";
import { useAppSelector } from "../../../redux/hooks";
import { RootState } from "../../../redux/store";
import SideMenu from "./SideMenu";

function AddUsers() {
  const navigate = useNavigate();
  const [verificationForm] = Form.useForm();
  const [roleUpdateForm] = Form.useForm();

  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [userDetails, setUserDetails] = useState<any>({
    email: null,
    firstname: null,
    lastname: null,
    roles: [],
  });

  // This need to be come from redux state
  const isLoading = false;

  const handleGoBack = () => {
    navigate(-1);
  };

  const onCheckUser = () => {
    const email = verificationForm.getFieldValue("email");

    setUserDetails((prev: any) => {
      return {
        ...prev,
        email: email,
      };
    });

    setIsVerified(true);
  };

  const onAddUserHandler = () => {
    console.log("Submitted");
  };
  const activeSurvey = useAppSelector(
    (state: RootState) => state.surveys.activeSurvey
  );

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
                Add new user
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
                      rules={[{ required: true }]}
                    >
                      <Input required />
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
                        onClick={() => navigate("/users")}
                        style={{ marginLeft: 20 }}
                      >
                        Dismiss
                      </Button>
                    </Form.Item>
                  </Form>
                ) : (
                  <Form
                    labelCol={{ span: 6 }}
                    form={roleUpdateForm}
                    labelAlign="left"
                    wrapperCol={{ span: 12 }}
                    onFinish={onAddUserHandler}
                    style={{ maxWidth: 600 }}
                  >
                    <Form.Item label="Email ID" rules={[{ required: true }]}>
                      <Input value={userDetails["email"]} disabled />
                    </Form.Item>
                    <Form.Item
                      name="firstname"
                      label="First name"
                      rules={[{ required: true }]}
                    >
                      <Input required />
                    </Form.Item>
                    <Form.Item
                      name="lastname"
                      label="Last name"
                      rules={[{ required: true }]}
                    >
                      <Input required />
                    </Form.Item>
                    <Form.Item
                      name="role"
                      label="Role"
                      rules={[{ required: true }]}
                    >
                      <Select
                        placeholder="Select role"
                        onChange={() => console.log("Jay")}
                        options={[
                          { value: "survey_admin", label: "Survey Admin" },
                          { value: "super_admin", label: "Super Admin" },
                        ]}
                      />
                    </Form.Item>
                    <Form.Item style={{ marginTop: 20 }}>
                      <Button
                        type="primary"
                        htmlType="submit"
                        style={{ backgroundColor: "#2F54EB" }}
                      >
                        Add user
                      </Button>
                      <Button
                        onClick={() => navigate("/users")}
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

export default AddUsers;
