import {
  SaveButton,
  ContinueButton,
  FooterWrapper,
} from "../../shared/FooterBar.styled";

function FooterBar() {
  return (
    <FooterWrapper>
      <SaveButton>Save</SaveButton>
      <ContinueButton>Continue</ContinueButton>
    </FooterWrapper>
  );
}
export default FooterBar;
