import { Form, Input } from "antd";
import { useNavigate } from "react-router-dom";

import Header from "../../../components/Header";
import {
  NavWrapper,
  BackLink,
  BackArrow,
  Title,
} from "../../../shared/Nav.styled";

import {
  FooterWrapper,
  SaveButton,
  ContinueButton,
} from "../../../shared/FooterBar.styled";
import SideMenu from "../SideMenu";
import {
  DescriptionText,
  IconText,
  SurveyLocationFormWrapper,
} from "./SurveyLocationLabel.styled";
import { ChangeEvent, useState } from "react";
import { FileAddOutlined } from "@ant-design/icons";

function SurveyLocation() {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const [locations, setLocations] = useState<string[]>([""]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleLocationValue = (
    e: ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const tempLocations = [...locations];
    tempLocations[index] = e.target.value;
    setLocations(tempLocations);
  };

  return (
    <>
      <Header />
      <NavWrapper>
        <BackLink href="#" onClick={handleGoBack}>
          <BackArrow />
        </BackLink>
        <Title> TSDPS </Title>
      </NavWrapper>
      <div style={{ display: "flex" }}>
        <SideMenu />
        <SurveyLocationFormWrapper>
          <Title>Survey location: Add location</Title>
          <DescriptionText>
            Please create the locations for your survey. Examples of locations:
            state, district, and block
          </DescriptionText>
          <div style={{ marginTop: "40px" }}>
            <Form layout="horizontal">
              {locations.map((location: string, index: number) => {
                return (
                  <Form.Item
                    key={index}
                    label={`Location ${index + 1}`}
                    required
                  >
                    <Input
                      style={{ width: "233px", marginLeft: "40px" }}
                      value={location}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        handleLocationValue(e, index)
                      }
                    />
                  </Form.Item>
                );
              })}
            </Form>
            <div
              onClick={() => setLocations([...locations, ""])}
              style={{ cursor: "pointer" }}
            >
              <FileAddOutlined style={{ fontSize: "14px" }} />
              <IconText>Add another location</IconText>
            </div>
          </div>
        </SurveyLocationFormWrapper>
      </div>
      <FooterWrapper>
        <SaveButton>Save</SaveButton>
        <ContinueButton>Continue</ContinueButton>
      </FooterWrapper>
    </>
  );
}

export default SurveyLocation;
