import { Link } from "react-router-dom";
import styled from "styled-components";

export const NewSurveyCard = styled.div`
  display: flex;

  margin-top: 4px;
  margin-right: 10px;
  margin-bottom: 15px;
  background: #061178;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  color: #ffffff;

  padding: 10px;
  width: 270px;
  height: 80px;
  border-radius: 0.125rem;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.08);

  &:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }
`;
export const StyledLink = styled(Link)`
  text-decoration: none;
  display: flex;
  align-items: center;
`;

export const Text = styled.span`
  margin-left: 10px;
  font-weight: 300;
  font-size: 20px;
`;
