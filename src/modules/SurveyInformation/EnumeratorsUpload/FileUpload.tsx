import { Dispatch, SetStateAction } from "react";
import { CloseCircleOutlined, InboxOutlined } from "@ant-design/icons";
import { Button, Upload, message } from "antd";
import CSVFileValidator, {
  FieldSchema,
  ValidatorConfig,
} from "csv-file-validator";

const { Dragger } = Upload;

interface IFileUpload {
  setUploadStatus: Dispatch<SetStateAction<boolean>>;
  onFileUpload: (file: File) => void;
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
  const validateCSVData = async (file: File) => {
    // Implement this to cover all fields
    const rules: FieldSchema[] = [
      {
        name: "Enumerator ID",
        inputName: "Enumerator ID",
        required: true,
        unique: true,
      },
      { name: "Name", inputName: "Name", required: true },
      { name: "Email", inputName: "Email", required: true, unique: true },
    ];

    const validationConfig: ValidatorConfig = {
      headers: rules,
    };

    try {
      const validationResults = await CSVFileValidator(file, validationConfig);

      return validationResults;
    } catch (error: any) {
      message.error("Validation went wrong");
    }
  };

  const handleCustomRequest = (options: any) => {
    const { file, onSuccess } = options;

    // Validate the file
    if (file.type !== "text/csv") {
      message.error("Only CSV files are allowed.");
      return false;
    }

    validateCSVData(file).then((result) => {
      // Here check the result and if there are validation error
      // then set hasError to true via setHasError and set the
      // errors via setErrorList
      console.log("validateCSVData promise result: ", result);
      onFileUpload(file);
      setUploadStatus(true);
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    console.log("Dropped files", e.dataTransfer.files);
  };

  return (
    <Dragger customRequest={handleCustomRequest} onDrop={handleDrop} {...props}>
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
