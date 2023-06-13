import styled from "styled-components";
import { Button, Form } from "antd";

export const RolesForm = styled(Form)`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 50%;

  label {
    flex: 1;
    margin-right: 10px;
    text-align: left;
  }

  input {
    flex: 1;
    text-align: left;
  }
`;

export const AddAnotherButton = styled(Button)`
  margin-top: 20px;
  background-color: #2f54eb;
  color: #fff;
  font-family: Inter;
  &:hover {
    border: 1px solid #2f54eb;
    background-color: #fff;
    color: #2f54eb;
  }
`;
