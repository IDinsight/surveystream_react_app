import { useState } from "react";
import { ManualTriggersTable } from "./ManualTriggers.styled";

function ManualTriggers({ data, columns }: any) {
  const [paginationPageSize, setPaginationPageSize] = useState<number>(25);

  return (
    <>
      <ManualTriggersTable
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

export default ManualTriggers;
