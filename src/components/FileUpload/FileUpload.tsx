import { Dispatch, SetStateAction } from "react";
import { InboxOutlined } from "@ant-design/icons";
import { message, Upload } from "antd";
const { Dragger } = Upload;

interface IFileUpload {
  setUploadStatus: Dispatch<SetStateAction<boolean>>;
}

function FileUpload({
  setUploadStatus,
  ...props
}: IFileUpload & React.ComponentProps<typeof Dragger>) {
  const handleChange = (info: any) => {
    const { status } = info.file;
    if (status !== "uploading") {
      console.log(info.file, info.fileList);
    }
    if (status === "done") {
      message.success(`${info.file.name} file uploaded successfully.`);
      setUploadStatus(true);
    } else if (status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    console.log("Dropped files", e.dataTransfer.files);
  };

  return (
    <Dragger
      name="file"
      multiple={true}
      action="http://callisto.stg.surveystream.idinsight.io/"
      onChange={handleChange}
      onDrop={handleDrop}
      {...props}
    >
      <p>
        <InboxOutlined style={{ fontSize: "32px" }} />
      </p>
      <p className="ant-upload-text">
        Click or drag file to this area to upload
      </p>
      <p className="ant-upload-hint">Support for a single or bulk upload.</p>
    </Dragger>
  );
}

export default FileUpload;
