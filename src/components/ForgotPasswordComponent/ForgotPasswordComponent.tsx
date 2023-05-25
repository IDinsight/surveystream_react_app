import { Button, Form, Input } from "antd";
import { Link } from "react-router-dom";
import { useForm } from "antd/es/form/Form";

import { LockOutlined } from "@ant-design/icons";

interface IForgotPasswordProps {
  handleForgotSubmit: (values: { email: string }) => void;
  handleForgotFailure: (errorInfo: any) => void;
}

function ForgotPasswordComponent({
  handleForgotSubmit,
  handleForgotFailure,
}: IForgotPasswordProps) {
  const [form] = useForm();

  return (
    <div
      style={{ boxSizing: "border-box" }}
      className="pl-5 pr-6 w-[400px] h-[362px] bg-gray-1
          rounded-lg border border-solid border-[#F0F0F0] shadow-[0px_4px_4px_rgba(0,0,0,0.08)]"
    >
      <div className="flex flex-row items-center">
        <LockOutlined className="text-[#434343] text-[18px]" />
        <p className="ml-2 font-inter not-italic font-medium text-[14px] leading-[20px] text-[#595959]">
          Forgot password?
        </p>
      </div>
      <p className="mt-4 pr-5 font-inter not-italic font-medium text-[12px] leading-[20px] text-[#000000A6]">
        Please enter the email affiliated with your SurveyStream account. A link
        to reset your password will be sent to this email address.
      </p>
      <div className="mt-[16px]">
        <Form
          name="forgotPassword"
          layout="vertical"
          autoComplete="off"
          form={form}
          onFinish={handleForgotSubmit}
          onFinishFailed={handleForgotFailure}
        >
          <Form.Item
            label={
              <span className="font-inter not-italic font-medium text-[12px] leading-[20px] text-[#595959]">
                Email
              </span>
            }
            name="email"
            rules={[
              { required: true, message: "Please enter email" },
              { type: "email", message: "Please enter valid email address" },
            ]}
          >
            <Input className="h-10 font-inter not-italic font-medium text-[14px] leading-[22px] text-gray-7" />
          </Form.Item>
          <Form.Item shouldUpdate>
            {() => (
              <Button
                type="primary"
                htmlType="submit"
                block
                className="mt-1 w-full bg-geekblue-5 h-10"
                // TODO: Add loading
                disabled={
                  !form.isFieldsTouched(true) ||
                  !!form.getFieldsError().filter(({ errors }) => errors.length)
                    .length
                }
              >
                Request password link
              </Button>
            )}
          </Form.Item>
        </Form>
        <Link
          to="/login"
          className="mt-1 font-inter not-italic font-medium text-[12px] leading-[20px] text-[#595959] float-right no-underline"
        >
          Back to login
        </Link>
      </div>
    </div>
  );
}

export default ForgotPasswordComponent;
