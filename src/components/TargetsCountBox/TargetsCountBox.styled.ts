import { Divider } from "antd";
import styled from "styled-components";

export const TargetsCountBoxContainer = styled.div`
  display: flex;
  justify-content: space-around;
  padding: 8px 16px;
  border-radius: 4px;
  background-color: #fff;
  width: 136px;
  margin-top: 0;
`;

export const RowTitle = styled.p`
  color: #434343;
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 22px;
`;

export const RowCountValue = styled.span`
  color: ${(props) => props.color || "#434343"};
  font-family: Inter;
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
