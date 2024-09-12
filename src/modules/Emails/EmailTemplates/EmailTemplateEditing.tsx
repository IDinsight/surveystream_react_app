import { MinusCircleOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, message, Row, Select } from "antd";
import { useAppDispatch } from "../../../redux/hooks";
import { useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill";
import { useParams } from "react-router-dom";
import EmailContentEditor from "../../../components/EmailContentEditor";
import EmailTableCard from "../../../components/EmailTableCard";
import { getEmailTemplates } from "../../../redux/emails/apiService";
import FullScreenLoader from "../../../components/Loaders/FullScreenLoader";
import { set } from "lodash";
import EmailTableModel from "../../../components/EmailTableModel";
import { updateEmailTemplate } from "../../../redux/emails/emailsActions";

const { Option } = Select;

interface EmailTemplateEditingProps {
  emailTemplateConfig: any;
  setIsDrawerOpen: any;
}

function EmailTemplateEditing({
  emailTemplateConfig,
  setIsDrawerOpen,
}: EmailTemplateEditingProps) {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();

  const quillRef = useRef<ReactQuill>(null);
  const [cursorPosition, setCursorPosition] = useState<number | null>(null);

  const [loading, setLoading] = useState(false);

  const [availableLanguages, setAvailableLanguages] = useState([]);
  const [availableVariables, setAvailableVariables] = useState([]);
  const [insertedVariables, setInsertedVariables] = useState<
    {
      variable_name: string;
      variable_expression: string;
    }[]
  >([]);

  const [tableList, setTableList] = useState<any>([]);
  const [selectedVariable, setSelectedVariable] = useState<any>({
    variable: null,
    aggregation: null,
  });

  const [insertTableModelOpen, setInsertTableModelOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const aggregationFunctions = [
    "SUM",
    "COUNT",
    "AVG",
    "MIN",
    "MAX",
    "UPPER",
    "LOWER",
    "TITLE",
  ];

  const insertText = (text: string) => {
    const quill = quillRef.current;
    if (quill) {
      const editor = quill.getEditor();
      if (editor) {
        const cursorIndex =
          cursorPosition !== null ? cursorPosition : editor.getLength();
        editor.insertText(cursorIndex, text);
        editor.setSelection({ index: cursorIndex + text.length, length: 0 });

        editor.focus();
      }
    }
  };

  const handleInsertVariable = (mode: string) => {
    const { variable, aggregation } = selectedVariable;
    if (variable) {
      let text = `{{${variable}}}`;
      if (aggregation) {
        text = `{{${aggregation}(${variable})}}`;
      }
      if (mode === "subject") {
        form.setFieldsValue({ subject: form.getFieldValue("subject") + text });
      } else if (mode === "content") {
        insertText(text);
      }
      setInsertedVariables((prev: any) => [
        ...prev,
        {
          variable_name: variable,
          variable_expression: text,
        },
      ]);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      try {
        const formValues = await form.validateFields();
      } catch (error) {
        setLoading(false);
        return;
      }

      const fieldValues = form.getFieldsValue(true);

      const { email_template_uid, email_config_uid } = emailTemplateConfig;

      const emailTemplatePayload = {
        email_config_uid: email_config_uid,
        subject: fieldValues.subject,
        content: fieldValues.content,
        language: fieldValues.language,
        variable_list: insertedVariables,
        table_list: tableList,
      };

      dispatch(
        updateEmailTemplate({
          email_template_uid,
          emailTemplatePayload,
        })
      ).then((resp: any) => {
        console.log(resp);
        if (resp?.payload?.data?.success) {
          message.success("Email template saved successfully");
          setIsDrawerOpen(false);
        }
      });

      setLoading(false);
    } catch (error) {
      setLoading(false);
      message.error("Failed to save email template");
    }
  };

  useEffect(() => {
    if (emailTemplateConfig) {
      const { email_config_uid } = emailTemplateConfig;
      setLoading(true);
      getEmailTemplates(email_config_uid)
        .then((resp: any) => {
          if (resp.status === 200 && resp?.data?.success) {
            const templateConfigs = resp.data.data;
            const config = templateConfigs.filter(
              (templateConfig: any) =>
                templateConfig.email_template_uid ===
                emailTemplateConfig.email_template_uid
            );
            if (config.length > 0) {
              const emailTemplate = config[0];
              form.setFieldsValue({
                language: emailTemplate.language,
                subject: emailTemplate.subject,
                content: emailTemplate.content,
              });

              setTableList(emailTemplate.table_list);
              setInsertedVariables(emailTemplate.variable_list);
            }
          }
        })
        .catch((error) => {
          message.error("Failed to fetch email template");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [emailTemplateConfig, dispatch]);

  if (loading) {
    return <FullScreenLoader />;
  }

  return (
    <Form form={form} layout="vertical">
      <Row>
        <Col span={12}>
          <Form.Item
            name="language"
            label="Language"
            rules={[{ required: true, message: "Please select language" }]}
            tooltip="Select the language for the email template"
          >
            <Select placeholder="Select language" disabled>
              {availableLanguages.map((language) => (
                <Option key={language} value={language}>
                  {language}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="subject"
            label="Subject"
            rules={[{ required: true, message: "Please enter subject" }]}
            tooltip="Enter the subject of the email template"
          >
            <Input placeholder="Enter subject" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <div
            style={{
              marginLeft: "12px",
              border: "1px solid #d9d9d9",
              padding: "16px",
              borderRadius: "4px",
              height: "250px",
            }}
          >
            <p
              style={{
                fontWeight: "bold",
                fontSize: "18px",
                marginTop: 0,
              }}
            >
              Insert variables
            </p>
            <p>List of variables:</p>
            <Select
              showSearch
              style={{ width: 250 }}
              placeholder="Select an option"
              optionFilterProp="children"
              onChange={(value) =>
                setSelectedVariable((prev: any) => ({
                  ...prev,
                  variable: value,
                }))
              }
            >
              {availableVariables.map((variable) => (
                <Option key={variable} value={variable}>
                  {variable}
                </Option>
              ))}
            </Select>
            <p>List of aggregation functions:</p>
            <Select
              showSearch
              style={{ width: 250 }}
              placeholder="Select an option"
              onChange={(value) =>
                setSelectedVariable((prev: any) => ({
                  ...prev,
                  aggregation: value,
                }))
              }
            >
              <Option value={null}>Not required</Option>
              {aggregationFunctions.map((fun) => (
                <Option key={fun} value={fun}>
                  {fun}
                </Option>
              ))}
            </Select>
            <Row style={{ marginTop: 8 }}>
              {/* <Button onClick={() => handleInsertVariable("subject")}>
                Insert in Subject
              </Button> */}
              <Button onClick={() => handleInsertVariable("content")}>
                Insert in Content
              </Button>
            </Row>
          </div>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Form.Item
            name="content"
            label="Content"
            rules={[{ required: true, message: "Please enter content" }]}
            tooltip="Enter the content of the email template"
            getValueProps={(value) => ({ value })}
            getValueFromEvent={(content) => content}
          >
            <EmailContentEditor
              quillRef={quillRef}
              form={form}
              formIndex={0}
              setCursorPosition={setCursorPosition}
              standalone={true}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <EmailTableCard
            tableList={tableList}
            handleEditTable={(index: number) => {
              setEditingIndex(index);
              setInsertTableModelOpen(true);
            }}
          />
          <Button
            onClick={() => {
              setEditingIndex(null);
              setInsertTableModelOpen(true);
            }}
          >
            Insert table
          </Button>
        </Col>
      </Row>
      <div style={{ marginTop: 16 }}>
        <Button loading={loading} onClick={() => setIsDrawerOpen(false)}>
          Cancel
        </Button>
        <Button
          type="primary"
          style={{
            backgroundColor: "#597EF7",
            color: "white",
            marginLeft: 8,
          }}
          loading={loading}
          onClick={handleSubmit}
        >
          Save Changes
        </Button>
      </div>
      <EmailTableModel
        open={insertTableModelOpen}
        setOpen={setInsertTableModelOpen}
        configUID={emailTemplateConfig.email_config_uid}
        tableList={tableList}
        setTableList={(value: any) => {
          const newTableList = [...tableList];
          if (editingIndex !== null) {
            newTableList[editingIndex] = value;
          } else {
            newTableList.push(value);
          }

          setTableList(newTableList);
        }}
        editingIndex={editingIndex}
        setEditingIndex={setEditingIndex}
        insertText={(text: string) => insertText(text)}
      />
    </Form>
  );
}

export default EmailTemplateEditing;
