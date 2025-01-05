import { useAppSelector } from "../../redux/hooks";
import { RootState } from "../../redux/store";
import FullScreenLoader from "../../components/Loaders/FullScreenLoader";
import { Button, Divider, List, Result, Typography } from "antd";
import { GlobalStyle } from "../../shared/Global.styled";
import Footer from "../../components/Footer";
import { CheckCircleFilled, WarningFilled } from "@ant-design/icons";

function Notifications() {
  const {
    loading: isNotificationLoading,
    error,
    notifications,
  } = useAppSelector((state: RootState) => state.notifications);

  const markAllAsRead = () => {
    // Mark all notifications as read
  };

  return (
    <>
      <GlobalStyle />
      {isNotificationLoading ? (
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
                  backgroundColor: "#fff",
                  marginBottom: 62,
                  marginTop: 32,
                  display: "flex",
                  justifyContent: "center",
                }}
                dataSource={notifications}
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
                          <Button
                            type="link"
                            onClick={markAllAsRead}
                            style={{ marginLeft: "auto" }}
                          >
                            Mark all as read
                          </Button>
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
                          <WarningFilled
                            style={{ color: "#F5222D", fontSize: 24 }}
                          />
                        )}
                      </div>
                      <div>
                        <p style={{ marginTop: 0, fontWeight: "bold" }}>
                          {item.survey_id}
                        </p>
                        <p style={{ marginBottom: 0 }}>{item.message}</p>
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
