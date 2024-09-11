import { useState, useEffect, useRef } from "react";
import { Form, Input, Button, Select, message, Row } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { useAppDispatch } from "../../../redux/hooks";
import { createEmailTemplate } from "../../../redux/emails/emailsActions";
import { getEnumeratorLanguages } from "../../../redux/enumerators/enumeratorsActions";
import EmailContentEditor from "../../../components/EmailContentEditor";
import EmailTableModel from "../../../components/EmailTableModel";
import { useParams } from "react-router-dom";
import EmailTableCard from "../../../components/EmailTableCard";
import ReactQuill from "react-quill";
const { Option } = Select;

interface EmailTemplateFormProps {
  handleContinue: (emailConfigUID: string) => void;
  handleBack: () => void;
  config: any;
  stcoForms: any;
  emailConfigUID: string;
}

const EmailTemplateForm = ({
  handleContinue,
  handleBack,
  config,
  stcoForms,
  emailConfigUID,
}: EmailTemplateFormProps) => {
  const { survey_uid } = useParams<{ survey_uid: string }>() ?? {
    survey_uid: "",
  };

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
      source_table: string;
    }[]
  >([]);
  const [emailSourceTable, setEmailSourceTable] = useState("");

  const [tableList, setTableList] = useState([]);

  const [selectedVariable, setSelectedVariable] = useState<any>({
    variable: null,
    aggregation: null,
  });
  const [insertTableModelOpen, setInsertTableModelOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const formValues = await form.validateFields();

      const { templates } = form.getFieldsValue();
      if (templates) {
        // TODO: Make it for multiple languages
        const template = templates[0];

        const templatePayload = {
          email_config_uid: emailConfigUID,
          language: template.language,
          subject: template.subject,
          content: template.content,
          variable_list: insertedVariables,
          table_list: tableList,
        };

        const res = await dispatch(createEmailTemplate({ ...templatePayload }));

        if (!res.payload.success) {
          message.error(
            res.payload?.message
              ? res.payload?.message
              : "An error occurred, email template could not be created. Kindly check form data and try again"
          );
          setLoading(false);
          return;
        }

        message.success("Email templates updated successfully");
        handleContinue(emailConfigUID);
      }
    } catch (error) {
      message.error("Failed to update email templates");
    }
    setLoading(false);
  };

  const insertText = (text: string) => {
    const quill = quillRef.current;
    if (quill) {
      const editor = quill.getEditor();
      if (editor) {
        const index =
          cursorPosition !== null ? cursorPosition : editor.getLength();
        editor.insertText(index, text);
        editor.setSelection({ index: index + text.length, length: 0 });

        editor.focus();
      }
    }
  };

  const handleInsertVariable = () => {
    const { variable, aggregation } = selectedVariable;
    if (variable) {
      let text = `{{${variable}}}`;
      if (aggregation) {
        text = `{{${aggregation}(${variable})}}`;
      }
      insertText(text);
      setInsertedVariables((prev: any) => [
        ...prev,
        {
          variable_name: variable,
          variable_expression: text,
          source_table: emailSourceTable,
        },
      ]);
    }
  };

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

  // Getting enumerator languages
  useEffect(() => {
    if (stcoForms.length > 0) {
      if (stcoForms[0].form_uid) {
        dispatch(
          getEnumeratorLanguages({
            formUID: stcoForms[0].form_uid,
          })
        ).then((res) => {
          if (res.payload?.success) {
            setAvailableLanguages(res.payload.data.data.languages);
          } else {
            message.error(
              res.payload?.message
                ? res.payload?.message
                : "Failed to fetch enumerator languages"
            );
          }
        });
      }
    }
  }, [stcoForms]);

  // Getting and setting available variables
  useEffect(() => {
    if (config?.length > 0) {
      const filteredConfigs = config?.filter(
        (config: any) => config.email_config_uid === emailConfigUID
      );
      if (filteredConfigs.length > 0) {
        setAvailableVariables(filteredConfigs[0].email_source_columns);
        setEmailSourceTable(filteredConfigs[0].email_source_tablename);
      }
    }
  }, [config]);

  return (
    <Form form={form} layout="vertical">
      <Form.List name="templates" initialValue={[{}]}>
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <div key={key} style={{ display: "flex" }}>
                <div style={{ marginBottom: 8, flex: "6" }}>
                  {fields.length > 1 && (
                    <MinusCircleOutlined
                      onClick={() => remove(name)}
                      style={{ float: "right" }}
                    />
                  )}
                  <Form.Item
                    {...restField}
                    name={[name, "language"]}
                    label="Language"
                    rules={[
                      { required: true, message: "Please select language" },
                    ]}
                    tooltip="Select the language for the email template"
                  >
                    <Select placeholder="Select language">
                      {availableLanguages.map((language) => (
                        <Option key={language} value={language}>
                          {language}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, "subject"]}
                    label="Subject"
                    rules={[
                      { required: true, message: "Please enter subject" },
                    ]}
                    tooltip="Enter the subject of the email template"
                  >
                    <Input placeholder="Enter subject" />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, "content"]}
                    label="Content"
                    rules={[
                      { required: true, message: "Please enter content" },
                    ]}
                    tooltip="Enter the content of the email template"
                    getValueProps={(value) => ({ value })}
                    getValueFromEvent={(content) => content}
                  >
                    <EmailContentEditor
                      quillRef={quillRef}
                      form={form}
                      setCursorPosition={setCursorPosition}
                    />
                  </Form.Item>
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
                </div>
                <div
                  style={{
                    flex: "4",
                    marginLeft: "24px",
                    border: "1px solid #d9d9d9",
                    padding: "16px",
                    borderRadius: "4px",
                    height: "250px",
                    marginTop: "30px",
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
                  <Row style={{ marginTop: 16 }}>
                    <Button onClick={handleInsertVariable}>
                      {selectedVariable.variable !== null &&
                      selectedVariable.aggregation === null
                        ? "Insert variable without function"
                        : "Insert variable"}
                    </Button>
                  </Row>
                </div>
              </div>
            ))}

            <Form.Item>
              <Button
                type="dashed"
                onClick={() => add()}
                block
                icon={<PlusOutlined />}
                disabled
              >
                Add another language
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
      <div>
        <Button
          style={{
            display: "flex",
            float: "left",
          }}
          loading={loading}
          onClick={handleBack}
        >
          Back
        </Button>

        <Button
          type="primary"
          style={{
            display: "flex",
            backgroundColor: "#597EF7",
            color: "white",
            float: "right",
          }}
          loading={loading}
          onClick={handleSubmit}
        >
          Continue
        </Button>
      </div>
      <EmailTableModel
        open={insertTableModelOpen}
        setOpen={setInsertTableModelOpen}
        configUID={emailConfigUID}
        tableList={tableList}
        setTableList={setTableList}
        editingIndex={editingIndex}
        setEditingIndex={setEditingIndex}
        insertText={insertText}
      />
    </Form>
  );
};

export default EmailTemplateForm;
