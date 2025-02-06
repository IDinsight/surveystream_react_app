import { properCase } from "../../utils/helper";
import { Modal, message, Tooltip } from "antd";

import { useAppDispatch } from "../../redux/hooks";
import { useNavigate } from "react-router-dom";

import { WarningOutlined, QuestionOutlined } from "@ant-design/icons";
import { putSurveyState } from "../../redux/surveyConfig/surveyConfigActions";
import { getSurveyConfig } from "../../redux/surveyConfig/surveyConfigActions";
import { setActiveSurvey } from "../../redux/surveyList/surveysSlice";

interface ISurveyStateProps {
  survey_uid: string;
  survey_name: string;
  state?: string;
}

function SurveyState({ survey_uid, survey_name, state }: ISurveyStateProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [modal, contextHolder] = Modal.useModal();

  // Allowed changes: Active -> Draft, Draft -> Active, Past -> Draft
  const handleChangeState = async () => {
    const newState =
      state === "Active"
        ? "Draft"
        : state === "Draft"
        ? "Active"
        : state === "Past"
        ? "Draft"
        : "";

    if (!newState) {
      return;
    }
    modal.confirm({
      title: "Confirm state change",
      icon:
        state === "Active" ? (
          <WarningOutlined />
        ) : state === "Draft" ? (
          <QuestionOutlined />
        ) : state === "Past" ? (
          <QuestionOutlined />
        ) : null,
      content:
        state === "Active"
          ? "Are you sure you want to move this survey to 'Draft' state? This action will pause all the systems running for the survey."
          : state === "Draft"
          ? "Are you sure you want to move this survey to 'Active' state?"
          : state === "Past"
          ? "Are you sure you want to move this survey to 'Draft' state?"
          : "",
      okText: "Yes",
      cancelText: "Cancel",
      onOk: () => {
        dispatch(
          putSurveyState({ survey_uid: survey_uid, state: newState })
        ).then((response: any) => {
          if (response.payload.success) {
            message.success("Survey state updated successfully.");
            dispatch(getSurveyConfig({ survey_uid: survey_uid }));

            // Update the active survey
            dispatch(
              setActiveSurvey({
                survey_uid,
                survey_name: survey_name,
                state: newState,
              })
            );
          } else if (response.payload.message) {
            // Show error message in a popup modal
            modal.error({
              title: "Error",
              content: response.payload.message,
            });
          } else {
            message.error("Failed to update survey state.");
          }
        });
      },
    });
  };

  const getbgColor = (state: string, hover: boolean) => {
    if (hover) {
      return state === "Active"
        ? "#6fb293"
        : state === "Draft"
        ? "#eec76b"
        : "#d9d9d9";
    }
    if (state === "Active") {
      return "#f6ffed";
    } else if (state === "Draft") {
      return "#fff7e6";
    } else if (state === "Past") {
      return "#f5f5f5";
    }
    return "#00000040"; // Default return statement
  };

  const getBorderAndFontColor = (state: string, hover: boolean): string => {
    if (hover) {
      return state === "Active"
        ? "#092b00"
        : state === "Draft"
        ? "#873800"
        : "#595959";
    }
    if (state === "Active") {
      return "#237f5d";
    } else if (state === "Draft") {
      return "#d46b08";
    } else if (state === "Past") {
      return "#8c8c8c";
    }
    return "#00000040"; // Default return statement
  };

  return (
    <div style={{ display: "flex", gap: 16, marginLeft: 40 }}>
      {state ? (
        <Tooltip
          placement="bottom"
          title={
            state === "Active"
              ? "Click here to move the survey to draft state."
              : state === "Draft"
              ? "Click here to move the survey to active state. This action is allowed only after completing the survey configuration."
              : state === "Past"
              ? "Click here to move the survey to draft state. This action is allowed only after updating the survey end date to a future date."
              : ""
          }
          overlayInnerStyle={{ fontSize: "13px" }}
        >
          <div
            style={{
              backgroundColor: getbgColor(state, false),
              padding: "4px 12px",
              display: "flex",
              alignItems: "center",
              height: 12,
              borderRadius: 24,
              border: "1px solid " + getBorderAndFontColor(state, false),
              transition:
                "background-color 0.3s, border-color 0.3s, box-shadow 0.3s",
              color: getBorderAndFontColor(state, false),
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = getbgColor(state, true);
              e.currentTarget.style.cursor = "pointer";
              e.currentTarget.style.boxShadow =
                "0px 4px 8px rgba(0, 0, 0, 0.1)";
              e.currentTarget.style.border =
                "1px solid " + getBorderAndFontColor(state, true);
              e.currentTarget.style.color = getBorderAndFontColor(state, true);
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = getbgColor(state, false);
              e.currentTarget.style.cursor = "default";
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.border =
                "1px solid " + getBorderAndFontColor(state, false);
              e.currentTarget.style.color = getBorderAndFontColor(state, false);
            }}
            onClick={() => {
              handleChangeState();
            }}
          >
            <p
              style={{
                marginLeft: 8,
                marginRight: 8,
                fontFamily: "Lato",
                fontSize: 14,
                fontWeight: 500,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.cursor = "pointer";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.cursor = "default";
              }}
            >
              {properCase(state)}
            </p>
          </div>
        </Tooltip>
      ) : null}
      {contextHolder}
    </div>
  );
}

export default SurveyState;
