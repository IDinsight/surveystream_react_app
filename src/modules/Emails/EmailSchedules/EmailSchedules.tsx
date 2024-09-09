import { Key, useState } from "react";
import { SchedulesTable } from "./EmailSchedules.styled";
import NotebooksImg from "../../../assets/notebooks.svg";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Tooltip, Button, Popconfirm, Drawer, message, DatePicker } from "antd";
import {
  deleteEmailConfig,
  deleteEmailSchedule,
} from "../../../redux/emails/emailsActions";
import { useAppDispatch } from "../../../redux/hooks";
import EmailScheduleEditForm from "./EmailScheduleEditForm";
import EmailConfigEditForm from "./EmailConfigEditForm";
import dayjs from "dayjs";

function EmailSchedules({ data, fetchEmailSchedules, sctoForms }: any) {
  const dispatch = useAppDispatch();
  const [isEditScheduleDrawerVisible, setIsEditScheduleDrawerVisible] =
    useState(false);

  const [isEditConfigDrawerVisible, setIsEditConfigDrawerVisible] =
    useState(false);

  const [editScheduleValues, setEditScheduleValues] = useState();

  const [editConfigValues, setEditConfigValues] = useState();

  const [paginationPageSize, setPaginationPageSize] = useState<number>(25);

  const showEditScheduleDrawer = () => {
    setIsEditScheduleDrawerVisible(true);
  };

  const closeEditScheduleDrawer = () => {
    setIsEditScheduleDrawerVisible(false);
  };

  const showEditConfigDrawer = () => {
    setIsEditConfigDrawerVisible(true);
  };

  const closeEditConfigDrawer = () => {
    setIsEditConfigDrawerVisible(false);
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

  const scheduleColumns = [
    {
      title: "Config Name",
      dataIndex: "config_name",
      key: "config_name",
      sorter: (a: any, b: any) => a.config_name.localeCompare(b.config_name),
      render: (text: any, record: any) => (
        <div
          style={{
            position: "relative",
            overflowWrap: "break-word",
            textAlign: "center",
            top: "5px",
          }}
        >
          <p>
            <span style={{ marginBottom: 10 }}>{record?.config_name}</span>
            <span
              style={{
                position: "relative",
                top: "5px",
              }}
            >
              <Tooltip title="Edit Config">
                <Button
                  type="link"
                  icon={<EditOutlined />}
                  disabled={!record?.email_config_uid}
                  onClick={() => handleEditConfig(record)}
                >
                  Edit Config
                </Button>
              </Tooltip>

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
          </p>
        </div>
      ),
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
                  <div style={{ marginRight: "10px", width: "30%" }}>
                    <p>Schedule Name : {email_schedule_name}</p>
                    <p>
                      Time : {dayjs(`1970-01-01T${time}Z`).format("hh:mm A")}
                    </p>
                    <Tooltip title="Edit">
                      <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => handleEditSchedule(schedule)}
                        style={{ marginBottom: 8 }}
                      >
                        Edit Schedule
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
                          Delete Schedule
                        </Button>
                      </Popconfirm>
                    </Tooltip>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      width: "100%",
                    }}
                  >
                    <p>
                      Dates:
                      <br />
                      <DatePicker
                        multiple={true}
                        placeholder="Select Dates"
                        format="YYYY-MM-DD"
                        minDate={dayjs()}
                        maxTagCount={10}
                        value={dates.map((date: string) => dayjs(date))}
                        style={{
                          width: "100%",
                          maxHeight: "85px",
                        }}
                        allowClear={false}
                        inputReadOnly={true}
                      />
                    </p>
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
  ];

  const handleEditConfig = async (schedule: any) => {
    // Show the drawer for editing with the trigger data
    setEditConfigValues(schedule);
    showEditConfigDrawer();
  };

  const handleDeleteConfig = async (config_uid: string) => {
    try {
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
      message.error("An error occurred while deleting email config");
    }
  };
  const handleDeleteSchedule = async (schedule: any) => {
    try {
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
      } else {
        message.error("Failed to delete schedule");
      }
    } catch (error) {
      message.error("An error occurred while deleting schedule");
    }
  };

  const handleEditSchedule = (schedule: any) => {
    // Show the drawer for editing with the trigger data
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
      <Drawer
        title={"Edit Email Config"}
        width={650}
        onClose={closeEditConfigDrawer}
        open={isEditConfigDrawerVisible}
        style={{ paddingBottom: 80, fontFamily: "Lato" }}
      >
        <EmailConfigEditForm
          initialValues={editConfigValues}
          fetchEmailSchedules={fetchEmailSchedules}
          sctoForms={sctoForms}
        ></EmailConfigEditForm>
      </Drawer>
    </>
  );
}

export default EmailSchedules;
