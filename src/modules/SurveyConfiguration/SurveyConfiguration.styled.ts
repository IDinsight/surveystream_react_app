import { Card } from "antd";
import styled from "styled-components";
export const SideMenuWrapper = styled.div`
  background-color: #f5f5f5;
  width: 250px;
  min-height: 120vh;
  padding: 1rem;
  padding-top: 20px;
  display: flex;
  flex-direction: column;
`;

export const HelpCard = styled(Card)`
  margin-top: 1rem;
  font-family: Inter;
  font-style: Medium;
  font-size: 16px;
  line-height: 24px;
  text-align: left;
  vertical-align: top;
  height: auto;
  color: #262626;
  font-size: 16px;
  margin-bottom: 1rem;

  & a {
    color: #1d39c4;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  & .more-help-link {
    color: #262626;
  }
`;

export const HelpList = styled.ul`
  list-style-type: none;
  padding: 0;
  font-size: 14px;
`;

export const HelpListItem = styled.li`
  & a {
    color: ${(props) => props.color};
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

export const StepsWrapper = styled.div`
  margin-top: 10px;
  margin-bottom: 10px;
`;

export const StepCard = styled(Card)`
  margin-top: 1rem;
  font-family: Inter;
  font-size: 16px;
  line-height: 24px;
  text-align: left;
  vertical-align: top;
`;

export const Title = styled.h1`
  font-family: "Inter";
  font-weight: 500;
  font-size: 16px;
  line-height: 28px;
  color: #000;
  margin-left: 1rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
`;
export const MainWrapper = styled.div`
  flex: 1;
  padding: 1rem;
  padding-left: 2rem;
  background-color: #f5f5f5;
`;

export const StyledCard = styled(Card)`
  margin-bottom: 1rem;
  font-family: "Inter";
  font-style: medium;
  font-size: 16px;
  line-height: 18px;
  text-align: left;
  vertical-align: top;
  transition: box-shadow 0.3s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }
`;

export const CheckboxLabel = styled.span`
  color: white;
  font-size: 0.75rem;
`;

export const StatusWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-top: 0.2rem;
`;

export const StatusText = styled.p`
  margin-left: 0.1rem;
  font-family: "Inter";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
`;

export const SectionTitle = styled.h3`
  font-family: Inter;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: #262626;
`;
