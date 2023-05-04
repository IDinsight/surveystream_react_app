import { Button, Form, Input } from "antd";
import { useForm } from "antd/es/form/Form";
import PasswordStatusIndicator from "../PasswordStatusIndicator";
import { ChangeEvent, useState } from "react";

type ResetParams = {
  new_password: string;
  confirm: string;
};

interface IResetPasswordProps {
  handleResetSubmit: (values: ResetParams) => void;
  handleResetFailure: (errorInfo: any) => void;
}

function ResetPasswordComponent({
  handleResetSubmit,
  handleResetFailure,
}: IResetPasswordProps) {
  const [form] = useForm();

  const [passwordIndicator, setPasswordIndicator] = useState({
    lower: false,
    upper: false,
    number: false,
    special: false,
    minimum: false,
  });

  const handlePasswordValue = (e: ChangeEvent) => {
    const val = (e.target as HTMLInputElement).value;

    // Minimun 8 character
    if (val.length >= 8) {
      setPasswordIndicator((prev) => ({ ...prev, minimum: true }));
    } else {
      setPasswordIndicator((prev) => ({ ...prev, minimum: false }));
    }

    // Should have lower case character
    if (val.search(/[a-z]/) > -1) {
      setPasswordIndicator((prev) => ({ ...prev, lower: true }));
    } else {
      setPasswordIndicator((prev) => ({ ...prev, lower: false }));
    }

    // Should have upper case character
    if (val.search(/[A-Z]/) > -1) {
      setPasswordIndicator((prev) => ({ ...prev, upper: true }));
    } else {
      setPasswordIndicator((prev) => ({ ...prev, upper: false }));
    }

    // Should have digit
    if (val.search(/[0-9]/) > 0) {
      setPasswordIndicator((prev) => ({ ...prev, number: true }));
    } else {
      setPasswordIndicator((prev) => ({ ...prev, number: false }));
    }

    // Should have special character
    if (val.search(/[!@#$%^&*]/) > 0) {
      setPasswordIndicator((prev) => ({ ...prev, special: true }));
    } else {
      setPasswordIndicator((prev) => ({ ...prev, special: false }));
    }

    console.log(Object.values(passwordIndicator).every(Boolean));
  };

  return (
    <div
      style={{ boxSizing: "border-box" }}
      className="pt-8 px-6 w-[400px] h-[409px] bg-gray-1 rounded-lg border border-solid
      border-[#F0F0F0] shadow-[0px_4px_4px_rgba(0,0,0,0.08)]"
    >
      <div>
        <Form
          name="forgotPassword"
          layout="vertical"
          autoComplete="off"
          form={form}
          onFinish={handleResetSubmit}
          onFinishFailed={handleResetFailure}
        >
          <Form.Item
            label={
              <span className="font-inter not-italic font-medium text-[14px] leading-[20px] text-[#595959]">
                Enter new password
              </span>
            }
            name="password"
            className=""
            rules={[{ required: true, message: "Please input new password!" }]}
          >
            <Input.Password onChange={handlePasswordValue} />
          </Form.Item>
          <div id="passwordindicators" className="flex">
            <div>
              <PasswordStatusIndicator
                text="one lowercase character"
                success={passwordIndicator.lower}
              />
              <PasswordStatusIndicator
                text="one uppercase character"
                success={passwordIndicator.upper}
              />
              <PasswordStatusIndicator
                text="one number"
                success={passwordIndicator.number}
              />
            </div>
            <div className="ml-5">
              <PasswordStatusIndicator
                text="one special character"
                success={passwordIndicator.special}
              />
              <PasswordStatusIndicator
                text="8 character minimum"
                success={passwordIndicator.minimum}
              />
            </div>
          </div>
          <Form.Item
            className="mt-6"
            label={
              <span className="font-inter font-medium text-[14px] leading-[20px] text-[#595959]">
                Confirm password
              </span>
            }
            name="confirm_password"
            rules={[
              { required: true, message: "Please input new confirm password!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Passwords not matching"));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item shouldUpdate>
            {() => (
              <Button
                type="primary"
                htmlType="submit"
                block
                className="w-full bg-geekblue-5 h-[40px] font-inter not-italic font-medium text-[12px] leading-[20px]"
                // TODO: Add loading
                disabled={
                  !form.isFieldsTouched(true) ||
                  !!form.getFieldsError().filter(({ errors }) => errors.length)
                    .length ||
                  !Object.values(passwordIndicator).every(Boolean)
                }
              >
                Reset Password
              </Button>
            )}
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default ResetPasswordComponent;
