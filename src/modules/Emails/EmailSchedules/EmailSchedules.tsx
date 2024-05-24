import { useState } from "react";
import { SchedulesTable } from "./EmailSchedules.styled";
import NotebooksImg from "../../../assets/notebooks.svg";

function EmailSchedules({ data, columns }: any) {
  const [paginationPageSize, setPaginationPageSize] = useState<number>(25);

  return (
    <>
      {data.length > 0 ? (
        <SchedulesTable
          dataSource={data}
          columns={columns}
          expandable={{
            expandedRowRender: (record) => (
              <p style={{ margin: 0 }}>
                <strong>Schedule Details:</strong>
                <br />
                Dates: {record.schedule?.dates.join(", ")}
                <br />
                Time: {record.schedule?.time}
              </p>
            ),
            rowExpandable: () => true,
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
    </>
  );
}

export default EmailSchedules;
