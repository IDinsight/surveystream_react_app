import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import BasicInformationForm, {
  BasicInformationFormProps,
} from "./BasicInformationForm";
import { NamePath } from "antd/es/form/interface";
import { FieldError, FieldData } from "rc-field-form/es/interface";
import { Options } from "scroll-into-view-if-needed";

describe("<BasicInformationForm />", () => {
  test("it should mount", () => {
    const form: BasicInformationFormProps["form"] = {
      scrollToField: function (
        name: NamePath,
        options?: Options<unknown> | undefined
      ): void {
        throw new Error("Function not implemented.");
      },
      getFieldInstance: function (name: NamePath) {
        throw new Error("Function not implemented.");
      },
      getFieldValue: function (name: NamePath) {
        throw new Error("Function not implemented.");
      },
      getFieldError: function (name: NamePath): string[] {
        throw new Error("Function not implemented.");
      },
      getFieldsError: function (
        nameList?: NamePath[] | undefined
      ): FieldError[] {
        throw new Error("Function not implemented.");
      },
      getFieldWarning: function (name: NamePath): string[] {
        throw new Error("Function not implemented.");
      },
      isFieldTouched: function (name: NamePath): boolean {
        throw new Error("Function not implemented.");
      },
      isFieldValidating: function (name: NamePath): boolean {
        throw new Error("Function not implemented.");
      },
      isFieldsValidating: function (nameList: NamePath[]): boolean {
        throw new Error("Function not implemented.");
      },
      resetFields: function (fields?: NamePath[] | undefined): void {
        throw new Error("Function not implemented.");
      },
      setFields: function (fields: FieldData[]): void {
        throw new Error("Function not implemented.");
      },
      setFieldValue: function (name: NamePath, value: any): void {
        throw new Error("Function not implemented.");
      },
      setFieldsValue: function (values: any): void {
        throw new Error("Function not implemented.");
      },
      validateFields: function (
        nameList?: NamePath[] | undefined
      ): Promise<any> {
        throw new Error("Function not implemented.");
      },
      submit: function (): void {
        throw new Error("Function not implemented.");
      },
      getFieldsValue: function (): void {
        throw new Error("Function not implemented.");
      },
      isFieldsTouched: function (): boolean {
        throw new Error("Function not implemented.");
      },
    };

    render(<BasicInformationForm form={form} />);

    const basicInformationForm = screen.getByTestId("BasicInformationForm");
    expect(basicInformationForm).toBeInTheDocument();
  });
});
