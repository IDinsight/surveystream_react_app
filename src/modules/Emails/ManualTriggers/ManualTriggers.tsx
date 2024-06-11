import { useState } from "react";
import { Button, Popconfirm, Tooltip } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { format } from "date-fns";
import NotebooksImg from "../../../assets/notebooks.svg";
import { ManualTriggersTable } from "./ManualTriggers.styled";

function ManualTriggers({ data, surveyEnumerators }: any) {
  const [paginationPageSize, setPaginationPageSize] = useState<number>(25);

  const handleDeleteTrigger = (trigger: any) => {
    // Implement the delete logic here
    console.log("Deleting trigger:", trigger);
    // Call API to delete the trigger or update the state`
  };

  const handleEditTrigger = (trigger: any) => {
    // Show the drawer for editing with the trigger data
    console.log("edit trigger:", trigger);
  };
  const manualTriggerColumns = [
    {
      title: "Config Type",
      dataIndex: "config_type",
      key: "config_type",
      sorter: (a: any, b: any) => a.config_type.localeCompare(b.config_type),
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
              return (
                <div
                  className="custom-card"
                  style={{ display: "flex", marginBottom: "10px" }}
                  key={index}
                >
                  <div style={{ marginRight: "10px" }}>
                    <p>Date: {date}</p>
                    <p>
                      Time: {format(new Date(`1970-01-01T${time}Z`), "hh:mm a")}
                    </p>
                    <p>
                      Recipients:{" "}
                      {recipients
                        .map(
                          (id) =>
                            surveyEnumerators?.find(
                              (e: any) => e.enumerator_id == id
                            )?.name || ""
                        )
                        .join(", ")}
                    </p>
                    <p>Status: {status}</p>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      marginRight: "auto",
                      marginTop: "10px",
                      marginLeft: "30%",
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
          pagination={{ pageSize: paginationPageSize }}
          rowKey={(record) => record.config_type}
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
    </>
  );
}

export default ManualTriggers;
