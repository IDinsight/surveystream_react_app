import { Dispatch, SetStateAction, useState } from "react";
import { CloseCircleOutlined, InboxOutlined } from "@ant-design/icons";
import { Button, Upload, message } from "antd";
import CSVFileValidator, {
  FieldSchema,
  ValidatorConfig,
} from "csv-file-validator";

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

interface ErrorObject {
  rowIndex?: number;
  columnIndex?: number;
  message: string;
}

interface ErrorSummary {
  type: string;
  count: number;
  message: string[];
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

  function isEmailValid(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
  }

  const csvValidationRules: FieldSchema[] = [
    {
      inputName: "Enumerator ID",
      name: "enumerator_id",
      required: true,
      unique: true,
      requiredError: function (headerName, rowNumber, columnNumber) {
        return `${headerName} is required in the ${rowNumber} row / ${columnNumber} column`;
      },
      validateError: function (headerName, rowNumber, columnNumber) {
        return `${headerName} is not valid in the ${rowNumber} row / ${columnNumber} column`;
      },
    },
    {
      inputName: "Name",
      name: "name",
      required: true,
      requiredError: function (headerName, rowNumber, columnNumber) {
        return `${headerName} is required in the ${rowNumber} row / ${columnNumber} column`;
      },
      validateError: function (headerName, rowNumber, columnNumber) {
        return `${headerName} is not valid in the ${rowNumber} row / ${columnNumber} column`;
      },
    },
    {
      inputName: "Email",
      name: "email",
      required: true,
      unique: true,
      validate: function (email) {
        return isEmailValid(email.toString());
      },
      requiredError: function (headerName, rowNumber, columnNumber) {
        return `${headerName} is required in the ${rowNumber} row / ${columnNumber} column`;
      },
      validateError: function (headerName, rowNumber, columnNumber) {
        return `${headerName} is not valid in the ${rowNumber} row / ${columnNumber} column`;
      },
    },
    {
      inputName: "Mobile Primary",
      name: "mobile_primary",
      required: true,
      unique: true,
      requiredError: function (headerName, rowNumber, columnNumber) {
        return `${headerName} is required in the ${rowNumber} row / ${columnNumber} column`;
      },
      validateError: function (headerName, rowNumber, columnNumber) {
        return `${headerName} is not valid in the ${rowNumber} row / ${columnNumber} column`;
      },
    },
    { inputName: "Language", name: "language", optional: true },
    { inputName: "Address", name: "home_address", optional: true },
    {
      inputName: "Gender",
      name: "gender",
      required: true,
      requiredError: function (headerName, rowNumber, columnNumber) {
        return `${headerName} is required in the ${rowNumber} row / ${columnNumber} column`;
      },
      validateError: function (headerName, rowNumber, columnNumber) {
        return `${headerName} is not valid in the ${rowNumber} row / ${columnNumber} column`;
      },
    },

    { inputName: "Enumerator Type", name: "enumerator_type", optional: true },
    { inputName: "District ID", name: "district_id", optional: true },
  ];

  const validateCSVData = async (file: File) => {
    console.log("file", file);
    // Implement this to cover all fields
    const validationConfig: ValidatorConfig = {
      headers: csvValidationRules,
      isColumnIndexAlphabetic: true,
    };

    try {
      const validationResults = await CSVFileValidator(file, validationConfig);

      return validationResults;
    } catch (error: any) {
      message.error("Validation went wrong");
    }
  };

  function classifyErrorsForColumns(
    errorList: ErrorObject[],
    rules: FieldSchema[]
  ): ErrorSummary[] {
    const errorSummaryMap: { [key: string]: ErrorSummary } = {};

    for (const error of errorList) {
      let matchedRule: FieldSchema | undefined = undefined;
      for (const rule of rules) {
        if (error.message.includes(rule.name)) {
          matchedRule = rule;
          break;
        }
      }

      if (!matchedRule) {
        const errorType = "Column names not found";
        const errorMessage = error.message;
        if (!errorSummaryMap[errorType]) {
          errorSummaryMap[errorType] = {
            type: errorType,
            count: 1,
            message: [errorMessage],
          };
        } else {
          errorSummaryMap[errorType].count++;
          errorSummaryMap[errorType].message.push(errorMessage);
        }
        continue;
      }

      let errorType: string;
      let errorMessage: string;
      if (
        matchedRule.required &&
        (error.message.includes(
          `The Header name should be ${matchedRule.name}`
        ) ||
          error.message.includes(
            `${matchedRule.name} is not correct or missing`
          ))
      ) {
        errorType = "Template Errors";
        errorMessage = error.message;
      } else if (
        matchedRule.required &&
        error.message.includes(`${matchedRule.name} is not valid`)
      ) {
        errorType = "Validation Errors";
        errorMessage = error.message;
      } else if (
        matchedRule.unique &&
        error.message.includes(`${matchedRule.name} is not unique`)
      ) {
        errorType = `Duplicate Errors`;
        errorMessage = error.message;
      } else {
        continue; // Skip errors that don't match the specified conditions
      }

      if (!errorSummaryMap[errorType]) {
        errorSummaryMap[errorType] = {
          type: errorType,
          count: 1,
          message: [errorMessage],
        };
      } else {
        errorSummaryMap[errorType].count++;
        errorSummaryMap[errorType].message.push(errorMessage);
      }
    }

    return Object.values(errorSummaryMap);
  }

  const clearUpload = () => {
    setFileList([]);
  };

  const handleCustomRequest = async (options: any) => {
    const { file, onSuccess } = options;
    //reset errors;
    setHasError(false);
    setErrorList([]);

    // Validate file type
    const allowedFileTypes = ["text/csv"];
    const fileType = file.type;
    if (!allowedFileTypes.includes(fileType)) {
      message.error("Only CSV files are allowed.");
      clearUpload();
      setHasError(true);
      return false;
    }
    // Validate file size (number of rows)
    const maxRows = process.env.REACT_APP_MAX_UPLOAD_ROWS
      ? parseInt(process.env.REACT_APP_MAX_UPLOAD_ROWS)
      : 2000;
    const reader = new FileReader();
    reader.onload = () => {
      const csvData = reader.result as string;
      const rows = csvData.split("\n");
      if (rows.length > maxRows) {
        message.error(`CSV file should have a maximum of ${maxRows} rows.`);
        clearUpload();
        setHasError(true);
        return false;
      }
    };
    reader.readAsText(file);

    const result = await validateCSVData(file);

    console.log("validateCSVData", result);

    if (result?.inValidData && result.inValidData.length > 0) {
      const errors: ErrorObject[] = result.inValidData.filter((error) => {
        const isMismatchedFieldsError = error.message.startsWith(
          "Number of fields mismatch:"
        );
        return !isMismatchedFieldsError;
      });

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
    reader.onload = () => {
      const csvData = reader.result as string;
      const encodedData = csvData.split(",")[1]; // Extract the base64 data
      const decodedData = atob(encodedData); // Decode the base64 data
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
