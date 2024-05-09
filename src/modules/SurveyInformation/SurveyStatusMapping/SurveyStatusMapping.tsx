import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import Container from "../../../components/Layout/Container";
import FullScreenLoader from "../../../components/Loaders/FullScreenLoader";
import NavItems from "../../../components/NavItems";
import Header from "../../../components/Header";
import { Button, Form, Input, Select } from "antd";
import { useForm } from "antd/es/form/Form";
import { useEffect } from "react";
import { getSurveyCTOForm } from "../../../redux/surveyCTOInformation/surveyCTOInformationActions";
import { RootState } from "../../../redux/store";
import { ConfirmBtn } from "./SurveyStatusMapping.styled";

function SurveyStatusMapping() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [form] = useForm();

  const { survey_uid } = useParams<{ survey_uid?: string }>() ?? {
    survey_uid: "",
  };

  const { loading: isLoading, surveyCTOForm: sctoForm } = useAppSelector(
    (state: RootState) => state.surveyCTOInformation
  );

  useEffect(() => {
    if (!survey_uid) {
      navigate("/surveys");
    }

    dispatch(getSurveyCTOForm({ survey_uid: survey_uid }));
  }, [dispatch, survey_uid]);

  return (
    <>
      <Header items={NavItems} />
      {isLoading ? (
        <FullScreenLoader />
      ) : (
        <>
          <Container title="Survey status" />
          <div style={{ marginLeft: 56 }}>
            <p style={{ color: "rgba(0,0,0, 0.45)" }}>ACME / Survey status</p>
            <Form
              form={form}
              wrapperCol={{ span: 6 }}
              style={{ marginTop: 48 }}
            >
              <Form.Item
                label="SCTO form ID"
                name="scto-form-id"
                required
                tooltip="This is a required field"
                rules={[
                  { required: true, message: "Please select the form id!" },
                ]}
              >
                <Select placeholder="Select SCTO form ID" allowClear>
                  {Object.keys(sctoForm).length > 0 ? (
                    <Select.Option value={sctoForm.scto_form_id}>
                      {sctoForm.scto_form_id}
                    </Select.Option>
                  ) : null}
                </Select>
              </Form.Item>

              {form.getFieldValue("scto-form-id") ? (
                <>
                  <Form.Item
                    label="Survey modality"
                    name="survey-modality"
                    required
                    tooltip="This is a required field"
                  >
                    <Input defaultValue="In-person" disabled />
                  </Form.Item>
                  <Form.Item shouldUpdate>
                    <ConfirmBtn type="primary">Confirm</ConfirmBtn>
                  </Form.Item>
                </>
              ) : null}
            </Form>
          </div>
        </>
      )}
    </>
  );
}

export default SurveyStatusMapping;
