import {
  SideMenuWrapper,
  MenuItem,
  IconWrapper,
  ListIcon,
} from "../../shared/SideMenu.styled";

function SideMenu() {
  return (
    <div>
      <SideMenuWrapper>
        <MenuItem to="#" className="active">
          <IconWrapper>
            <ListIcon />
          </IconWrapper>
          Module Selection
        </MenuItem>
      </SideMenuWrapper>
    </div>
  );
}
export default SideMenu;
