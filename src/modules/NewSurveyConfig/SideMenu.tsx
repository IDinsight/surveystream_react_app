import {
  SideMenuWrapper,
  MenuItem,
  IconWrapper,
  InfoIcon,
  QuestionIcon,
} from "./SideMenu.styled";

function SideMenu() {
  return (
    <div>
      <SideMenuWrapper>
        <MenuItem href="#" className="active">
          <IconWrapper>
            <InfoIcon />
          </IconWrapper>
          Basic Information
        </MenuItem>
        <MenuItem href="#">
          <IconWrapper>
            <QuestionIcon />
          </IconWrapper>
          Module questionnaire
        </MenuItem>
      </SideMenuWrapper>
    </div>
  );
}
export default SideMenu;
