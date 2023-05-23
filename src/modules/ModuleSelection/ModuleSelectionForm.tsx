import React, { FC, useState, useEffect } from "react";

import {
  ModuleSelectionFormWrapper,
  InfoCard,
  SelectionForm,
  SelectionCard,
  TitleContainer,
  LearnMoreLink,
  CardTitle,
  CheckboxContainer,
  CustomizationCard,
} from "./ModuleSelectionForm.styled";
import { FormInstance } from "antd/lib/form";

export interface ModuleSelectionFormProps {
  form: FormInstance;
}
import { useForm } from "antd/es/form/Form";
import { Title } from "../../shared/Nav.styled";
import { Card, Checkbox } from "antd";
import {
  ArrowRightOutlined,
  FileSearchOutlined,
  InfoCircleFilled,
  PieChartOutlined,
  SendOutlined,
  UnorderedListOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { fetchModules } from "../../redux/moduleSelection/modulesActions";
import { RootState } from "../../redux/store";

const { Meta } = Card;

const ModuleSelectionForm: FC<ModuleSelectionFormProps> = () => {
  const dispatch = useAppDispatch();
  const modules = useAppSelector((state: RootState) => state);

  const [form] = useForm();
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  // const [cardTitles, setCardTitles] = useState<string[]>([]);
  // const [cardDescriptions, setCardDescriptions] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    dispatch(fetchModules());
    console.log("modules", modules);
  }, [dispatch]);

  const handleCheckboxChange = (cardTitle: string) => {
    setSelectedCards((prevSelectedCards: string[]) => {
      if (prevSelectedCards.includes(cardTitle)) {
        return prevSelectedCards.filter((title) => title !== cardTitle);
      } else {
        return [...prevSelectedCards, cardTitle];
      }
    });
  };

  const isCardSelected = (cardTitle: string) => {
    return selectedCards.includes(cardTitle);
  };

  return (
    <ModuleSelectionFormWrapper data-testid="ModuleSelectionForm">
      <Title>Module Selection </Title>

      <p style={{ fontSize: 14 }}>
        Please start by selecting modules you’ll use in your survey
      </p>

      <InfoCard>
        <Meta
          avatar={<InfoCircleFilled />}
          description={
            <>
              <div>New to SurveyStream?</div>
              <div>
                <a style={{ color: "#1D39C4" }}> Click here </a> to visit
                documentation before configuring your first survey
              </div>
            </>
          }
        />
      </InfoCard>
      {/* <div>
      {modules.map((module: boolean | React.Key | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | null | undefined) => (
        <div key={module}>{module}</div>
      ))}
    </div> */}

      <SelectionForm form={form}>
        <SelectionCard>
          <Meta
            title={
              <TitleContainer
                style={{
                  backgroundColor: isCardSelected("Hire Enumerators")
                    ? "#1d39c4"
                    : "#BFBFBF",
                }}
              >
                <CardTitle>
                  <UsergroupAddOutlined style={{ marginRight: 8 }} />
                  <div>Hire Enumerators</div>
                </CardTitle>
                <LearnMoreLink>
                  Learn more <ArrowRightOutlined style={{ marginLeft: 4 }} />
                </LearnMoreLink>
              </TitleContainer>
            }
            description={
              <div className="description">
                <ul>
                  <li>Google sheet based</li>
                  <li>Track candidates [by geography, gender etc]</li>
                  <li>Generate offer letters</li>
                </ul>
              </div>
            }
          />
          <CheckboxContainer>
            <Checkbox
              onChange={() => handleCheckboxChange("Hire Enumerators")}
              checked={isCardSelected("Hire Enumerators")}
            >
              I need this module in my survey
            </Checkbox>
          </CheckboxContainer>
        </SelectionCard>

        <SelectionCard>
          <Meta
            title={
              <TitleContainer>
                <CardTitle>
                  <SendOutlined style={{ marginRight: 8 }} />
                  <div>Assign targets to enumerators</div>
                </CardTitle>
                <LearnMoreLink>
                  Learn more <ArrowRightOutlined style={{ marginLeft: 4 }} />
                </LearnMoreLink>
              </TitleContainer>
            }
            description={
              <div className="description">
                <ul>
                  <li>Google sheet based</li>
                  <li>Track candidates [by geography, gender etc]</li>
                  <li>Generate offer letters</li>
                </ul>
              </div>
            }
          />
          <CheckboxContainer>
            <Checkbox>I need this module in my survey</Checkbox>
          </CheckboxContainer>
        </SelectionCard>
        <SelectionCard>
          <Meta
            title={
              <TitleContainer>
                <CardTitle>
                  <PieChartOutlined style={{ marginRight: 8 }} />
                  <div>Track productivity</div>
                </CardTitle>
                <LearnMoreLink>
                  Learn more <ArrowRightOutlined style={{ marginLeft: 4 }} />
                </LearnMoreLink>
              </TitleContainer>
            }
            description={
              <div className="description">
                <ul>
                  <li>Google sheet based</li>
                  <li>Track candidates [by geography, gender etc]</li>
                  <li>Generate offer letters</li>
                </ul>
              </div>
            }
          />
          <CheckboxContainer>
            <Checkbox>I need this module in my survey</Checkbox>
          </CheckboxContainer>
        </SelectionCard>
        <SelectionCard>
          <Meta
            title={
              <TitleContainer>
                <CardTitle>
                  <UnorderedListOutlined style={{ marginRight: 8 }} />
                  <div>Track data quality</div>
                </CardTitle>
                <LearnMoreLink>
                  Learn more <ArrowRightOutlined style={{ marginLeft: 4 }} />
                </LearnMoreLink>
              </TitleContainer>
            }
            description={
              <div className="description">
                <ul>
                  <li>Google sheet based</li>
                  <li>Track candidates [by geography, gender etc]</li>
                  <li>Generate offer letters</li>
                </ul>
              </div>
            }
          />
          <CheckboxContainer>
            <Checkbox>I need this module in my survey</Checkbox>
          </CheckboxContainer>
        </SelectionCard>
        <SelectionCard>
          <Meta
            title={
              <TitleContainer>
                <CardTitle>
                  <FileSearchOutlined style={{ marginRight: 8 }} />
                  <div>Audit audio</div>
                </CardTitle>
                <LearnMoreLink>
                  Learn more <ArrowRightOutlined style={{ marginLeft: 4 }} />
                </LearnMoreLink>
              </TitleContainer>
            }
            description={
              <div className="description">
                <ul>
                  <li>Google sheet based</li>
                  <li>Track candidates [by geography, gender etc]</li>
                  <li>Generate offer letters</li>
                </ul>
              </div>
            }
          />
          <CheckboxContainer>
            <Checkbox>I need this module in my survey</Checkbox>
          </CheckboxContainer>
        </SelectionCard>
        <SelectionCard>
          <Meta
            title={
              <TitleContainer>
                <CardTitle>
                  <FileSearchOutlined style={{ marginRight: 8 }} />
                  <div>Audit photo</div>
                </CardTitle>
                <LearnMoreLink>
                  Learn more <ArrowRightOutlined style={{ marginLeft: 4 }} />
                </LearnMoreLink>
              </TitleContainer>
            }
            description={
              <div className="description">
                <ul>
                  <li>Google sheet based</li>
                  <li>Track candidates [by geography, gender etc]</li>
                  <li>Generate offer letters</li>
                </ul>
              </div>
            }
          />
          <CheckboxContainer>
            <Checkbox>I need this module in my survey</Checkbox>
          </CheckboxContainer>
        </SelectionCard>

        <CustomizationCard>
          <Meta
            title={
              <TitleContainer style={{ color: "#2f54eb" }}>
                <CardTitle style={{ color: "#2f54eb" }}>
                  <FileSearchOutlined
                    style={{ marginRight: 8, color: "#434343" }}
                  />
                  <div> Request customization support</div>
                </CardTitle>
                <LearnMoreLink>
                  Learn more <ArrowRightOutlined style={{ marginLeft: 4 }} />
                </LearnMoreLink>
              </TitleContainer>
            }
          />
        </CustomizationCard>
      </SelectionForm>
    </ModuleSelectionFormWrapper>
  );
};

export default ModuleSelectionForm;
