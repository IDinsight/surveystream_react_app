import styled from "styled-components";
import { Link } from "react-router-dom";

export const StyledCardLink = styled(Link)`
  text-decoration: none;
`;

export const CardContainer = styled.div`
  margin-top: 4px;
  margin-right: 10px;
  margin-bottom: 15px;

  padding: 10px;
  width: 270px;
  height: 132px;
  border-radius: 0.125rem;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.08);

  &:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }
`;

export const Title = styled.p`
  margin-bottom: 0;
  font-size: 16px;
  font-weight: 500;
  color: #1d39c4;
`;

export const InfoContainer = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  line-height: 1.25rem;
  color: #8c8c8c;
`;
export const InfoText = styled.p`
  margin: 0;
  font-size: 12px;
  line-height: 1.25rem;
  color: #8c8c8c;
  margin-top: 20%;
`;
