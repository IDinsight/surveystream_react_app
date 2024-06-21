import { Key, useState } from "react";
import { SchedulesTable } from "./EmailSchedules.styled";
import NotebooksImg from "../../../assets/notebooks.svg";
import { format } from "date-fns";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Tooltip, Button, Popconfirm, Drawer, message } from "antd";
import {
  deleteEmailConfig,
  deleteEmailSchedule,
} from "../../../redux/emails/emailsActions";
import { useAppDispatch } from "../../../redux/hooks";
import EmailScheduleEditForm from "./EmailScheduleEditForm";
import { useNavigate, useParams } from "react-router";

function EmailSchedules({ data, fetchEmailSchedules }: any) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { survey_uid } = useParams<{ survey_uid: string }>() ?? {
    survey_uid: "",
  };

  const [isEditScheduleDrawerVisible, setIsEditScheduleDrawerVisible] =
    useState(false);
  const [editScheduleValues, setEditScheduleValues] = useState();

  const showEditScheduleDrawer = () => {
    setIsEditScheduleDrawerVisible(true);
  };

  const closeEditScheduleDrawer = () => {
    setIsEditScheduleDrawerVisible(false);
  };

  const formatDates = (dates: any) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return dates
      .map((date: any) => {
        return new Date(date).toLocaleDateString("en-US", options);
      })
      .join("; ");
  };

  const [paginationPageSize, setPaginationPageSize] = useState<number>(25);
  const scheduleColumns = [
    {
      title: "Config Type",
      dataIndex: "config_type",
      key: "config_type",
      sorter: (a: any, b: any) => a.config_type.localeCompare(b.config_type),
    },
    {
      title: "Email Source",
      dataIndex: "email_source",
      key: "email_source",
      sorter: (a: any, b: any) => a.email_source.localeCompare(b.email_source),
    },

    {
      title: "Email Schedules",
      key: "schedules",
      sorter: (a: any, b: any) => {
        const dateA = a.schedules[0]?.dates[0]
          ? new Date(a.schedules[0]?.dates[0]).getTime()
          : 0;
        const dateB = b.schedules[0]?.dates[0]
          ? new Date(b.schedules[0]?.dates[0]).getTime()
          : 0;
        return dateA - dateB;
      },
      render: (record: {
        schedules: {
          dates: string[];
          time: string;
          email_schedule_name: string;
        }[];
      }) => (
        <div>
          {record.schedules.length > 0 ? (
            record.schedules.map((schedule, index) => {
              const { email_schedule_name, dates, time } = schedule;
              const formattedDates = formatDates(dates).split("; ");

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
                  <div style={{ marginRight: "10px", width: "50%" }}>
                    <p>Schedule Name : {email_schedule_name}</p>
                    <p>
                      Time :{" "}
                      {format(new Date(`1970-01-01T${time}Z`), "hh:mm a")}
                    </p>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      maxHeight: "300px",
                      overflowY: "auto",
                    }}
                  >
                    <div style={{ marginRight: "10px", width: "50%" }}>
                      <p>
                        Dates
                        <ul>
                          {formattedDates
                            .slice(0, Math.ceil(formattedDates.length / 2))
                            .map((formattedDate: any, idx: any) => (
                              <li key={idx}>{formattedDate}</li>
                            ))}
                        </ul>
                      </p>
                    </div>
                    <div style={{ marginRight: "10px", width: "50%" }}>
                      <p>&nbsp;</p>
                      <p>
                        <ul>
                          {formattedDates
                            .slice(Math.ceil(formattedDates.length / 2))
                            .map((formattedDate: any, idx: any) => (
                              <li key={idx}>{formattedDate}</li>
                            ))}
                        </ul>
                      </p>
                    </div>
                  </div>

                  <div
                    style={{
                      marginTop: "10px",
                      float: "right",
                    }}
                  >
                    <Tooltip title="Edit">
                      <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => handleEditSchedule(schedule)}
                        style={{ marginBottom: 8 }}
                      >
                        Edit
                      </Button>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <Popconfirm
                        title="Are you sure you want to delete this schedule?"
                        onConfirm={() => handleDeleteSchedule(schedule)}
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
            <p>No schedules available</p>
          )}
        </div>
      ),
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: (text: any, record: any) => (
        <span>
          <Button
            type="link"
            icon={<EditOutlined />}
            disabled={!record?.email_config_uid}
            onClick={() => handleEditConfig(record?.email_config_uid)}
          >
            Edit Config
          </Button>

          <Tooltip title="Delete">
            <Popconfirm
              title="Are you sure you want to delete this config type?"
              onConfirm={() => handleDeleteConfig(record?.email_config_uid)}
              okText="Yes"
              cancelText="No"
            >
              <Button
                disabled={!record?.email_config_uid}
                type="link"
                icon={<DeleteOutlined />}
                danger
              >
                Delete Config
              </Button>
            </Popconfirm>
          </Tooltip>
        </span>
      ),
    },
  ];

  const handleEditConfig = async (config_uid: string) => {
    console.log("handleEditConfig:", config_uid);
  };

  const handleDeleteConfig = async (config_uid: string) => {
    try {
      console.log("handleDeleteConfig:", config_uid);

      const response = await dispatch(
        deleteEmailConfig({
          id: config_uid,
        })
      );

      if (response?.payload?.data?.success) {
        message.success("Email config deleted successfully");
        fetchEmailSchedules();
      } else {
        message.error("Failed to delete email config");
      }
    } catch (error) {
      console.error("Error deleting config:", error);
      message.error("An error occurred while deleting email config");
    }
  };
  const handleDeleteSchedule = async (schedule: any) => {
    try {
      console.log("Deleting schedule:", schedule);
      const emailScheduleUid = schedule.email_schedule_uid;
      const emailConfigUid = schedule.email_config_uid;
      const response = await dispatch(
        deleteEmailSchedule({
          id: emailScheduleUid,
          email_config_uid: emailConfigUid,
        })
      );

      if (response?.payload?.data?.success) {
        message.success("Schedule deleted successfully");
        const res = await fetchEmailSchedules();
        console.log("fetchEmailSchedules", res);
      } else {
        message.error("Failed to delete schedule");
      }
    } catch (error) {
      console.error("Error deleting schedule:", error);
      message.error("An error occurred while deleting schedule");
    }
  };

  const handleEditSchedule = (schedule: any) => {
    // Show the drawer for editing with the trigger data
    console.log("edit schedule:", schedule);
    setEditScheduleValues(schedule);
    showEditScheduleDrawer();
  };

  return (
    <>
      {data.length > 0 ? (
        <SchedulesTable
          dataSource={data}
          columns={scheduleColumns}
          pagination={{
            pageSize: paginationPageSize,
            pageSizeOptions: [10, 25, 50, 100],
            showSizeChanger: true,
            showQuickJumper: true,
            onShowSizeChange: (_, size) => setPaginationPageSize(size),
          }}
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
              For this survey, email schedules have not yet been set up. Kindly
              proceed to configure the emails.
            </p>
          </div>
        </div>
      )}
      <Drawer
        title={"Edit Email Schedule"}
        width={650}
        onClose={closeEditScheduleDrawer}
        open={isEditScheduleDrawerVisible}
        style={{ paddingBottom: 80, fontFamily: "Lato" }}
      >
        <EmailScheduleEditForm
          handleBack={closeEditScheduleDrawer}
          handleContinue={closeEditScheduleDrawer}
          initialValues={editScheduleValues}
          fetchEmailSchedules={fetchEmailSchedules}
        />
      </Drawer>{" "}
    </>
  );
}

export default EmailSchedules;
