import { Dispatch, SetStateAction } from "react";
import {
  SideMenuWrapper,
  MenuItem,
  IconWrapper,
  InfoIcon,
  QuestionIcon,
} from "../../shared/SideMenu.styled";
import { IStepIndex } from "./NewSurveyConfig";

interface ISideMenuProps {
  stepIndex: IStepIndex;
  setStepIndexHandler: Dispatch<SetStateAction<IStepIndex>>;
}

function SideMenu({ stepIndex, setStepIndexHandler }: ISideMenuProps) {
  const menus = [
    { text: "Basic Information", icon: <InfoIcon /> },
    { text: "Module questionnaire", icon: <QuestionIcon /> },
  ];

  return (
    <div>
      <SideMenuWrapper>
        {menus.map((item: { text: string; icon: any }, index: number) => (
          <MenuItem
            key={index}
            className={stepIndex["sidebar"] === index ? "active" : ""}
          >
            <IconWrapper>{item.icon}</IconWrapper>
            {item.text}
          </MenuItem>
        ))}
      </SideMenuWrapper>
    </div>
  );
}
export default SideMenu;
