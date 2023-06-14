import { Button, Form, Input } from "antd";
import React, { useEffect, useState } from "react";

import { Link, useParams } from "react-router-dom";

import Header from "../../../components/Header";
import Footer from "../../../components/Footer";

import CustomerSurvey from "./../../../assets/customer-survey.svg";
import { useForm } from "antd/es/form/Form";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import {
  performGetUserProfile,
  performLogin,
} from "../../../redux/auth/authActions";
import { useAppDispatch } from "../../../redux/hooks";
import { getCookie } from "../../../utils/helper";

const Login = () => {
  const [form] = useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  // const { redirectedFrom } = useParams<{ redirectedFrom?: string }>();

  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    try {
      setLoading(true);

      const loginResponse = await dispatch(performLogin(values));

      if (loginResponse.payload == false) {
        messageApi.open({
          type: "error",
          content: "Login failed, kindly check your credentials and try again",
        });
        return false;
      }

      await dispatch(performGetUserProfile());

      navigate("/surveys");
    } catch (error) {
      messageApi.open({
        type: "error",
        content: "Login failed, kindly check your credentials and try again",
      });
    } finally {
      setLoading(false);
    }
  };

  //TODO: Finish redirected from and to feature
  // useEffect(() => {
  //   if (redirectedFrom) {
  //     messageApi.open({
  //       type: "info",
  //       content:
  //         "Because you are not logged in, you have been redirected to the login page.",
  //     });
  //   }
  // }, [redirectedFrom]);

  useEffect(() => {
    const rememberToken = getCookie("remember_token");
    if (rememberToken !== "") {
      navigate("/surveys");
    }
  }, []);
  return (
    <>
      <Header />
      <div className="mb-[80px]">
        <div className="mt-[44px]">
          <p className="font-inter font-normal font-medium text-[30px] leading-[38px] text-gray-9 m-0 text-center">
            Login to DoD SurveyStream
          </p>
          <p className="font-inter font-normal font-medium text-sm leading-[22px] text-gray-9 text-center">
            One stop shop for survey operations management
          </p>
        </div>
        <div className="mt-[72px] mb-[10px] flex">
          <div className="ml-[54px]">
            <img className="w-[739px] h-[361px]" src={CustomerSurvey} />
          </div>
          <div
            className="ml-[111px] w-[400px] h-[300px] px-[24px] py-[22px] bg-gray-2 
            border-solid border border-[#F0F0F0] rounded-lg shadow-[0px_4px_4px_rgba(0,0,0,0.08)]"
          >
            {contextHolder}

            <Form
              name="loginForm"
              layout="vertical"
              autoComplete="off"
              form={form}
              onFinish={onFinish}
            >
              <Form.Item
                label="Email"
                name="email"
                rules={[{ required: true, message: "Please enter email" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: "Please enter password" }]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item shouldUpdate>
                {() => (
                  <Button
                    type="primary"
                    htmlType="submit"
                    block
                    className="w-full bg-geekblue-5 h-[40px]"
                    loading={loading}
                    disabled={
                      !form.isFieldsTouched(true) ||
                      !!form
                        .getFieldsError()
                        .filter(({ errors }) => errors.length).length
                    }
                  >
                    Login
                  </Button>
                )}
              </Form.Item>
            </Form>
            <Link
              to="/reset-password"
              className="font-inter font-normal font-medium text-xs leading-[20px] text-gray-9 float-right no-underline"
            >
              Forgot password?
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Login;
