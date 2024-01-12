import { useNavigate } from "react-router-dom";
import { Button, Form, Input, Select } from "antd";
import { useState } from "react";
import FullScreenLoader from "../../components/Loaders/FullScreenLoader";
import Header from "../../components/Header";
import NavItems from "../../components/NavItems";
import Footer from "../../components/Footer";
import { BodyWrapper, DescriptionText, MainContainer } from "./Users.styled";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  postAddUser,
  postCheckUser,
} from "../../redux/userManagement/userManagementActions";

function UserAdd() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

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

  const onCheckUser = async () => {
    const email = verificationForm.getFieldValue("email");

    console.log("email", email);
    //api call
    const checkResponse = await dispatch(postCheckUser(email));

    console.log("checkResponse", checkResponse);

    setUserDetails((prev: any) => {
      return {
        ...prev,
        email: email,
      };
    });

    setIsVerified(true);
  };

  const onAddUserHandler = async () => {
    console.log("Submitted");
    const formData = verificationForm.getFieldsValue();

    console.log("formData", formData);

    const addResponse = await dispatch(postAddUser(formData));

    console.log("addResponse", addResponse);
  };

  return (
    <>
      <Header items={NavItems} />
      {isLoading ? (
        <FullScreenLoader />
      ) : (
        <>
          <BodyWrapper>
            <MainContainer>
              <div>
                <DescriptionText>Add new user</DescriptionText>
              </div>
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
                    <Form.Item
                      name="email"
                      label="Email ID"
                      rules={[{ required: true }]}
                    >
                      <Input value={userDetails["email"]} disabled />
                    </Form.Item>
                    <Form.Item
                      name="first_name"
                      label="First name"
                      rules={[{ required: true }]}
                    >
                      <Input required />
                    </Form.Item>
                    <Form.Item
                      name="last_name"
                      label="Last name"
                      rules={[{ required: true }]}
                    >
                      <Input required />
                    </Form.Item>

                    <Form.Item style={{ marginTop: 20 }}>
                      <Button
                        onClick={() => onAddUserHandler()}
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
            </MainContainer>
          </BodyWrapper>
        </>
      )}
      <Footer />
    </>
  );
}

export default UserAdd;
