import { useState } from "react";
import { ManualTriggersTable } from "./ManualTriggers.styled";
import NotebooksImg from "../../../assets/notebooks.svg";

function ManualTriggers({ data, columns }: any) {
  const [paginationPageSize, setPaginationPageSize] = useState<number>(25);

  return (
    <>
      {data.length > 0 ? (
        <ManualTriggersTable dataSource={data} columns={columns} />
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
