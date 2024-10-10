import { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  Popconfirm,
  message,
  Row,
  Col,
  Divider,
  Collapse,
} from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { useAppDispatch } from "../../../redux/hooks";
import { createEmailTemplates } from "../../../redux/emails/emailsActions";
import { getEnumeratorLanguages } from "../../../redux/enumerators/enumeratorsActions";
import EmailContentEditor from "../../../components/EmailContentEditor";
import EmailTableModel from "../../../components/EmailTableModel";
import EmailTableCard from "../../../components/EmailTableCard";
import ReactQuill from "react-quill";
import React from "react";
import { getEmailTemplates } from "../../../redux/emails/apiService";

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
          if (disabledIndices.includes(i)) {
            continue;
          }
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

      if (mode === "subject") {
        form.setFieldsValue({
          templates: form
            .getFieldsValue()
            .templates.map((template: any, i: any) =>
              i === formIndex
                ? {
                    ...template,
                    subject: template.subject + text,
                  }
                : template
            ),
        });
      } else if (mode === "content") {
        insertText(text, formIndex);
      }

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

  const [disabledIndices, setDisabledIndices] = useState<number[]>([]);

  const fetchEmailTemplates = async () => {
    const fetchtTemplateRes: any = await getEmailTemplates(emailConfigUID);
    if (fetchtTemplateRes?.data?.success) {
      const templates = fetchtTemplateRes.data.data;
      if (templates.length > 0) {
        const newFormStates = [];
        const newFields = [];
        const newDisabledIndices = [];
        for (let i = 0; i < templates.length; i++) {
          const template = templates[i];
          newFields.push({
            language: template.language,
            subject: template.subject,
            content: template.content,
          });
          newFormStates.push({
            quillRef: React.createRef<ReactQuill>(),
            insertedVariables: template.variable_list,
            tableList: template.table_list,
            cursorPosition: 0,
          });
          newDisabledIndices.push(i);
        }
        form.setFieldsValue({ templates: newFields });
        setFormStates(newFormStates);
        setDisabledIndices(newDisabledIndices);
      }
    }
  };

  useEffect(() => {
    if (emailConfigUID) {
      fetchEmailTemplates();
    }
  }, [emailConfigUID]);

  const [activeKey, setActiveKey] = useState<string | string[]>(["0"]);

  return (
    <Form form={form} layout="vertical">
      {disabledIndices.length > 0 && (
        <div style={{ marginBottom: 16, color: "red" }}>
          Previously filled templates can only be edited at the main screen.
        </div>
      )}
      <Form.List name="templates" initialValue={[{}]}>
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }, formIndex) => (
              <div key={key} style={{ marginBottom: 10 }}>
                <Collapse
                  key={key}
                  activeKey={activeKey}
                  onChange={(keys) => setActiveKey(keys)}
                >
                  <Collapse.Panel
                    header={
                      form.getFieldValue([
                        "templates",
                        formIndex,
                        "language",
                      ]) || `Template ${formIndex + 1}`
                    }
                    key={key}
                    extra={
                      fields.length > 1 &&
                      !disabledIndices.includes(formIndex) && (
                        <Popconfirm
                          title="Are you sure you want to delete this template?"
                          onConfirm={() => remove(name)}
                          okText="Yes"
                          cancelText="No"
                        >
                          <Button
                            type="text"
                            icon={<DeleteOutlined />}
                            style={{ color: "red" }}
                          />
                        </Popconfirm>
                      )
                    }
                  >
                    <Divider />
                    <div style={{ display: "flex" }}>
                      <div style={{ marginBottom: 8, flex: "6" }}>
                        <Form.Item
                          {...restField}
                          name={[name, "language"]}
                          label="Language"
                          rules={[
                            {
                              required: true,
                              message: "Please select language",
                            },
                          ]}
                          tooltip="Select the language for the email template"
                        >
                          <Select
                            placeholder="Select language"
                            disabled={disabledIndices.includes(formIndex)}
                          >
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
                            {
                              required: true,
                              message: "Please enter subject",
                            },
                          ]}
                          tooltip="Enter the subject of the email template"
                        >
                          <Input
                            placeholder="Enter subject"
                            disabled={disabledIndices.includes(formIndex)}
                          />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          name={[name, "content"]}
                          label="Content"
                          rules={[
                            {
                              required: true,
                              message: "Please enter content",
                            },
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
                              updateFormState(
                                formIndex,
                                "cursorPosition",
                                position
                              )
                            }
                            value={form.getFieldValue([
                              "templates",
                              name,
                              "content",
                            ])}
                            disableEdit={disabledIndices.includes(formIndex)}
                          />
                        </Form.Item>
                        <EmailTableCard
                          tableList={formStates[formIndex].tableList}
                          handleEditTable={(tableIndex: any) => {
                            setEditingIndex(tableIndex);
                            setInsertTableModelOpen(true);
                            setCurrentFormIndex(formIndex);
                          }}
                          disableEdit={disabledIndices.includes(formIndex)}
                        />
                        <Button
                          onClick={() => {
                            setEditingIndex(null);
                            setInsertTableModelOpen(true);
                            setCurrentFormIndex(formIndex);
                          }}
                          disabled={disabledIndices.includes(formIndex)}
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
                          value={selectedVariable.variable}
                          onChange={(value) =>
                            setSelectedVariable((prev: any) => ({
                              ...prev,
                              variable: value,
                            }))
                          }
                          disabled={disabledIndices.includes(formIndex)}
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
                          value={selectedVariable.aggregation}
                          onChange={(value) =>
                            setSelectedVariable((prev: any) => ({
                              ...prev,
                              aggregation: value,
                            }))
                          }
                          disabled={disabledIndices.includes(formIndex)}
                        >
                          <Option value={null}>Not required</Option>
                          {aggregationFunctions.map((fun) => (
                            <Option key={fun} value={fun}>
                              {fun}
                            </Option>
                          ))}
                        </Select>
                        <Row style={{ marginTop: 16 }}>
                          <Button
                            onClick={() =>
                              handleInsertVariable(formIndex, "subject")
                            }
                            disabled={disabledIndices.includes(formIndex)}
                          >
                            Insert in Subject
                          </Button>
                          <Button
                            onClick={() =>
                              handleInsertVariable(formIndex, "content")
                            }
                            disabled={disabledIndices.includes(formIndex)}
                          >
                            Insert in Content
                          </Button>
                        </Row>
                      </div>
                    </div>
                  </Collapse.Panel>
                </Collapse>
              </div>
            ))}
            <Row style={{ marginTop: 10 }}>
              <Col>
                <Form.Item>
                  <Button
                    onClick={() => {
                      add();
                      addFormState();
                      setActiveKey([`${fields.length}`]);
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
                      setActiveKey([`${fields.length}`]);
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
