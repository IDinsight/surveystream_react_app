import styled from "styled-components";
import { Form } from "antd";

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
