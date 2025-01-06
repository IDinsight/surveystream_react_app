import { useEffect, useRef, useState } from "react";
import { CSVLink } from "react-csv";
import { Modal, Button, Tooltip } from "antd";
import {
  formatCsvData,
  formatCsvHeaders,
} from "../../modules/Assignments/utils";
import { DownloadOutlined } from "@ant-design/icons";

interface CSVDownloadButtonProps {
  keyRef: any;
  columns: any;
  tabItemIndex: string;
  data: any;
  filterData: any;
  disabled: boolean;
  hoverText: string;
}

const CSVDownloadButton = ({
  keyRef,
  columns,
  tabItemIndex,
  data,
  filterData,
  disabled,
  hoverText,
}: CSVDownloadButtonProps) => {
  const csvLinkRef = useRef<any>();
  const [csvData, setCsvData] = useState<{
    headers: any[];
    data: any[];
    filename: string;
  }>({
    headers: [],
    data: [],
    filename: "",
  });

  // Generate the CSV data on user demand only
  const generateCSV = (data: any, filename: string): void => {
    const csvContent = {
      headers: formatCsvHeaders(columns),
      data: formatCsvData(data, columns, keyRef),
      filename: filename,
    };
    setCsvData(csvContent);
  };

  // If the data is filtered, show a modal. Otherwise, download the data
  const handleDownload = (): void => {
    if (data.length === filterData.length) {
      generateCSV(data, `${tabItemIndex}.csv`);
    } else {
      showDownloadModal();
    }
  };

  const showDownloadModal = (): void => {
    Modal.info({
      title: "Select data to download",
      width: 450,
      content: (
        <div style={{ display: "flex" }}>
          <Button
            onClick={() => generateCSV(data, `${tabItemIndex}.csv`)}
            style={{ marginTop: 16, marginLeft: 0 }}
          >
            Download all data
          </Button>
          <Button
            type="dashed"
            onClick={() =>
              generateCSV(filterData, `Filtered-${tabItemIndex}.csv`)
            }
            style={{ marginTop: 16, marginBottom: 16, marginLeft: 16 }}
          >
            Download filtered data
          </Button>
        </div>
      ),
      okText: "Done",
    });
  };

  // When the csv data is ready, trigger the download
  useEffect(() => {
    if (
      csvLinkRef.current &&
      csvData.data.length > 0 &&
      csvData.headers.length > 0
    ) {
      csvLinkRef.current.link.click();

      // Reset the csv data after download
      setCsvData({
        headers: [],
        data: [],
        filename: "",
      });
    }
  }, [csvData]);

  return (
    <div>
      <Tooltip title={hoverText}>
        <Button
          disabled={disabled}
          icon={<DownloadOutlined />}
          style={{ marginLeft: 16 }}
          onClick={handleDownload}
        ></Button>
      </Tooltip>
      {csvData.data.length > 0 && (
        <CSVLink
          ref={csvLinkRef}
          data={csvData.data}
          headers={csvData.headers}
          filename={csvData.filename}
          className="btn btn-primary"
          target="_blank"
        ></CSVLink>
      )}
    </div>
  );
};

export default CSVDownloadButton;
