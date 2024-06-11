import { useState } from "react";
import { SchedulesTable } from "./EmailSchedules.styled";
import NotebooksImg from "../../../assets/notebooks.svg";
import { format } from "date-fns";

function EmailSchedules({ data }: any) {
  const [paginationPageSize, setPaginationPageSize] = useState<number>(25);
  const scheduleColumns = [
    {
      title: "Config Type",
      dataIndex: "config_type",
      key: "config_type",
    },
    {
      title: "Schedules",
      key: "schedules",
      render: (record: {
        schedules: {
          dates: string[];
          time: string;
          email_schedule_name: string;
        }[];
      }) => (
        <div>
          {record.schedules.length > 0 ? (
            record.schedules.map((schedule, index) => (
              <div key={index} style={{ marginBottom: "10px" }}>
                <p>Schedule Name: {schedule?.email_schedule_name}</p>
                <p>
                  Dates:{" "}
                  {schedule.dates
                    .map((date) => format(new Date(date), "MMM dd, yyyy"))
                    .join(", ")}
                </p>
                <p>
                  Time:{" "}
                  {format(new Date(`1970-01-01T${schedule.time}Z`), "hh:mm a")}
                </p>
                {index < record.schedules.length - 1 && <hr />}
              </div>
            ))
          ) : (
            <p>No schedules available</p>
          )}
        </div>
      ),
    },
    {
      title: "Templates",
      key: "templates",
      render: (record: {
        templates: {
          language: string;
          subject: string;
          content: string;
        }[];
      }) => (
        <div>
          {record.templates.length > 0 ? (
            record.templates.map((template, index) => (
              <div key={index} style={{ marginBottom: "10px" }}>
                <p>Language: {template?.language}</p>
                <p>Subject: {template?.subject}</p>

                <p>Content: {template?.content}</p>

                {index < record.templates.length - 1 && <hr />}
              </div>
            ))
          ) : (
            <p>No templates available</p>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      {data.length > 0 ? (
        <SchedulesTable dataSource={data} columns={scheduleColumns} />
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
    </>
  );
}

export default EmailSchedules;
