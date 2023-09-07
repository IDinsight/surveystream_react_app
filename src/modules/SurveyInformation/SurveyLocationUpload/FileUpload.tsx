import { Dispatch, SetStateAction } from "react";
import { InboxOutlined } from "@ant-design/icons";
import { message, Upload } from "antd";
import { Buffer } from "buffer";
const { Dragger } = Upload;

interface IFileUpload {
  setUploadStatus: Dispatch<SetStateAction<boolean>>;
  onFileUpload: (file: File, columnNames: string[], base64Data: string) => void;
}

function FileUpload({
  setUploadStatus,
  onFileUpload,
  ...props
}: IFileUpload & React.ComponentProps<typeof Dragger>) {
  const validateFile = (file: File) => {
    // Validate file type
    const allowedFileTypes = ["text/csv"];
    const fileType = file.type;
    if (!allowedFileTypes.includes(fileType)) {
      message.error("Only CSV files are allowed.");
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
        return false;
      }
    };
    reader.readAsText(file);

    return true;
  };

  const handleCustomRequest = (options: any) => {
    const { file, onSuccess } = options;

    if (validateFile(file)) {
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
          onFileUpload(file, columnNames, encodedData);
          onSuccess("ok", new XMLHttpRequest());
          message.success(`${file.name} file uploaded successfully.`);
          setUploadStatus(true);
        }, 1000);
      };
      reader.readAsDataURL(file); // Use the 'file' object directly
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    console.log("Dropped files", e.dataTransfer.files);
  };

  return (
    <Dragger
      name="locationsCSV"
      customRequest={handleCustomRequest}
      onDrop={handleDrop}
      {...props}
    >
      <p>
        <InboxOutlined style={{ fontSize: "32px" }} />
      </p>
      <p className="ant-upload-text">
        Click or drag file to this area to upload
      </p>
      <p className="ant-upload-hint">Supports a single file upload.</p>
    </Dragger>
  );
}

export default FileUpload;
