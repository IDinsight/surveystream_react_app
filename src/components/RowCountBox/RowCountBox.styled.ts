import { Divider } from "antd";
import styled from "styled-components";

export const RowCountBoxContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 16px 32px;
  border-radius: 4px;
  background-color: #fff;
  margin-right: 80px;
`;

export const RowTitle = styled.p`
  color: #434343;
  font-family: "Lato", sans-serif;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 22px;
`;

export const RowCountValue = styled.span`
  color: #434343;
  font-family: "Lato", sans-serif;
  font-size: 24px;
  font-style: normal;
  font-weight: 400;
  line-height: 32px;
  margin-left: 8px;
`;

export const RowIconContainer = styled.div`
  display: "flex";
  align-items: "center";
`;

export const RowCountDivider = styled(Divider)`
  height: 80px;
  background-color: "#F0F0F0";
`;
