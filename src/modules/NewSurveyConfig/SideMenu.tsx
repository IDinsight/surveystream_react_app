import { Dispatch, SetStateAction } from "react";
import {
  SideMenuWrapper,
  MenuAItem,
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
    { text: "Basic information", icon: <InfoIcon /> },
    { text: "Module questionnaire", icon: <QuestionIcon /> },
  ];

  const handleClick = (index: number) => {
    setStepIndexHandler((prev: IStepIndex) => ({
      ...prev,
      sidebar: index,
    }));
  };

  return (
    <div>
      <SideMenuWrapper>
        {menus.map((item: { text: string; icon: any }, index: number) => (
          <MenuAItem
            style={{ cursor: "pointer" }}
            onClick={() => {
              handleClick(index);
            }}
            key={index}
            className={stepIndex["sidebar"] === index ? "active" : ""}
          >
            <IconWrapper>{item.icon}</IconWrapper>
            {item.text}
          </MenuAItem>
        ))}
      </SideMenuWrapper>
    </div>
  );
}
export default SideMenu;
