import { useAppSelector } from "../../redux/hooks";
import { RootState } from "../../redux/store";
import FullScreenLoader from "../../components/Loaders/FullScreenLoader";
import { Button, Divider, List, Result, Typography } from "antd";
import Footer from "../../components/Footer";
import {
  CheckCircleFilled,
  InfoCircleOutlined,
  WarningFilled,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useEffect, useState } from "react";
import { getModulePath } from "../../utils/helper";

dayjs.extend(relativeTime);

function Notifications() {
  const navigate = useNavigate();
  const [initialLoad, setInitialLoad] = useState(true);

  const {
    loading: isNotificationLoading,
    error,
    notifications,
  } = useAppSelector((state: RootState) => state.notifications);

  const markAllAsRead = () => {
    // Mark all notifications as read
  };

  useEffect(() => {
    if (isNotificationLoading) {
      setInitialLoad(false);
    }
  }, [isNotificationLoading]);

  return (
    <>
      {initialLoad && isNotificationLoading ? (
        <FullScreenLoader />
      ) : (
        <>
          {error ? (
            <Result
              status="error"
              title="Something went wrong"
              subTitle="Currently unable to fetch notifications. Please try again later."
              extra={
                <Button
                  onClick={window.location.reload}
                  type="primary"
                  className="bg-geekblue-5 h-[40px]"
                  size="large"
                >
                  Reload notifications
                </Button>
              }
            />
          ) : (
            <>
              <List
                style={{
                  backgroundColor: "#FAFAFA",
                  marginTop: 32,
                  marginBottom: 128,
                  marginLeft: 128,
                  marginRight: 128,
                }}
                bordered
                dataSource={notifications}
                pagination={
                  notifications.length > 10 && {
                    pageSize: 10,
                    size: "small",
                  }
                }
                locale={{
                  emptyText: (
                    <span style={{ fontWeight: "bold" }}>
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
                          <Typography
                            style={{ fontSize: 24, fontWeight: "bold" }}
                          >
                            Notifications
                          </Typography>
                          {/* <Button
                            type="link"
                            onClick={markAllAsRead}
                            style={{ marginLeft: "auto" }}
                          >
                            Mark all as read
                          </Button> */}
                        </div>
                        <Divider
                          style={{ color: "black", margin: "12px 0 0 0" }}
                        />
                      </>
                    )}
                    <List.Item
                      style={{
                        display: "flex",
                        justifyContent: "flex-start",
                        alignItems: "flex-start",
                        minWidth: 450,
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
                            <span style={{ fontWeight: "bold" }}>
                              {item.survey_id}
                            </span>
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
                                navigate(
                                  getModulePath(item.survey_uid, item.module_id)
                                )
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
              />
              <Footer />
            </>
          )}
        </>
      )}
    </>
  );
}

export default Notifications;
