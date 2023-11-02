import { Dispatch, SetStateAction, useState } from "react";
import { CloseCircleOutlined, InboxOutlined } from "@ant-design/icons";
import { Button, Upload, message } from "antd";
import { FieldSchema } from "csv-file-validator";

import { Buffer } from "buffer";
import {
  basicCSVValidations,
  classifyErrorsForColumns,
  validateCSVData,
} from "../../../../utils/csvValidator";
const { Dragger } = Upload;

interface IFileUpload {
  setUploadStatus: Dispatch<SetStateAction<boolean>>;
  onFileUpload: (
    file: File,
    columnNames: string[],
    rows: string[],
    base64Data: string
  ) => void;
  hasError: boolean;
  setHasError: Dispatch<SetStateAction<any>>;
  setErrorList: Dispatch<SetStateAction<any>>;
}

function FileUpload({
  setUploadStatus,
  onFileUpload,
  hasError,
  setHasError,
  setErrorList,
  ...props
}: IFileUpload & React.ComponentProps<typeof Dragger>) {
  const [fileList, setFileList] = useState([]);

  const csvValidationRules: FieldSchema[] = [];

  const clearUpload = () => {
    setFileList([]);
  };

  const handleCustomRequest = async (options: any) => {
    const { file, onSuccess } = options;
    // Reset errors
    setHasError(false);
    setErrorList([]);

    const basicChecks = await basicCSVValidations(file);
    const result = await validateCSVData(file);

    const handleValidationResult = (validationResult: any) => {
      if (
        validationResult !== undefined &&
        validationResult.inValidData.length > 0
      ) {
        const errors: string[] = [];

        for (const error of validationResult.inValidData) {
          if (typeof error === "string") {
            errors.push(error);
          }
        }

        console.log("errors", errors);

        const errorsList = classifyErrorsForColumns(errors, csvValidationRules);

        console.log("errorsList", errorsList);

        if (errorsList.length > 0) {
          setHasError(true);
          setErrorList(errorsList);
          onSuccess("ok", new XMLHttpRequest());
          clearUpload();
          return false;
        }
      }
      return true;
    };

    if (
      !handleValidationResult(basicChecks) ||
      !handleValidationResult(result)
    ) {
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const csvData = reader.result as string;
      const encodedData = csvData.split(",")[1]; // Extract the base64 data
      const decodedData = Buffer.from(encodedData, "base64").toString(); // Decode the base64 data
      const rows = decodedData.split("\n");
      const columnNames = rows[0]
        .split(",")
        .map((columnName) => columnName.trim()); // Trim the column names

      setTimeout(() => {
        onFileUpload(file, columnNames, rows, encodedData);
        onSuccess("ok", new XMLHttpRequest());
        message.success(`${file.name} file uploaded successfully.`);
        setUploadStatus(true);
      }, 1000);
    };

    reader.readAsDataURL(file); // Use the 'file' object directly
  };

  const handleDrop = (e: React.DragEvent) => {
    console.log("Dropped files", e.dataTransfer.files);
  };

  return (
    <Dragger
      fileList={fileList}
      customRequest={handleCustomRequest}
      onDrop={handleDrop}
      {...props}
    >
      <p>
        {hasError ? (
          <CloseCircleOutlined style={{ fontSize: "32px", color: "red" }} />
        ) : (
          <InboxOutlined style={{ fontSize: "32px" }} />
        )}
      </p>
      <p className="ant-upload-text">
        {hasError ? (
          <span>CSV upload failed</span>
        ) : (
          <span>Click or drag file to this area to upload</span>
        )}
      </p>
      <p className="ant-upload-hint">
        {hasError ? (
          <span>
            Please scroll down to view the errors. Please try again after fixing
            the errors!
          </span>
        ) : (
          <span>Supports a single file upload.</span>
        )}
      </p>
      {hasError ? (
        <Button
          style={{ backgroundColor: "#597EF7", color: "white", width: "68px" }}
        >
          Retry
        </Button>
      ) : null}
    </Dragger>
  );
}

export default FileUpload;
