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
import { MainWrapper, Title } from "../../shared/Nav.styled";
import { Card, Checkbox, message } from "antd";
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
import {
  FooterWrapper,
  SaveButton,
  ContinueButton,
} from "../../shared/FooterBar.styled";
import {
  createModuleStatus,
  fetchModuleStatuses,
} from "../../redux/moduleSelection/moduleStatusActions";
import { useNavigate, useParams } from "react-router-dom";

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
  const { survey_uid } = useParams<{ survey_uid: string }>() ?? {
    survey_uid: "",
  };

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const modules = useAppSelector(
    (state: RootState) => state.reducer.modules.modules
  );
  const modulesStatus = useAppSelector(
    (state: RootState) => state.reducer.moduleStatuses.moduleStatuses
  );
  const isLoading = useAppSelector(
    (state: RootState) => state.reducer.modules.loading
  );

  const [form] = useForm();
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchModules());
    if (survey_uid) {
      dispatch(fetchModuleStatuses({ survey_uid: survey_uid }));
    }
  }, [dispatch]);

  useEffect(() => {
    let filteredModules = [];
    filteredModules = modulesStatus;
    // Set selected cards based on module_id
    const selectedModuleIds = filteredModules.map((module) =>
      module.module_id.toString()
    );
    setSelectedCards(selectedModuleIds);
  }, [modulesStatus]);

  const handleCheckboxChange = (cardId: string) => {
    setSelectedCards((prevSelectedCards: string[]) => {
      if (prevSelectedCards.includes(cardId)) {
        return prevSelectedCards.filter((id) => id !== cardId);
      } else {
        return [...prevSelectedCards, cardId];
      }
    });
  };

  const isCardSelected = (cardId: string) => {
    return selectedCards.includes(cardId);
  };

  const handleContinue = async () => {
    try {
      if (selectedCards.length === 0) {
        message.error("Kindly select at least one module to proceed");
        return;
      }

      setLoading(true);
      const data = { modules: selectedCards, survey_uid: survey_uid };
      // Dispatch the selected modules
      const modulesRes = await dispatch(createModuleStatus(data));

      if (modulesRes.payload?.success === true) {
        message.success("Modules updated successfully");
        navigate(`/survey-information/survey-cto-information/${survey_uid}`);
      } else {
        modulesRes.payload?.message
          ? message.error(modulesRes.payload.message)
          : message.error(
              "Failed to update modules, kindly check your inputs."
            );
        if (modulesRes.payload?.response?.data?.errors?.modules) {
          message.error(
            `modules: ${modulesRes.payload.response.data.errors.modules}`
          );
        }
        if (modulesRes.payload?.response?.data?.errors?.survey_uid) {
          message.error(
            `survey_uid: ${modulesRes.payload.response.data.errors.survey_uid}`
          );
        }
        return;
      }
    } catch (error) {
      message.error("Failed to update modules, kindly check your inputs.");
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return <FullScreenLoader></FullScreenLoader>;
  }

  return (
    <>
      <MainWrapper
        style={{
          width: "74.5%",
          minHeight: "75vh",
          float: "right",
          display: "inline-block",
        }}
      >
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
                    <a
                      href="https://sites.google.com/idinsight.org/dod-surveystream-onboarding/home"
                      target="__blank"
                      style={{ color: "#1D39C4" }}
                    >
                      {" "}
                      Click here{" "}
                    </a>{" "}
                    to visit documentation before configuring your first survey
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
                        borderColor: isCardSelected(module.module_id.toString())
                          ? "#061178"
                          : "#BFBFBF",
                      }}
                    >
                      <Meta
                        title={
                          <TitleContainer
                            style={{
                              backgroundColor: isCardSelected(
                                module.module_id.toString()
                              )
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
                            <LearnMoreLink
                              onClick={() => window.open(module.link, "_blank")}
                            >
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
                          onChange={() =>
                            handleCheckboxChange(module.module_id.toString())
                          }
                          checked={isCardSelected(module.module_id.toString())}
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
                          <LearnMoreLink
                            onClick={() =>
                              window.open(
                                "https://forms.gle/81zvXSZutnE4GHwB6",
                                "_blank"
                              )
                            }
                          >
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
      </MainWrapper>

      <FooterWrapper>
        <SaveButton>Save</SaveButton>
        <ContinueButton loading={loading} onClick={handleContinue}>
          Continue
        </ContinueButton>
      </FooterWrapper>
    </>
  );
};

export default ModuleSelectionForm;
