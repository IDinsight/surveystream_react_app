import { useState } from "react";
import { Button, Drawer, Popconfirm, Tooltip, message, Tag } from "antd";
import { Modal } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import NotebooksImg from "../../../assets/notebooks.svg";
import { ManualTriggersTable } from "./ManualTriggers.styled";
import ManualEmailTriggerForm from "./ManualTriggerForm";
import { useAppDispatch } from "../../../redux/hooks";
import { deleteManualEmailTrigger } from "../../../redux/emails/emailsActions";
import { useNavigate, useParams } from "react-router";
import dayjs, { Dayjs } from "dayjs";
import { title } from "process";

function ManualTriggers({
  data,
  surveyEnumerators,
  emailConfigData,
  fetchManualTriggers,
}: any) {
  const [paginationPageSize, setPaginationPageSize] = useState<number>(25);
  const [isEditManualDrawerVisible, setIsEditManualDrawerVisible] =
    useState(false);
  const [editTriggerValues, setEditTriggerValues] = useState();
  const dispatch = useAppDispatch();

  const showEditManualDrawer = () => {
    setIsEditManualDrawerVisible(true);
  };

  const closeEditManualDrawer = () => {
    setIsEditManualDrawerVisible(false);
  };

  const [showModal, setShowModal] = useState(undefined);
  const handleClose = () => setShowModal(undefined);
  const handleShow = (id: any) => setShowModal(id);
  const handleOk = () => setShowModal(undefined);

  const formatDate = (date: any) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(date).toLocaleDateString("en-US", options);
  };
  const handleDeleteTrigger = async (trigger: any) => {
    try {
      const result = await dispatch(
        deleteManualEmailTrigger({
          id: trigger.manual_email_trigger_uid,
          email_config_uid: trigger.email_config_uid,
        })
      );

      if (result.payload?.data?.success) {
        message.success("Email manual trigger deleted successfully");
        fetchManualTriggers();
      } else {
        message.error("Failed to delete trigger");
      }
    } catch (error) {
      message.error("An error occurred while deleting trigger");
    }
  };

  const handleEditTrigger = (trigger: any) => {
    setEditTriggerValues(trigger);
    showEditManualDrawer();
  };
  const manualTriggerColumns = [
    {
      title: "Config Name",
      dataIndex: "config_name",
      sorter: (a: any, b: any) => a.config_name.localeCompare(b.config_name),
    },
    {
      title: "Trigger Time(UTC)",
      dataIndex: "date",
      render: (text: any, record: any) => (
        <span>
          {formatDate(record.date)} {record.time}
        </span>
      ),
      sorter: (a: any, b: any) => {
        const dateA = a.date ? new Date(a.date).getTime() : 0;
        const dateB = b.date ? new Date(b.date).getTime() : 0;
        if (dateA === dateB) {
          return a.time.localeCompare(b.time);
        } else return dateA - dateB;
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text: any, record: any) => {
        let tagColor = "gray";
        if (record.status === "sent") {
          tagColor = "green";
        } else if (record.status === "failed") {
          tagColor = "red";
        }
        return <Tag color={tagColor}>{record.status.toUpperCase()}</Tag>;
      },
      sorter: (a: any, b: any) => a.status.localeCompare(b.status),
    },
    {
      title: "Recipients",
      dataIndex: "recipients",
      render: (text: any, record: any) => (
        <>
          <Button
            type="link"
            onClick={() => handleShow(record.manual_email_trigger_uid)}
          >
            View Recipients ({record.recipients.length})
          </Button>
          <Modal
            title="Recipients"
            style={{
              fontFamily: "Lato",
            }}
            bodyStyle={{ overflowY: "scroll", maxHeight: "200px" }}
            visible={showModal === record.manual_email_trigger_uid}
            onOk={handleOk}
            onCancel={handleClose}
            width={500}
            key={record.manual_email_trigger_uid}
          >
            <ul>
              {record.recipients.map((id: any, idx: any) => (
                <li key={idx}>
                  {surveyEnumerators?.find((e: any) => e.enumerator_id == id)
                    ?.name || ""}
                </li>
              ))}
            </ul>
          </Modal>
        </>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (text: any, record: any) => (
        <div>
          <Tooltip title="Edit">
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => handleEditTrigger(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Are you sure you want to delete this trigger?"
            onConfirm={() => handleDeleteTrigger(record)}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title="Delete">
              <Button type="link" icon={<DeleteOutlined />} danger />
            </Tooltip>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <>
      {data.length > 0 ? (
        (console.log("data : ", data),
        (
          <ManualTriggersTable
            dataSource={data}
            columns={manualTriggerColumns}
            pagination={{
              pageSize: paginationPageSize,
              pageSizeOptions: [10, 25, 50, 100],
              showSizeChanger: true,
              showQuickJumper: true,
              onShowSizeChange: (_, size) => setPaginationPageSize(size),
            }}
            rowKey={(record) => record.manual_email_trigger_uid}
          />
        ))
      ) : (
        <div
          style={{
            paddingTop: "20px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <div>
            <img src={NotebooksImg} height={220} width={225} alt="Empty data" />
            <p
              style={{
                color: "#8C8C8C",
                fontFamily: "Lato",
                fontSize: "14px",
                lineHeight: "22px",
              }}
            >
              For this survey, email manual triggers have not yet been set up.
            </p>
          </div>
        </div>
      )}

      <Drawer
        title={"Edit Manual Trigger"}
        width={650}
        onClose={closeEditManualDrawer}
        open={isEditManualDrawerVisible}
        style={{ paddingBottom: 80, fontFamily: "Lato" }}
      >
        <ManualEmailTriggerForm
          closeAddManualDrawer={closeEditManualDrawer}
          surveyEnumerators={surveyEnumerators}
          initialValues={editTriggerValues}
          fetchManualTriggers={fetchManualTriggers}
          emailConfigData={emailConfigData}
          isEditMode={true}
        />
      </Drawer>
    </>
  );
}

export default ManualTriggers;
