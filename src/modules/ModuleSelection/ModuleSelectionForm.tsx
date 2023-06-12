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
import { useForm } from "antd/es/form/Form";
import { Title } from "../../shared/Nav.styled";
import { Card, Checkbox } from "antd";
import Icon, {
  ArrowRightOutlined,
  FileSearchOutlined,
  InfoCircleFilled,
} from "@ant-design/icons";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { fetchModules } from "../../redux/moduleSelection/modulesActions";
import { RootState } from "../../redux/store";
import FullScreenLoader from "../../components/Loaders/FullScreenLoader";
import { createGlobalStyle } from "styled-components";

const { Meta } = Card;

// Create a global style component
const CheckboxStyle = createGlobalStyle`
  .ant-checkbox-checked .ant-checkbox-inner {
    background-color: #061178 !important;
    border-color: #061178 !important;
  }
`;

export interface ModuleSelectionFormProps {
  form: FormInstance;
}

const ModuleSelectionForm: FC<ModuleSelectionFormProps> = () => {
  const dispatch = useAppDispatch();
  const modules = useAppSelector(
    (state: RootState) => state.reducer.modules.modules
  );
  const isLoading = useAppSelector(
    (state: RootState) => state.reducer.modules.loading
  );

  const [form] = useForm();
  const [selectedCards, setSelectedCards] = useState<number[]>([]);

  useEffect(() => {
    dispatch(fetchModules());
  }, [dispatch]);

  const handleCheckboxChange = (cardId: number) => {
    setSelectedCards((prevSelectedCards: number[]) => {
      if (prevSelectedCards.includes(cardId)) {
        return prevSelectedCards.filter((id) => id !== cardId);
      } else {
        return [...prevSelectedCards, cardId];
      }
    });
  };

  const isCardSelected = (cardId: number) => {
    return selectedCards.includes(cardId);
  };

  if (isLoading) {
    return <FullScreenLoader></FullScreenLoader>;
  }

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
      <div>
        {!isLoading ? (
          <>
            <SelectionForm form={form}>
              {modules.map((module) => (
                <SelectionCard
                  key={module.module_id}
                  style={{
                    borderColor: isCardSelected(module.module_id)
                      ? "#061178"
                      : "#BFBFBF",
                  }}
                >
                  <Meta
                    title={
                      <TitleContainer
                        style={{
                          backgroundColor: isCardSelected(module.module_id)
                            ? "#061178"
                            : "#BFBFBF",
                        }}
                      >
                        <CardTitle>
                          <Icon
                            component={module.icon}
                            style={{ marginRight: 8 }}
                          />
                          <div>{module.title}</div>
                        </CardTitle>
                        <LearnMoreLink>
                          Learn more{" "}
                          <ArrowRightOutlined style={{ marginLeft: 4 }} />
                        </LearnMoreLink>
                      </TitleContainer>
                    }
                    description={
                      <div
                        className="description"
                        dangerouslySetInnerHTML={{
                          __html: module.description || "",
                        }}
                      />
                    }
                  />
                  <CheckboxContainer>
                    <CheckboxStyle />{" "}
                    <Checkbox
                      onChange={() => handleCheckboxChange(module.module_id)}
                      checked={isCardSelected(module.module_id)}
                    >
                      I need this module in my survey
                    </Checkbox>
                  </CheckboxContainer>
                </SelectionCard>
              ))}
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
                        Learn more{" "}
                        <ArrowRightOutlined style={{ marginLeft: 4 }} />
                      </LearnMoreLink>
                    </TitleContainer>
                  }
                />
              </CustomizationCard>
            </SelectionForm>
          </>
        ) : null}
      </div>
    </ModuleSelectionFormWrapper>
  );
};

export default ModuleSelectionForm;
