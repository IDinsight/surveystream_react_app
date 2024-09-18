import { useState, useEffect, useRef } from "react";
import { Form, Input, Button, Select, message, Row, Col, Divider } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { useAppDispatch } from "../../../redux/hooks";
import { createEmailTemplates } from "../../../redux/emails/emailsActions";
import { getEnumeratorLanguages } from "../../../redux/enumerators/enumeratorsActions";
import EmailContentEditor from "../../../components/EmailContentEditor";
import EmailTableModel from "../../../components/EmailTableModel";
import { useParams } from "react-router-dom";
import EmailTableCard from "../../../components/EmailTableCard";
import ReactQuill from "react-quill";
import React from "react";
const { Option } = Select;

interface EmailTemplateFormProps {
  handleContinue: () => void;
  handleBack: () => void;
  config: any;
  sctoForms: any;
  emailConfigUID: string;
}

const EmailTemplateForm = ({
  handleContinue,
  handleBack,
  config,
  sctoForms,
  emailConfigUID,
}: EmailTemplateFormProps) => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();

  const [formStates, setFormStates] = useState<any>([
    {
      quillRef: React.createRef<ReactQuill>(),
      insertedVariables: [],
      tableList: [],
      cursorPosition: 0,
    },
  ]);

  const [loading, setLoading] = useState(false);

  const [availableLanguages, setAvailableLanguages] = useState([]);
  const [availableVariables, setAvailableVariables] = useState([]);

  const [selectedVariable, setSelectedVariable] = useState<any>({
    variable: null,
    aggregation: null,
  });

  const [currentFormIndex, setCurrentFormIndex] = useState<number | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [insertTableModelOpen, setInsertTableModelOpen] = useState(false);

  const addFormState = (index: number | null = null) => {
    const currentData = index !== null ? formStates[index] : null;
    const newFormState = {
      quillRef: React.createRef<ReactQuill>(),
      insertedVariables: currentData ? [...currentData.insertedVariables] : [],
      tableList: currentData ? [...currentData.tableList] : [],
      cursorPosition: 0,
    };
    setFormStates([...formStates, newFormState]);
  };

  const updateFormState = (index: any, key: any, value: any) => {
    const newFormStates = [...formStates];
    newFormStates[index][key] = value;
    setFormStates(newFormStates);
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

      const { templates } = form.getFieldsValue();
      if (templates) {
        const templatePayload = [];
        for (let i = 0; i < templates.length; i++) {
          const template = templates[i];

          templatePayload.push({
            language: template.language,
            subject: template.subject,
            content: template.content,
            variable_list: formStates[i].insertedVariables,
            table_list: formStates[i].tableList,
          });
        }

        const res = await dispatch(
          createEmailTemplates({
            email_config_uid: emailConfigUID,
            templates: [...templatePayload],
          })
        );

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
        handleContinue();
      }
    } catch (error) {
      message.error("Failed to update email templates");
    }
    setLoading(false);
  };

  const insertText = (text: string, index: number) => {
    const quillRef = formStates[index].quillRef;
    const quill = quillRef.current;
    if (quill) {
      const editor = quill.getEditor();
      if (editor) {
        const cursorIndex =
          formStates[index].cursorPosition !== null
            ? formStates[index].cursorPosition
            : editor.getLength();
        editor.insertText(cursorIndex, text);
        editor.setSelection({ index: cursorIndex + text.length, length: 0 });

        editor.focus();
      }
    }
  };

  const handleInsertVariable = (formIndex: any, mode: string) => {
    const { variable, aggregation } = selectedVariable;
    if (variable) {
      let text = `{{${variable}}}`;
      if (aggregation) {
        text = `{{${aggregation}(${variable})}}`;
      }

      insertText(text, formIndex);
      updateFormState(formIndex, "insertedVariables", [
        ...formStates[formIndex].insertedVariables,
        {
          variable_name: variable,
          variable_expression: text,
        },
      ]);
    }

    // Reset after insertion
    setSelectedVariable({
      variable_name: null,
      variable_expression: null,
    });
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
    if (sctoForms.length > 0) {
      if (sctoForms[0].form_uid) {
        dispatch(
          getEnumeratorLanguages({
            formUID: sctoForms[0].form_uid,
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
  }, [sctoForms]);

  // Getting and setting available variables
  useEffect(() => {
    if (config?.length > 0) {
      const filteredConfigs = config?.filter(
        (config: any) => config.email_config_uid === emailConfigUID
      );
      if (filteredConfigs.length > 0) {
        setAvailableVariables(filteredConfigs[0].email_source_columns);
      }
    }
  }, [config]);

  return (
    <Form form={form} layout="vertical">
      <Form.List name="templates" initialValue={[{}]}>
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }, formIndex) => (
              <>
                <Divider />
                <div key={key} style={{ display: "flex" }}>
                  <div style={{ marginBottom: 8, flex: "6" }}>
                    {fields.length > 1 && (
                      <MinusCircleOutlined
                        onClick={() => {
                          remove(name);
                          setFormStates((prevFormStates: any) =>
                            prevFormStates.filter(
                              (_: any, index: number) => index !== formIndex
                            )
                          );
                        }}
                        style={{ float: "right", color: "red" }}
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
                        quillRef={formStates[formIndex].quillRef}
                        form={form}
                        formIndex={formIndex}
                        setCursorPosition={(position: any) =>
                          updateFormState(formIndex, "cursorPosition", position)
                        }
                        value={form.getFieldValue([
                          "templates",
                          name,
                          "content",
                        ])}
                      />
                    </Form.Item>
                    <EmailTableCard
                      tableList={formStates[formIndex].tableList}
                      handleEditTable={(tableIndex: any) => {
                        setEditingIndex(tableIndex);
                        setInsertTableModelOpen(true);
                        setCurrentFormIndex(formIndex);
                      }}
                    />
                    <Button
                      onClick={() => {
                        setEditingIndex(null);
                        setInsertTableModelOpen(true);
                        setCurrentFormIndex(formIndex);
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
                      {/* <Button
                        onClick={() =>
                          handleInsertVariable(formIndex, "subject")
                        }
                      >
                        Insert in Subject
                      </Button> */}
                      <Button
                        onClick={() =>
                          handleInsertVariable(formIndex, "content")
                        }
                      >
                        Insert in Content
                      </Button>
                    </Row>
                  </div>
                </div>
              </>
            ))}
            <Row style={{ marginTop: 10 }}>
              <Col>
                <Form.Item>
                  <Button
                    onClick={() => {
                      add();
                      addFormState();
                    }}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add another language with empty fields
                  </Button>
                </Form.Item>
              </Col>
              <Col>
                <Form.Item>
                  <Button
                    style={{ marginLeft: 16 }}
                    onClick={() => {
                      const currentFields = form.getFieldsValue().templates;
                      const lastIndex = currentFields.length - 1;
                      add(currentFields[lastIndex]);
                      addFormState(lastIndex);
                    }}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add another language with current fields
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </>
        )}
      </Form.List>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "20px",
        }}
      >
        <Button
          style={{
            float: "left",
          }}
          loading={loading}
          onClick={handleBack}
        >
          Back
        </Button>

        <Button
          style={{
            marginRight: "40%",
            marginLeft: "40%",
          }}
          loading={loading}
          onClick={handleContinue}
        >
          Skip
        </Button>

        <Button
          type="primary"
          style={{
            backgroundColor: "#597EF7",
            color: "white",
            marginLeft: "auto",
            marginRight: "5$",
          }}
          loading={loading}
          onClick={handleSubmit}
        >
          Continue
        </Button>
      </div>
      {currentFormIndex !== null && (
        <EmailTableModel
          open={insertTableModelOpen}
          setOpen={setInsertTableModelOpen}
          configUID={emailConfigUID}
          tableList={formStates[currentFormIndex].tableList}
          setTableList={(value: any) => {
            const newFormStates = [...formStates];
            if (editingIndex !== null) {
              newFormStates[currentFormIndex].tableList[editingIndex] = value;
            } else {
              newFormStates[currentFormIndex].tableList.push(value);
            }
            setFormStates(newFormStates);
          }}
          editingIndex={editingIndex}
          setEditingIndex={setEditingIndex}
          insertText={(text: string) => insertText(text, currentFormIndex)}
        />
      )}
    </Form>
  );
};

export default EmailTemplateForm;
