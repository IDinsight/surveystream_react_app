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
                surveyProgress["Basic Information"]?.status === "Done" ? 100 : 0
              }
              strokeColor="#1D39C4"
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
                surveyProgress["Module Selection"]?.status === "Done" ? 100 : 0
              }
              strokeColor="#1D39C4"
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
              strokeColor="#1D39C4"
              showInfo={false}
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
              strokeColor="#1D39C4"
              showInfo={false}
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
            <a href="#" target="_blank">
              Watch SurveyStream demo
            </a>
          </HelpListItem>
          <HelpListItem color="#1D39C4">
            <a href="#" target="_blank">
              How to choose modules for your survey?
            </a>
          </HelpListItem>
          <HelpListItem color="#1D39C4">
            <a href="#" target="_blank">
              How to connect with SurveyCTO?
            </a>
          </HelpListItem>
          <HelpListItem color="#262626">
            <a href="#" target="_blank">
              View all help topics -&gt;
            </a>
          </HelpListItem>
        </HelpList>
      </HelpCard>
    </SideMenuWrapper>
  );
}

export default SideMenu;
