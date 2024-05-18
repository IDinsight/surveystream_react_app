import { useState } from "react";
import { SchedulesTable } from "./EmailSchedules.styled";

function EmailSchedules({ data, columns }: any) {
  const [paginationPageSize, setPaginationPageSize] = useState<number>(25);

  return (
    <>
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
    </>
  );
}

export default EmailSchedules;
