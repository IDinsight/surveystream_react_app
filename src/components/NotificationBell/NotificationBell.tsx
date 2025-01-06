import { Badge, Button, Divider, Dropdown, List, Typography } from "antd";
import {
  BellOutlined,
  CheckCircleFilled,
  ExpandAltOutlined,
  WarningFilled,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

interface INotificationBellProps {
  notifications: Array<any>;
}

const NotificationBell = ({ notifications }: INotificationBellProps) => {
  const markAllAsRead = () => {
    // Mark all notifications as read
  };

  const notificationList = (
    <>
      <List
        bordered
        dataSource={notifications?.slice(0, 20)}
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
                    <Button type="link" onClick={markAllAsRead}>
                      Mark all as read
                    </Button>
                    <Link to="/notifications">
                      <ExpandAltOutlined
                        style={{ marginLeft: 16, fontSize: 20 }}
                      />
                    </Link>
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
                  <WarningFilled style={{ color: "#F5222D", fontSize: 24 }} />
                )}
              </div>
              <div>
                <p style={{ marginTop: 0 }}>
                  <span style={{ fontWeight: "bold" }}>{item.survey_id}</span>
                  <span style={{ color: "grey", fontSize: 12, marginLeft: 8 }}>
                    {dayjs(item.created_at).fromNow()}
                  </span>
                </p>
                <p style={{ marginBottom: 0 }}>
                  {item.message} Checkout at{" "}
                  <Link to={`survey-configuration/${item.survey_uid}`}>
                    {item.module_name}
                  </Link>{" "}
                  module.
                </p>
              </div>
            </List.Item>
          </>
        )}
        style={{
          width: 500,
          height: 500,
          overflowY: "scroll",
          backgroundColor: "#fff",
        }}
      />
    </>
  );

  return (
    <Dropdown overlay={notificationList} trigger={["click"]}>
      <Badge dot>
        <BellOutlined style={{ fontSize: "24px", cursor: "pointer" }} />
      </Badge>
    </Dropdown>
  );
};

export default NotificationBell;
