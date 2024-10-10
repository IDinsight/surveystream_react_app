import { Divider } from "antd";
import styled from "styled-components";

export const MappingCountBoxContainer = styled.div`
  display: flex;
  gap: 30px;
  padding: 8px 0;
  margin-bottom: 16px;
`;

export const CountTitle = styled.p`
  color: #434343;
  font-family: "Lato", sans-serif;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 22px;
`;

export const CountValue = styled.span`
  color: #434343;
  font-family: "Lato", sans-serif;
  font-size: 24px;
  font-style: normal;
  font-weight: 400;
  line-height: 32px;
  margin-left: 8px;
`;

export const CountIconContainer = styled.div`
  display: "flex";
  align-items: "center";
`;

export const CountDivider = styled(Divider)`
  height: 80px;
  background-color: "#F0F0F0";
`;
