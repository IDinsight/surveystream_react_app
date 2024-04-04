import { ChangeEvent, useState } from "react";
import { Button, Form, Input } from "antd";
import { useForm } from "antd/es/form/Form";
import PasswordStrengthBar from "react-password-strength-bar";

import PasswordStatusIndicator from "../PasswordStatusIndicator";
import "./ResetPasswordComponent.css";
import { ResetParams } from "../../redux/auth/types";
import { GlobalStyle } from "../../shared/Global.styled";

interface IResetPasswordProps {
  handleResetSubmit: (values: ResetParams) => void;
  handleResetFailure: (errorInfo: any) => void;
}

function ResetPasswordComponent({
  handleResetSubmit,
  handleResetFailure,
}: IResetPasswordProps) {
  const [form] = useForm();
  const password = Form.useWatch("password", form);

  const [passwordIndicator, setPasswordIndicator] = useState({
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
  };

  return (
    <>
      <GlobalStyle />
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
              rules={[
                { required: true, message: "Please input new password!" },
              ]}
            >
              <Input.Password onChange={handlePasswordValue} />
            </Form.Item>
            <PasswordStrengthBar
              className="passwordStrengthBar"
              password={password}
              scoreWords={[
                "Very weak",
                "Very weak",
                "Weak",
                "Moderate",
                "Strong",
              ].map((word) => `Password strength: ${word}`)}
              barColors={[
                "#F5F5F5",
                "#FA541C",
                "#FA8C16",
                "#FADB14",
                "#52C41A",
              ]}
              shortScoreWord={"Password strength:"}
              scoreWordStyle={{
                textAlign: "left",
                marginTop: "16px",
                fontFamily: "Lato",
                fontSize: "12px",
                lineHeight: "22px",
                color: "rgba(0, 0, 0, 0.25)",
              }}
            />
            <div style={{ marginTop: "12px" }}>
              <PasswordStatusIndicator
                text="8 characters minimum"
                success={passwordIndicator.minimum}
              />
            </div>
            <Form.Item
              className="mt-6"
              label={
                <span className="font-inter font-medium text-[14px] leading-[20px] text-[#595959]">
                  Confirm password
                </span>
              }
              name="confirmPassword"
              rules={[
                {
                  required: true,
                  message: "Please input new confirm password!",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Passwords don't match"));
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
                    !!form
                      .getFieldsError()
                      .filter(({ errors }) => errors.length).length ||
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
    </>
  );
}

export default ResetPasswordComponent;
