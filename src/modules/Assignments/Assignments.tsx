import { Link, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import FullScreenLoader from "../../components/Loaders/FullScreenLoader";
import Header from "../../components/Header";
import NavItems from "../../components/NavItems";
import { CustomTab, SearchBox } from "./Assignments.styled";
import Container from "../../components/Layout/Container";
import { Button, Tabs, TabsProps } from "antd";
import {
  ArrowUpOutlined,
  CheckCircleFilled,
  ClearOutlined,
  ControlFilled,
  DownloadOutlined,
  UserAddOutlined,
  WarningFilled,
} from "@ant-design/icons";
import NotebooksImg from "./../../assets/notebooks.svg";
import AssignmentsTab from "./AssignmentsTab/AssignmentsTab";
import SurveyorsTab from "./SurveyorsTab/SurveyorsTab";
import TargetsTab from "./TargetsTab/TargetsTab";

function Assignments() {
  const navigate = useNavigate();

  const [data, setData] = useState<string[]>(["a"]);
  const isLoading = false;

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Assignments (1000)",
      children: <AssignmentsTab />,
    },
    {
      key: "2",
      label: "Surveyors (50)",
      children: <SurveyorsTab />,
    },
    {
      key: "3",
      label: "Targets (1000)",
      children: <TargetsTab />,
    },
  ];

  return (
    <>
      <Header items={NavItems} />
      {isLoading ? (
        <FullScreenLoader />
      ) : (
        <>
          <Container />
          <div>
            <div
              style={{
                height: "55px",
                paddingLeft: "48px",
                paddingRight: "48px",
                display: "flex",
                alignItems: "center",
                borderTop: "1px solid #00000026",
                borderBottom: "1px solid #00000026",
              }}
            >
              <p
                style={{
                  color: "#262626",
                  fontFamily: "Inter",
                  fontSize: "20px",
                  fontWeight: 500,
                  lineHeight: "28px",
                }}
              >
                Assignments
              </p>
              {data.length > 0 ? (
                <div style={{ display: "flex", gap: 16, marginLeft: 28 }}>
                  <div
                    style={{
                      backgroundColor: "#F6FFED",
                      padding: "4px 12px",
                      display: "flex",
                      alignItems: "center",
                      height: 30,
                      borderRadius: 24,
                    }}
                  >
                    <CheckCircleFilled
                      style={{ fontSize: 16, color: "#389E0D" }}
                    />
                    <p style={{ marginLeft: 8 }}>100 Completed</p>
                  </div>
                  <div
                    style={{
                      backgroundColor: "#FFF7E6",
                      padding: "4px 12px",
                      display: "flex",
                      alignItems: "center",
                      height: 30,
                      borderRadius: 24,
                    }}
                  >
                    <ControlFilled style={{ fontSize: 16, color: "#D46B08" }} />
                    <p style={{ marginLeft: 8 }}>200 Assigned</p>
                  </div>
                  <div
                    style={{
                      backgroundColor: "#FFF1F0",
                      padding: "4px 12px",
                      display: "flex",
                      alignItems: "center",
                      height: 30,
                      borderRadius: 24,
                    }}
                  >
                    <WarningFilled style={{ fontSize: 16, color: "#CF1322" }} />
                    <p style={{ marginLeft: 8 }}>700 Unassigned</p>
                  </div>
                </div>
              ) : null}
              <SearchBox
                placeholder="Search"
                enterButton
                style={{ width: 250, marginLeft: "auto" }}
                onSearch={(val) => console.log(val)}
                onChange={(e) => console.log(e.target.value)}
              />
              <Button
                icon={<UserAddOutlined />}
                style={{ marginLeft: "16px" }}
                disabled
              >
                Upload assignments
              </Button>
              <Button
                disabled
                icon={<DownloadOutlined />}
                style={{ marginLeft: "16px" }}
              ></Button>
              <Button
                disabled
                icon={<ClearOutlined />}
                style={{ marginLeft: "16px" }}
              ></Button>
            </div>
            {data.length > 0 ? (
              <div>
                <CustomTab
                  style={{ paddingLeft: 48, paddingRight: 48 }}
                  defaultActiveKey="1"
                  items={items}
                  tabBarExtraContent={
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        color: "#2F54EB",
                        cursor: "pointer",
                      }}
                      onClick={() => window.open("#")}
                    >
                      <p>Assigning criteria</p>
                      <ArrowUpOutlined
                        style={{ fontSize: 16, transform: "rotate(45deg)" }}
                      />
                    </div>
                  }
                />
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "calc(100vh - 190px)",
                }}
              >
                <div>
                  <img
                    src={NotebooksImg}
                    height={220}
                    width={225}
                    alt="Empty data"
                  />
                  <p
                    style={{
                      color: "#8C8C8C",
                      fontFamily: "Inter",
                      fontSize: "14px",
                      lineHeight: "22px",
                    }}
                  >
                    Assignments have not yet been uploaded.
                  </p>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}

export default Assignments;
