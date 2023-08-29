import { useNavigate } from "react-router-dom";
import { Button, message } from "antd";
import Header from "../../../components/Header";
import {
  BackArrow,
  BackLink,
  NavWrapper,
  Title,
} from "../../../shared/Nav.styled";
import SideMenu from "../SideMenu";
import { TargetsManageFormWrapper, TargetsTable } from "./TargetsManage.styled";
import {
  CloudDownloadOutlined,
  CloudUploadOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import RowEditingModal from "./RowEditingModal";
import TargetsCountBox from "../../../components/TargetsCountBox";

function TargetsManage() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const [editMode, setEditMode] = useState<boolean>(false);
  const [editData, setEditData] = useState<boolean>(false);
  const [fieldData, setFieldData] = useState<any>([]);
  const [paginationPageSize, setPaginationPageSize] = useState<number>(10);

  // Mock data for table, generate it via database
  const dataTableColumn = [
    {
      title: "target_id",
      dataIndex: "target_id",
    },
    {
      title: "psu_id",
      dataIndex: "psu_id",
    },
    {
      title: "Target Name",
      dataIndex: "target_name",
    },
    {
      title: "Target Address",
      dataIndex: "target_address",
    },
    {
      title: "District",
      dataIndex: "district",
    },
  ];

  const tableDataSource: any = [];
  for (let i = 102001; i < 102311; i++) {
    tableDataSource.push({
      key: i,
      target_id: i,
      psu_id: 1101,
      target_name: "Rakesh Yadav",
      target_address: "102, Katihar, Jail Road",
      district: "Katihar",
    });
  }

  // Row selection state and handler
  const [selectedRows, setSelectedRows] = useState<any>([]);
  const onSelectChange = (_: any, newSelectedRow: any) => {
    setSelectedRows(newSelectedRow);
  };

  const rowSelection = {
    selectedRows,
    onChange: onSelectChange,
  };
  const hasSelected = selectedRows.length > 0;

  // Handler for Edit Data button
  const onEditDataHandler = () => {
    if (!hasSelected) {
      message.error("No row selected for editing");
      return;
    }
    setEditData(true);

    // Setting the fields to show on Modal
    const fields = Object.keys({ ...selectedRows[0] })
      .filter((field) => field !== "key")
      .map((field) => {
        return {
          labelKey: field,
          label: dataTableColumn.find((col: any) => col.dataIndex === field)
            ?.title,
        };
      });
    setFieldData(fields);
  };

  const onEditingCancel = () => {
    setEditData(false);
  };

  const onEditingUpdate = () => {
    // Write logic to update the records
    setEditData(false);
  };

  return (
    <>
      <Header />
      <NavWrapper>
        <BackLink onClick={handleGoBack}>
          <BackArrow />
        </BackLink>
        <Title> TSDPS </Title>
      </NavWrapper>
      <div style={{ display: "flex" }}>
        <SideMenu />
        <TargetsManageFormWrapper>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Title>Targets</Title>
            <div
              style={{ display: "flex", marginLeft: "auto", color: "#2F54EB" }}
            >
              {editMode ? (
                <>
                  <Button
                    icon={<EditOutlined />}
                    style={{ marginRight: 20 }}
                    onClick={onEditDataHandler}
                  >
                    Edit data
                  </Button>
                </>
              ) : null}
              <Button
                type="primary"
                icon={editMode ? null : <EditOutlined />}
                style={{ marginRight: 20, backgroundColor: "#2f54eB" }}
                onClick={() => setEditMode((prev) => !prev)}
              >
                {editMode ? "Done editing" : "Edit"}
              </Button>
              <Button
                type="primary"
                icon={<CloudUploadOutlined />}
                style={{ marginRight: 80, backgroundColor: "#2f54eB" }}
              >
                Upload new targets
              </Button>
            </div>
          </div>
          <br />
          <div style={{ display: "flex" }}>
            <TargetsCountBox total={12000} />
            <div style={{ marginLeft: "auto", marginRight: 80 }}>
              <Button
                type="primary"
                icon={<CloudDownloadOutlined />}
                style={{ backgroundColor: "#2f54eB" }}
              >
                Download targets
              </Button>
            </div>
          </div>
          <TargetsTable
            rowSelection={editMode ? rowSelection : undefined}
            columns={dataTableColumn}
            dataSource={tableDataSource}
            style={{ marginRight: 80, marginTop: 30 }}
            pagination={{
              pageSize: paginationPageSize,
              pageSizeOptions: [10, 25, 50, 100],
              showSizeChanger: true,
              showQuickJumper: true,
              onShowSizeChange: (_, size) => setPaginationPageSize(size),
            }}
          />
          {editData ? (
            <RowEditingModal
              data={selectedRows}
              fields={fieldData}
              onCancel={onEditingCancel}
              onUpdate={onEditingUpdate}
            />
          ) : null}
        </TargetsManageFormWrapper>
      </div>
    </>
  );
}

export default TargetsManage;
