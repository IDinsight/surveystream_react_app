import { Form, Select } from "antd";
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
  SelectItem,
  SurveyLocationHierarchyFormWrapper,
} from "./SurveyLocationHierarchy.styled";
import { useState } from "react";

interface ILocationHierarchySelect {
  name: string;
  value: string;
}

function SurveyLocationHierarchy() {
  const navigate = useNavigate();

  // Once, we will have location items, we can prepare locations hierarchy
  const locationItems = ["State", "District", "Block"];
  const locationArr = locationItems.map(
    (val: string): ILocationHierarchySelect => {
      return { name: val, value: "" };
    }
  );
  const [locationsHierarchy, setLocationsHierarchy] =
    useState<ILocationHierarchySelect[]>(locationArr);

  const selectionOption = locationItems.map((val) => {
    return { label: val, value: val };
  });

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleLocationSelection = (val: string, index: number) => {
    const tempLocationsHierarchy = [...locationsHierarchy];
    tempLocationsHierarchy[index].value = val;
    setLocationsHierarchy(tempLocationsHierarchy);
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
        <SurveyLocationHierarchyFormWrapper>
          <Title>Survey Location: Hierarchy</Title>
          <DescriptionText>
            Please add locations for this survey
          </DescriptionText>
          <div style={{ marginTop: "40px" }}>
            <Form layout="horizontal">
              {locationsHierarchy.map(
                (item: ILocationHierarchySelect, index: number) => {
                  return (
                    <SelectItem key={index} label={item.name} required>
                      <Select
                        style={{ width: 168 }}
                        placeholder="Choose hierarchy"
                        onChange={(e) => handleLocationSelection(e, index)}
                        options={[
                          { label: "Highest location", value: "highest" },
                          ...selectionOption,
                        ]}
                      />
                    </SelectItem>
                  );
                }
              )}
            </Form>
          </div>
        </SurveyLocationHierarchyFormWrapper>
      </div>
      <FooterWrapper>
        <SaveButton>Save</SaveButton>
        <ContinueButton>Continue</ContinueButton>
      </FooterWrapper>
    </>
  );
}

export default SurveyLocationHierarchy;
