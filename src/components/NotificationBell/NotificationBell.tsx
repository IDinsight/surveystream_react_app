import { Badge, Button, Divider, Dropdown, List, Typography } from "antd";
import {
  BellOutlined,
  CheckCircleFilled,
  ExpandAltOutlined,
  InfoCircleOutlined,
  WarningFilled,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { getModulePath } from "../../utils/helper";

dayjs.extend(relativeTime);

interface INotificationBellProps {
  notifications: Array<any>;
}

const NotificationBell = ({ notifications }: INotificationBellProps) => {
  const navigate = useNavigate();

  // const markAllAsRead = () => {
  // };

  const notificationList = (
    <>
      <List
        bordered
        dataSource={notifications?.slice(0, 20)}
        locale={{
          emptyText: (
            <span style={{ fontWeight: "bold", fontSize: 18 }}>
              No notifications to display.
            </span>
          ),
        }}
        renderItem={(item: any, index: number) => (
          <>
            {index === 0 && (
              <>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "8px 16px",
                  }}
                >
                  <Typography style={{ fontSize: 16, fontWeight: "bold" }}>
                    Notifications
                  </Typography>
                  <div style={{ marginLeft: "auto" }}>
                    {/* <Button type="link" onClick={markAllAsRead}>
                      Mark all as read
                    </Button> */}
                    <Link to="/notifications">View all notifications</Link>
                  </div>
                </div>
                <Divider style={{ color: "black", margin: "12px 0 0 0" }} />
              </>
            )}
            <List.Item
              style={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "flex-start",
              }}
            >
              <div style={{ marginRight: 12 }}>
                {item.resolution_status === "done" ? (
                  <CheckCircleFilled
                    style={{ color: "#52C41A", fontSize: 24 }}
                  />
                ) : (
                  <>
                    {item.severity === "error" && (
                      <WarningFilled
                        style={{ color: "#F5222D", fontSize: 24 }}
                      />
                    )}
                    {item.severity === "warning" && (
                      <WarningFilled
                        style={{ color: "#FA8C16", fontSize: 24 }}
                      />
                    )}
                    {item.severity === "alert" && (
                      <InfoCircleOutlined
                        style={{ color: "#2F54EB", fontSize: 24 }}
                      />
                    )}
                  </>
                )}
              </div>
              <div>
                <p style={{ marginTop: 0 }}>
                  {item.type === "survey" && (
                    <span style={{ fontWeight: "bold" }}>{item.survey_id}</span>
                  )}
                  {item.type === "user" && <span>{item.message}</span>}
                  <span
                    style={{
                      color: "grey",
                      fontSize: 12,
                      marginLeft: 8,
                    }}
                  >
                    {dayjs(item.created_at).fromNow()}
                  </span>
                </p>
                {item.type === "survey" && (
                  <p style={{ marginBottom: 0 }}>
                    {item.message} Checkout at{" "}
                    <span
                      style={{ color: "#1890ff", cursor: "pointer" }}
                      onClick={() =>
                        navigate(getModulePath(item.survey_uid, item.module_id))
                      }
                    >
                      {item.module_name}
                    </span>{" "}
                    module.
                  </p>
                )}
              </div>
            </List.Item>
          </>
        )}
        style={{
          width: 500,
          height: notifications?.length > 0 ? 500 : 80,
          overflowY: "scroll",
          backgroundColor: "#fff",
        }}
      />
    </>
  );

  return (
    <Dropdown overlay={notificationList} trigger={["click"]}>
      <Badge
        dot={notifications?.some(
          (notification) => notification.resolution_status !== "done"
        )}
      >
        <BellOutlined style={{ fontSize: "24px", cursor: "pointer" }} />
      </Badge>
    </Dropdown>
  );
};

export default NotificationBell;
