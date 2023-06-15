import { Progress } from "antd";
import {
  HelpCard,
  StepCard,
  StepsWrapper,
  SideMenuWrapper,
  HelpList,
  HelpListItem,
} from "./SurveyConfiguration.styled";

interface SurveyProgress {
  [key: string]: string[] | any;
}

function SideMenu({ surveyProgress }: { surveyProgress: SurveyProgress }) {
  return (
    <SideMenuWrapper>
      <StepCard title="Configuration completion">
        <StepsWrapper>
          <div
            style={{
              width: "24%",
              display: "inline-block",
              marginRight: "2px",
            }}
          >
            <Progress
              percent={
                surveyProgress["Basic Information"]?.status === "Done" ||
                surveyProgress["Basic Information"]?.status === "Error"
                  ? 100
                  : 0
              }
              strokeColor={
                surveyProgress["Basic Information"]?.status === "Error"
                  ? "#F5222D"
                  : "#1D39C4"
              }
              showInfo={false}
              strokeWidth={10}
            />
          </div>
          <div
            style={{
              width: "24%",
              display: "inline-block",
              marginRight: "2px",
            }}
          >
            <Progress
              percent={
                surveyProgress["Module Selection"]?.status === "Done" ||
                surveyProgress["Module Selection"]?.status === "Error"
                  ? 100
                  : 0
              }
              strokeColor={
                surveyProgress["Module Selection"]?.status === "Error"
                  ? "#F5222D"
                  : "#1D39C4"
              }
              showInfo={false}
              strokeWidth={10}
            />
          </div>
          <div
            style={{
              width: "24%",
              display: "inline-block",
              marginRight: "2px",
            }}
          >
            <Progress
              percent={
                Array.isArray(surveyProgress["Survey Information"]) &&
                surveyProgress["Survey Information"].every(
                  (step, index, array) =>
                    index === array.length - 1 && step.status === "Done"
                )
                  ? 100
                  : 0
              }
              strokeColor={
                Array.isArray(surveyProgress["Survey Information"]) &&
                surveyProgress["Survey Information"].some(
                  (step) => step.status === "Error"
                )
                  ? "#F5222D"
                  : surveyProgress["Survey Information"]?.length > 0 &&
                    surveyProgress["Survey Information"].length ===
                      surveyProgress["Survey Information"].filter(
                        (step: { status: string }) => step.status === "Done"
                      ).length
                  ? "#52C41A"
                  : "#1D39C4"
              }
              showInfo={
                Array.isArray(surveyProgress["Survey Information"]) &&
                surveyProgress["Survey Information"].length > 0 &&
                surveyProgress["Survey Information"].length ===
                  surveyProgress["Survey Information"].filter(
                    (step) => step.status === "Done"
                  ).length
              }
              strokeWidth={10}
            />
          </div>
          <div style={{ width: "24%", display: "inline-block" }}>
            <Progress
              percent={
                Array.isArray(surveyProgress["Module Configuration"]) &&
                surveyProgress["Module Configuration"].every(
                  (step, index, array) =>
                    index === array.length - 1 && step.status === "Done"
                )
                  ? 100
                  : 0
              }
              strokeColor={
                Array.isArray(surveyProgress["Module Configuration"]) &&
                surveyProgress["Module Configuration"].some(
                  (step) => step.status === "Error"
                )
                  ? "#F5222D"
                  : surveyProgress["Module Configuration"]?.length > 0 &&
                    surveyProgress["Module Configuration"].length ===
                      surveyProgress["Module Configuration"].filter(
                        (step: { status: string }) => step.status === "Done"
                      ).length
                  ? "#52C41A"
                  : "#1D39C4"
              }
              showInfo={
                Array.isArray(surveyProgress["Module Configuration"]) &&
                surveyProgress["Module Configuration"].length > 0 &&
                surveyProgress["Module Configuration"].length ===
                  surveyProgress["Module Configuration"].filter(
                    (step) => step.status === "Done"
                  ).length
              }
              strokeWidth={10}
            />
          </div>
        </StepsWrapper>
        <div
          style={{
            marginTop: "5px",
            color: "#BFBFBF",
            fontSize: "12px",
          }}
        >
          The survey progress updates as you finish steps on the right
        </div>
      </StepCard>

      <HelpCard>
        <div>Need help?</div>
        <HelpList>
          <HelpListItem color="#1D39C4">
            <a
              href="https://sites.google.com/idinsight.org/dod-surveystream-onboarding/home#h.lofoqzg1pbqb"
              target="_blank"
              rel="noreferrer"
            >
              Watch SurveyStream demo
            </a>
          </HelpListItem>
          <HelpListItem color="#1D39C4">
            <a
              href="https://sites.google.com/idinsight.org/dod-surveystream-onboarding/features"
              target="_blank"
              rel="noreferrer"
            >
              How to choose modules for your survey?
            </a>
          </HelpListItem>
          <HelpListItem color="#1D39C4">
            <a
              href="https://docs.surveycto.com/04-monitoring-and-management/01-the-basics/00.managing-server.html"
              target="_blank"
              rel="noreferrer"
            >
              How to connect with SurveyCTO?
            </a>
          </HelpListItem>
          <HelpListItem color="#262626">
            <a
              href="https://sites.google.com/idinsight.org/dod-surveystream-onboarding/home"
              target="_blank"
              rel="noreferrer"
            >
              View all help topics -&gt;
            </a>
          </HelpListItem>
        </HelpList>
      </HelpCard>
    </SideMenuWrapper>
  );
}

export default SideMenu;
