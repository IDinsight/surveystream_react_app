import { useState } from "react";
import { Button, Drawer, Popconfirm, Tooltip, message } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import NotebooksImg from "../../../assets/notebooks.svg";
import { ManualTriggersTable } from "./ManualTriggers.styled";
import ManualEmailTriggerForm from "./ManualTriggerForm";
import { useAppDispatch } from "../../../redux/hooks";
import { deleteManualEmailTrigger } from "../../../redux/emails/emailsActions";
import { useNavigate, useParams } from "react-router";
import dayjs from "dayjs";

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
    // Show the drawer for editing with the trigger data
    setEditTriggerValues(trigger);
    showEditManualDrawer();
  };
  const manualTriggerColumns = [
    {
      title: "Config Name",
      dataIndex: "config_name",
      key: "config_name",
      sorter: (a: any, b: any) => a.config_name.localeCompare(b.config_name),
    },
    {
      title: "Manual Triggers",
      key: "manual_triggers",
      sorter: (a: any, b: any) => {
        const dateA = a.manual_triggers[0]?.date
          ? new Date(a.manual_triggers[0]?.date).getTime()
          : 0;
        const dateB = b.manual_triggers[0]?.date
          ? new Date(b.manual_triggers[0]?.date).getTime()
          : 0;
        return dateA - dateB;
      },
      render: (record: {
        manual_triggers: {
          date: string;
          time: string;
          status: string;
          recipients: string[];
        }[];
      }) => (
        <div>
          {record.manual_triggers.length > 0 ? (
            record.manual_triggers.map((manual_trigger, index) => {
              const { date, time, recipients, status } = manual_trigger;
              const formattedDate = formatDate(date);
              return (
                <div
                  className="custom-card"
                  style={{
                    display: "flex",
                    marginBottom: "10px",
                    flexDirection: "row",
                  }}
                  key={index}
                >
                  <div style={{ marginRight: "10px", width: "30%" }}>
                    <p>Date: {formattedDate}</p>
                    <p>
                      Time: {dayjs(`1970-01-01T${time}Z`).format("hh:mm A")}
                    </p>
                    <p>Status: {status}</p>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      maxHeight: "180px",
                      overflowY: "auto",
                    }}
                  >
                    <div style={{ marginRight: "10px" }}>
                      <p>
                        Recipients{" "}
                        <ul>
                          {recipients
                            .slice(0, Math.ceil(recipients.length / 2))
                            .map((id: any, idx: any) => (
                              <li key={idx}>
                                {surveyEnumerators?.find(
                                  (e: any) => e.enumerator_id == id
                                )?.name || ""}
                              </li>
                            ))}
                        </ul>
                      </p>
                    </div>

                    <div style={{ marginRight: "10px", width: "50%" }}>
                      <p>&nbsp;</p>
                      <p>
                        <ul>
                          {recipients
                            .slice(Math.ceil(recipients.length / 2))
                            .map((id: any, idx: any) => (
                              <li key={idx}>
                                {surveyEnumerators?.find(
                                  (e: any) => e.enumerator_id == id
                                )?.name || ""}
                              </li>
                            ))}
                        </ul>
                      </p>
                    </div>
                  </div>
                  <div
                    style={{
                      marginTop: "10px",
                      marginLeft: "auto",
                    }}
                  >
                    <Tooltip title="Edit">
                      <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => handleEditTrigger(manual_trigger)}
                        style={{ marginBottom: 8 }}
                      >
                        Edit
                      </Button>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <Popconfirm
                        title="Are you sure you want to delete this trigger?"
                        onConfirm={() => handleDeleteTrigger(manual_trigger)}
                        okText="Yes"
                        cancelText="No"
                      >
                        <Button type="link" icon={<DeleteOutlined />} danger>
                          Delete
                        </Button>
                      </Popconfirm>
                    </Tooltip>
                  </div>
                </div>
              );
            })
          ) : (
            <p>No manual triggers available</p>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      {data.length > 0 ? (
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
          rowKey={(record) => record.config_name}
        />
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
