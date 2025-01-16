import { Table, Button } from "antd";
import styled from "styled-components";

export const TargetsSctoMapFormWrapper = styled.div`
  flex: 1;
  background-color: #f5f5f5;
  padding-left: 80px;
  padding-top: 23px;
  padding-bottom: 30px;
  font-family: "Lato", sans-serif;
`;

export const DescriptionContainer = styled.p`
  font-family: "Lato", sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  color: #8c8c8c;
  margin-top: 38px;
  margin-right: 80px;
`;

export const DescriptionText = styled.p`
  font-family: "Lato", sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  color: #8c8c8c;
`;

export const HeadingText = styled.p`
  font-family: "Lato", sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 22px;
  color: #434343;
`;

export const OptionText = styled.span`
  font-family: "Lato", sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  color: #434343;
`;

export const ErrorTable = styled(Table)`
  margin-bottom: 53px;
  margin-right: 80px;
  & th {
    color: #820014 !important;
    background-color: #ffccc7 !important;
    height: 40px;
    font-family: "Lato", sans-serif;
  }
  & th::before {
    background-color: #ff7875 !important;
  }

  & tr:nth-child(odd) td {
    background-color: #ffffff;
  }
  & tr:nth-child(odd):hover td {
    background-color: #ffffff !important;
  }

  & tr:nth-child(even) td {
    background-color: #fff1f0;
  }
  & tr:nth-child(even):hover td {
    background-color: #fff1f0 !important;
  }
  & td {
    font-family: "Lato", sans-serif;
  }
`;

export const WarningTable = styled(Table)`
  margin-bottom: 53px;
  margin-right: 80px;
  & th {
    color: #873800 !important;
    background-color: #ffe7ba !important;
    height: 40px;
    font-family: "Lato", sans-serif;
  }
  & th::before {
    background-color: #ffc069 !important;
  }
  & td {
    font-family: "Lato", sans-serif;
  }
`;

export const SCTOQuestionsButton = styled(Button)`
  background-color: #2f54eb;
  color: #fff;
  font-family: "Lato", sans-serif;
  &:hover {
    border: 1px solid #2f54eb;
    background-color: #fff;
    color: #2f54eb;
  }
`;
