import { Button, Table } from "antd";
import styled from "styled-components";

export const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  height: 55px;
  padding-left: 48px;
  padding-right: 48px;
  border-top: 1px solid #00000026;
  border-bottom: 1px solid #00000026;
`;

export const TextHeading = styled.h1`
  color: #262626;
  font-family: "Lato", sans-serif;
  font-size: 20px;
  font-weight: 500;
  line-height: 28px;
`;

export const PreviewBtn = styled(Button)`
  margin-left: auto;
  background-color: #597ef7;
  color: white;
  border-radius: 4px !important;
  font-family: "Lato", sans-serif;

  &:hover {
    background-color: #597ef7;
    color: white !important;
  }
`;

export const BackBtn = styled(Button)`
  margin-left: auto;
  border-radius: 4px !important;
  font-family: "Lato", sans-serif;
`;

export const SubmitBtn = styled(Button)`
  margin-left: 12px;
  background-color: #597ef7;
  color: white;
  border-radius: 4px !important;
  font-family: "Lato", sans-serif;

  &:hover {
    background-color: #597ef7;
    color: white !important;
  }
`;

export const PreviewTable = styled(Table)`
  margin-right: 24px;
  overflow: auto !important;
  & th {
    color: #434343 !important;
    background-color: #f5f5f5 !important;
    height: 40px;
    font-family: "Lato", sans-serif;
  }
  & th::before {
    background-color: #f0f0f0 !important;
  }
  & td {
    font-family: "Lato", sans-serif;
  }
`;

export const ColumnsTable = styled(Table)`
  margin-right: 24px;
  & th {
    color: #434343 !important;
    background-color: #d6e4ff !important;
    height: 40px;
    font-family: "Lato", sans-serif;
  }
  & td {
    font-family: "Lato", sans-serif;
  }
`;
