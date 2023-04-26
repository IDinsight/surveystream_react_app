import React, { FC } from "react";
import {
  ModuleSelectionFormWrapper,
  InfoCard,
  SelectionForm,
  SelectionCard,
  TitleContainer,
  LearnMoreLink,
  CardTitle,
  CheckboxContainer,
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

const { Meta } = Card;

const ModuleSelectionForm: FC<ModuleSelectionFormProps> = () => {
  const [form] = useForm();

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
                <a> Click here </a> to visit documentation before configuring
                your first survey
              </div>
            </>
          }
        />
      </InfoCard>

      <SelectionForm form={form}>
        <SelectionCard>
          <Meta
            title={
              <TitleContainer>
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
            <Checkbox>I need this module in my survey</Checkbox>
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
      </SelectionForm>
    </ModuleSelectionFormWrapper>
  );
};

export default ModuleSelectionForm;
