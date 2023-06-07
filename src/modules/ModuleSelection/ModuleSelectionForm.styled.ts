import styled, { css } from "styled-components";
import { Card } from "antd";
import { Form } from "antd";

export const ModuleSelectionFormWrapper = styled.div`
  display: flex;
  align-items: left;
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 10px;
  padding-bottom: 10px;
  display: flex;
  margin-left: 30px;
  flex-direction: column;
  color: #434343;
  ${css`
    font-family: "Inter", sans-serif;
  `}
`;

export const InfoCard = styled(Card)`
  ${css`
    font-family: "Inter", sans-serif;
  `}
  font-size: 12px;
  width: 86.5%;
`;

export const SelectionForm = styled(Form)`
  flex-direction: row;
  justify-content: space-between;
`;

export const SelectionCard = styled(Card)`
  ${css`
    font-family: "Inter", sans-serif;
    .ant-card-body {
      padding: 0px !important;
      color: #f5f5f5;
    }
    .ant-card-meta-title {
      background: #bfbfbf;
    }
    margin-top: 15px;
    width: 86.5%;

    & .description {
      padding: 5px;
      font-size: 12px;
      color: #595959;
    }
  `}
  font-size: 12px;
`;

export const CustomizationCard = styled(Card)`
  ${css`
    font-family: "Inter", sans-serif;
    .ant-card-body {
      padding: 0px !important;
      background: #ffffff;
    }
    .ant-card-meta-title {
      color: #061178 !important;
    }
    margin-top: 15px;
    width: 86.5%;

    & .description {
      padding: 5px;
      font-size: 12px;
    }
  `}
  font-size: 12px;
`;

export const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #ffffff;
  padding: 8px;
  font-size: 14px;
  font-family: "Inter", sans-serif;
  padding-top: 15px;
  padding-bottom: 15px;
`;

export const CardTitle = styled.div`
  display: flex;
  align-items: center;
  color: #ffffff;
  font-size: 14px;
  font-weight: 500;
`;

export const LearnMoreLink = styled.span`
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 14px;
  font-weight: 400;
`;

export const CheckboxContainer = styled.div`
  font-family: "Inter", sans-serif;
  font-size: 12px;
  color: #595959;
  padding: 15px;

  ${css`
    & span {
      font-size: 14px;
      color: #595959;
    }
  `}
`;
