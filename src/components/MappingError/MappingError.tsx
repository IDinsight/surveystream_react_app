import { useNavigate } from "react-router-dom";
import NotebooksImg from "./../../assets/notebooks.svg";

interface MappingErrorProps {
  mappingName: string;
  error: string;
}

const MappingError = ({ mappingName, error }: MappingErrorProps) => {
  const navigate = useNavigate();
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "calc(100vh - 250px)",
      }}
    >
      <div style={{ display: "flex" }}>
        <img
          src={NotebooksImg}
          height={200}
          width={205}
          alt="Empty data"
          style={{
            marginLeft: "auto",
            marginRight: "auto",
          }}
        />
        <div
          style={{
            justifyContent: "center",
            alignItems: "center",
            width: "60%",
          }}
        >
          <p
            style={{
              color: "#8C8C8C",
              fontFamily: "Lato",
              fontSize: "24px",
              lineHeight: "30px",
              marginLeft: "20px",
            }}
          >
            Cannot load mapping data
          </p>
          <p
            style={{
              color: "#8C8C8C",
              fontFamily: "Lato",
              fontSize: "14px",
              lineHeight: "22px",
              marginLeft: "20px",
            }}
          >
            Reason:{" " + error}
          </p>
          <p
            style={{
              color: "#8C8C8C",
              fontFamily: "Lato",
              fontSize: "14px",
              lineHeight: "22px",
              marginLeft: "20px",
            }}
          >
            Please contact the survey admin if you believe this is an error.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MappingError;
