import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import Container from "../../../components/Layout/Container";
import { getSurveyCTOForm } from "../../../redux/surveyCTOInformation/surveyCTOInformationActions";
import FullScreenLoader from "../../../components/Loaders/FullScreenLoader";
import { HeaderContainer, Title } from "../../../shared/Nav.styled";
import { RootState } from "../../../redux/store";
import { Col, Row, Select, Tooltip, message } from "antd";
import { userHasPermission } from "../../../utils/helper";
import {
  CustomBtn,
  CustomLinkBtn,
  DQChecksTable,
  DQFormWrapper,
  FormItemLabel,
  CheckboxDQ,
} from "./DQChecks.styled";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { Collapse } from "antd/lib";
import { useForm } from "antd/es/form/Form";
import { getTargetStatusMapping } from "../../../redux/targetStatusMapping/targetStatusMappingActions";
import {
  getDQCheckTypes,
  getDQConfig,
  updateDQConfig,
} from "../../../redux/dqChecks/dqChecksActions";
import { EditOutlined } from "@ant-design/icons";
import SideMenu from "./../SideMenu";

function DQChecksManage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [form] = useForm();

  const { survey_uid } = useParams<any>() ?? {
    survey_uid: "",
  };

  // Get the form_uid parameter from the URL
  const [searchParam] = useSearchParams();
  const form_uid = searchParam.get("form_uid");

  if (!survey_uid) {
    navigate("/surveys");
  }

  if (!form_uid) {
    navigate(`/module-configuration/dq-checks/${survey_uid}`);
  }

  const userProfile = useAppSelector((state: RootState) => state.auth.profile);
  const canUserWrite = userHasPermission(
    userProfile,
    survey_uid,
    "WRITE Data Quality"
  );

  const { loading: isSurveyCTOFormLoading, surveyCTOForm } = useAppSelector(
    (state: RootState) => state.surveyCTOInformation
  );
  const { loading: isMappingLoading, mappingConfig: targetStatusMapping } =
    useAppSelector((state: RootState) => state.targetStatusMapping);

  const {
    loading: isDQConfigLoading,
    checkTypes: checkTypes,
    dqConfig: dqConfig,
  } = useAppSelector((state: RootState) => state.dqChecks);

  const [isDQChecksLoading, setIsDQChecksLoading] = useState<boolean>(false);

  const [formSurveyStatusData, setFormSurveyStatusData] = useState<any>({
    form_uid: form_uid,
    survey_status_filter: [],
    group_by_module_name: false,
  });

  const [dqChecksTableData, setDQChecksTableData] = useState<any[]>([]);

  useEffect(() => {
    dispatch(getDQCheckTypes());
    dispatch(getSurveyCTOForm({ survey_uid }));
  }, [dispatch]);

  useEffect(() => {
    if (form_uid) {
      dispatch(getTargetStatusMapping({ formUID: form_uid }));
      dispatch(getDQConfig({ form_uid }));
    }
  }, [dispatch, form_uid]);

  useEffect(() => {
    if (dqConfig?.survey_status_filter?.length > 0) {
      setFormSurveyStatusData((prev: any) => ({
        ...prev,
        survey_status_filter: dqConfig.survey_status_filter,
      }));
    } else if (targetStatusMapping?.length > 0) {
      const statuses = targetStatusMapping.filter(
        (item: any) => item.completed_flag === true
      )?.[0]?.survey_status;

      setFormSurveyStatusData((prev: any) => ({
        ...prev,
        survey_status_filter: statuses ? [statuses] : [],
      }));
    } else {
      setFormSurveyStatusData((prev: any) => ({
        ...prev,
        survey_status_filter: [],
      }));
    }
    setFormSurveyStatusData((prev: any) => ({
      ...prev,
      group_by_module_name: dqConfig?.group_by_module_name ?? false,
    }));
  }, [targetStatusMapping, dqConfig]);

  useEffect(() => {
    setIsDQChecksLoading(true);
    if (checkTypes.length > 0) {
      const dqChecksTableData = checkTypes.map((item: any) => {
        // find the number of checks configured for this type
        const numConfigured = dqConfig?.dq_checks?.find(
          (check: any) => check.type_id === item.type_id
        )?.num_configured;
        // find the number of active checks for this type
        const numActive = dqConfig?.dq_checks?.find(
          (check: any) => check.type_id === item.type_id
        )?.num_active;

        return {
          type_id: item.type_id,
          type_name: item.name,
          num_configured: numConfigured ?? 0,
          num_active: numActive ?? 0,
        };
      });

      setDQChecksTableData(dqChecksTableData);
    } else {
      setDQChecksTableData([]);
    }
    setIsDQChecksLoading(false);
  }, [checkTypes, dqConfig]);

  const handleSave = () => {
    if (formSurveyStatusData.survey_status_filter.length === 0) {
      return;
    }

    dispatch(
      updateDQConfig({
        data: {
          form_uid: form_uid,
          survey_status_filter: formSurveyStatusData.survey_status_filter,
          group_by_module_name: formSurveyStatusData.group_by_module_name,
        },
      })
    ).then((res) => {
      if (res.payload?.success) {
        if (form_uid) {
          dispatch(getDQConfig({ form_uid }));
        }
        message.success("DQ config saved successfully.");
      }
    });
  };

  const tableColumns = [
    {
      title: "Check type",
      dataIndex: "type_name",
      key: "type_name",
      width: 120,
    },
    {
      title: "Number of checks configured",
      dataIndex: "num_configured",
      key: "num_configured",
      width: 150,
    },
    {
      title: "Number of active checks",
      dataIndex: "num_active",
      key: "num_active",
      width: 150,
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (text: any, record: any) => (
        <span>
          <CustomLinkBtn
            type="link"
            onClick={() => handleEdit(record?.type_id)}
          >
            <EditOutlined />
          </CustomLinkBtn>
        </span>
      ),
      width: 120,
    },
  ];

  const handleEdit = (type_id: string) => {
    navigate(
      `/module-configuration/dq-checks/${survey_uid}/${form_uid}/edit/${type_id}`
    );
  };

  const isLoading =
    isSurveyCTOFormLoading ||
    isMappingLoading ||
    isDQConfigLoading ||
    isDQChecksLoading;

  return (
    <>
      {isLoading ? (
        <FullScreenLoader />
      ) : (
        <>
          <Container surveyPage={true} />
          <HeaderContainer>
            <Title>Data Quality Checks</Title>
          </HeaderContainer>
          <div style={{ display: "flex" }}>
            <SideMenu />
            <DQFormWrapper>
              <p style={{ color: "#8C8C8C", fontSize: 14 }}>
                Configure data quality checks for the form with form ID:{" "}
                {surveyCTOForm?.scto_form_id}
              </p>
              <Collapse
                ghost
                defaultActiveKey={dqConfig ? ["2"] : ["1"]}
                items={[
                  {
                    key: "1",
                    label: `Step 1: Global configuration`,
                    children: (
                      <div style={{ marginLeft: "25px" }}>
                        <Row
                          align="middle"
                          style={{ marginBottom: 0, marginTop: 0 }}
                        >
                          <Col span={5}>
                            <FormItemLabel>
                              <span style={{ color: "red" }}>*</span> Select
                              survey status values{" "}
                              <Tooltip title="Checks will run only on submissions with the selected survey status values. Dropdown contains all the survey status values configured under Target status mapping module and by default, the ones with completed flag 'true' are selected.">
                                <QuestionCircleOutlined />
                              </Tooltip>{" "}
                              :
                            </FormItemLabel>
                          </Col>
                          <Col span={8}>
                            <Select
                              style={{ width: "100%" }}
                              placeholder="Select survey status values on which checks will run"
                              options={
                                targetStatusMapping.map((item: any) => {
                                  return {
                                    label: `${item.survey_status} - ${item.survey_status_label}`,
                                    value: item.survey_status,
                                  };
                                }) ?? []
                              }
                              mode="multiple"
                              allowClear
                              optionFilterProp="label"
                              value={formSurveyStatusData?.survey_status_filter}
                              disabled={!canUserWrite}
                              onChange={(val) => {
                                setFormSurveyStatusData((prev: any) => ({
                                  ...prev,
                                  survey_status_filter: val,
                                }));
                              }}
                            ></Select>
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <FormItemLabel>
                              <CheckboxDQ
                                checked={
                                  formSurveyStatusData?.group_by_module_name
                                }
                                disabled={!canUserWrite}
                                onChange={(e) => {
                                  setFormSurveyStatusData((prev: any) => ({
                                    ...prev,
                                    group_by_module_name: e.target.checked,
                                  }));
                                }}
                              >
                                Group DQ check outputs by module name
                              </CheckboxDQ>
                              <Tooltip title="Selecting this option will enable 'Module Name' input on all checks. This column will then be included in the outputs and can be used to filter and group the results.">
                                <QuestionCircleOutlined />
                              </Tooltip>{" "}
                            </FormItemLabel>
                          </Col>
                        </Row>
                        <div>
                          <CustomBtn
                            style={{ marginTop: 10, marginBottom: 10 }}
                            disabled={!canUserWrite}
                            onClick={handleSave}
                          >
                            Save
                          </CustomBtn>
                        </div>
                      </div>
                    ),
                  },
                  // show the checks table only if survey_status_filter is configured
                  ...(dqConfig?.survey_status_filter?.length > 0
                    ? [
                        {
                          key: "2",
                          label: `Step 2: Configure checks`,
                          children: (
                            <div style={{ marginLeft: "25px" }}>
                              <DQChecksTable
                                columns={tableColumns}
                                dataSource={dqChecksTableData}
                                bordered
                                pagination={false}
                              />
                            </div>
                          ),
                        },
                      ]
                    : []),
                ]}
              />
            </DQFormWrapper>
          </div>
        </>
      )}
    </>
  );
}

export default DQChecksManage;
