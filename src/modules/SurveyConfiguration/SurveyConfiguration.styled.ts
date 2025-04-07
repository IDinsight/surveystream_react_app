import { Card } from "antd";
import styled from "styled-components";
import { Switch } from "antd";

const HEADER_HEIGHT = 131;

export const SideMenuWrapper = styled.div<{ windowHeight: number }>`
  background-color: #f5f5f5;
  width: 250px;
  height: ${({ windowHeight }) => Math.min(windowHeight - HEADER_HEIGHT)}px;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
`;

export const HelpCard = styled(Card)`
  margin-top: 1rem;
  font-family: "Lato", sans-serif;
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
  font-family: "Lato", sans-serif;
  font-size: 16px;
  line-height: 24px;
  text-align: left;
  vertical-align: top;
`;

export const Title = styled.h1`
  font-family: "Lato", sans-serif;
  font-weight: 500;
  font-size: 16px;
  line-height: 28px;
  color: #000;
  margin-left: 1rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
`;
export const MainWrapper = styled.div<{ windowHeight: number }>`
  flex: 1;
  padding: 1rem;
  padding-left: 2rem;
  background-color: #f5f5f5;
  overflow-y: auto;
  height: ${({ windowHeight }) => Math.min(windowHeight - HEADER_HEIGHT)}px;
  passing-bottom: "10px";
`;

export const StyledCard = styled(Card)`
  margin-bottom: 1rem;
  font-family: "Lato", sans-serif;
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
  margin-top: 2rem;
`;

export const StatusText = styled.p`
  margin-left: 0.1rem;
  font-family: "Lato", sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
`;

export const SectionTitle = styled.h3`
  font-family: "Lato", sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: #262626;
`;

export const ToolTipText = styled.p`
  font-family: "Lato", sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
`;

export const DraftActiveSwitch = styled(Switch)`
  &.ant-switch .ant-switch-handle::before {
    background-color: #d46b08; /* Brown circle */
  }

  &.ant-switch-checked .ant-switch-handle::before {
    background-color: #237f5d; /* Green circle */
  }

  &.ant-switch-checked .ant-switch-handle::before {
    transition: all 0.3s;
  }

  &.ant-switch-handle::before {
    transition: background-color 0.3s, box-shadow 0.3s;
  }
`;

export const PastDraftSwitch = styled(Switch)`
  &.ant-switch .ant-switch-handle::before {
    background-color: #d46b08; /* Brown circle */
  }

  &.ant-switch-checked .ant-switch-handle::before {
    background-color: #8c8c8c; /* Gray circle */
  }

  &.ant-switch-checked .ant-switch-handle::before {
    transition: all 0.3s;
  }

  &.ant-switch-handle::before {
    transition: background-color 0.3s, box-shadow 0.3s;
  }
`;
