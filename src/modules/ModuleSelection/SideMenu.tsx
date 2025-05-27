import {
  SideMenuWrapper,
  MenuItem,
  IconWrapper,
  ListIcon,
} from "../../shared/SideMenu.styled";

function SideMenu() {
  return (
    <div>
      <SideMenuWrapper style={{ marginLeft: "15px" }}>
        <MenuItem to="#" className="active">
          <IconWrapper>
            <ListIcon />
          </IconWrapper>
          Feature Selection
        </MenuItem>
      </SideMenuWrapper>
    </div>
  );
}
export default SideMenu;
