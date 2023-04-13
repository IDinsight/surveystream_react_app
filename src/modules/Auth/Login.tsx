import { Button, Form, Input } from "antd";
import { Link } from "react-router-dom";

import Header from "../../components/Header";
import Footer from "../../components/Footer";

import CustomerSurvey from "./../../assets/customer-survey.svg";
import { useForm } from "antd/es/form/Form";

function Login() {
  const [form] = useForm();

  const onFinish = async (values: any) => {
    // TODO: Add the dispatch to make login work
    console.log(values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
    alert(errorInfo.errorFields[0].errors[0]);
  };

  return (
    <>
      <Header />
      <div className="mb-[80px]">
        <div className="mt-[44px]">
          <p className="font-inter font-normal font-medium text-[30px] leading-[38px] text-gray-9 m-0 text-center">
            Login to DoD SurveyStream
          </p>
          <p className="font-inter font-normal font-medium text-[14px] leading-[22px] text-gray-9 text-center">
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
            <Form
              name="loginForm"
              layout="vertical"
              autoComplete="off"
              form={form}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
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
                    // TODO: Add loading
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
              className="font-inter font-normal font-medium text-[12px] leading-[20px] text-gray-9 float-right no-underline"
            >
              Forgot password?
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Login;
