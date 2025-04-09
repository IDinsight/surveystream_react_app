import { Progress, Tooltip, List } from "antd";
import {
  HelpCard,
  StepCard,
  StepsWrapper,
  SideMenuWrapper,
  HelpList,
  HelpListItem,
  ToolTipText,
} from "./SurveyConfiguration.styled";
import { SelectOutlined, QuestionCircleOutlined } from "@ant-design/icons";

interface SurveyProgress {
  [key: string]: string[] | any;
}

interface CompletionStats {
  num_modules: number;
  num_completed: number;
  num_in_progress: number;
  num_in_progress_incomplete: number;
  num_not_started: number;
  num_error: number;
  num_optional: number;
}

function SideMenu({
  surveyProgress,
  completionStats,
  windowHeight,
}: {
  surveyProgress: SurveyProgress;
  completionStats: CompletionStats;
  windowHeight: number;
}) {
  const numModules = completionStats?.num_modules || 0;
  const numCompleted = completionStats?.num_completed || 0;
  const numInProgress = completionStats?.num_in_progress || 0;
  const numInProgressIncomplete =
    completionStats?.num_in_progress_incomplete || 0;
  const numError = completionStats?.num_error || 0;
  const numNotStarted = completionStats?.num_not_started || 0;
  const numOptional = completionStats?.num_optional || 0;

  const size = 170 / (numModules === 0 ? 10 : numModules);

  const getStrokeColor = (step: number) => {
    if (step <= numCompleted) {
      return "#359d73"; // Green (Completed)
    } else if (step <= numCompleted + numInProgress) {
      return "#eec76b"; // Different green (In Progress but Completed)
    } else if (step <= numCompleted + numInProgress + numInProgressIncomplete) {
      return "#ea8553"; // Orange (In Progress and Incomplete)
    } else if (
      step <=
      numCompleted + numInProgress + numInProgressIncomplete + numError
    ) {
      return "#d70e17"; // Red (Error)
    } else {
      return "#d9d9d9"; // Grey (Not Started)
    }
  };

  const getTooltipTitle = () => {
    return [
      numCompleted + numInProgress == numModules ? (
        <ToolTipText key="completedAll">
          Congratulations! All {numModules} modules are complete.
        </ToolTipText>
      ) : null,
      numNotStarted == numModules ? (
        <ToolTipText key="notStarted">
          Get started! {numModules} modules to configure.
        </ToolTipText>
      ) : null,
      numCompleted + numInProgress < numModules ? (
        <ToolTipText key="inProgress">
          Keep going! {numModules - numCompleted - numInProgress} out of{" "}
          {numModules} modules remaining:
          <ol
            style={{
              paddingTop: "0px",
              paddingLeft: "20px",
              listStyleType: "circle",
            }}
          >
            {numInProgressIncomplete ? (
              <li>{numInProgressIncomplete} modules incomplete</li>
            ) : null}
            {numError ? <li>{numError} modules with errors</li> : null}
            {numNotStarted ? (
              <li>{numNotStarted} modules not started</li>
            ) : null}
          </ol>
        </ToolTipText>
      ) : null,
      numOptional ? (
        <ToolTipText key="optional">
          Note: {numOptional} optional module
          {numOptional > 1 ? "s are" : " is"} not included in the progress bar.
        </ToolTipText>
      ) : null,
    ];
  };

  return (
    <SideMenuWrapper windowHeight={windowHeight}>
      <StepCard title="Configuration completion">
        <StepsWrapper>
          <Progress
            type="line"
            steps={numModules || 10}
            percent={100}
            size={[size, 10]}
            showInfo={false}
            trailColor={"#d9d9d9"}
            strokeColor={Array.from(
              { length: completionStats?.num_modules },
              (_, index) => {
                return getStrokeColor(index + 1);
              }
            )}
          />
        </StepsWrapper>
        <div
          style={{
            marginTop: "5px",
            fontSize: "14px",
          }}
        >
          {numCompleted + numInProgress == numModules ? (
            <span>
              {numModules} / {numModules} modules complete
            </span>
          ) : null}
          {numNotStarted == numModules ? (
            <span>0 / {numModules} modules complete</span>
          ) : null}
          {numCompleted + numInProgress < numModules ? (
            <span>
              {numCompleted + numInProgress} / {numModules} modules complete
            </span>
          ) : null}
          {numOptional ? (
            <Tooltip
              title={`Complete includes modules with status 'Done' and 'In Progress'. Also, ${numOptional} optional module${
                numOptional > 1 ? "s are" : " is"
              } not included in the count.`}
            >
              &nbsp;
              <QuestionCircleOutlined />
            </Tooltip>
          ) : null}

          {numCompleted + numInProgress < numModules ? (
            <span style={{ display: "block", marginTop: "5px" }}>
              Remaining modules are:
              <ol
                style={{
                  paddingTop: "0px",
                  paddingLeft: "20px",
                  listStyleType: "circle",
                }}
              >
                {numInProgressIncomplete ? (
                  <li>Incomplete - {numInProgressIncomplete}</li>
                ) : null}
                {numError ? <li>Error - {numError}</li> : null}
                {numNotStarted ? <li>Not Started - {numNotStarted}</li> : null}
              </ol>
            </span>
          ) : null}
        </div>
      </StepCard>

      <HelpCard>
        <div>Need help?</div>
        <HelpList>
          <HelpListItem color="#1D39C4">
            Learn about the setup process or troubleshoot your issues in the{" "}
            <a
              href="https://docs.surveystream.idinsight.io/setup_process"
              target="_blank"
              rel="noreferrer"
            >
              docs
              <SelectOutlined
                rotate={90}
                style={{ marginLeft: "3px", padding: "0px", fontSize: "15px" }}
              />{" "}
            </a>
          </HelpListItem>
        </HelpList>
      </HelpCard>
    </SideMenuWrapper>
  );
}

export default SideMenu;
