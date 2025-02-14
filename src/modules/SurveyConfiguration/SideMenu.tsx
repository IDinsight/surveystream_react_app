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
          <Tooltip title={getTooltipTitle()}>
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
          </Tooltip>
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
