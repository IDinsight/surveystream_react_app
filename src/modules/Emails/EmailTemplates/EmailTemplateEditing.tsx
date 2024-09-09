import { MinusCircleOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, Row, Select } from "antd";
import { useAppDispatch } from "../../../redux/hooks";
import { useRef, useState } from "react";
import ReactQuill from "react-quill";
import { useParams } from "react-router-dom";
import EmailContentEditor from "../../../components/EmailContentEditor";
import EmailTableCard from "../../../components/EmailTableCard";

const { Option } = Select;

interface EmailTemplateEditingProps {
  data: any;
}

function EmailTemplateEditing({ data }: EmailTemplateEditingProps) {
  console.log(data);
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
                  <Row>
                    <Col span={12}>
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
                        <Row style={{ marginTop: 16 }}>
                          <Button onClick={handleInsertVariable}>
                            {selectedVariable.variable !== null &&
                            selectedVariable.aggregation === null
                              ? "Insert variable without function"
                              : "Insert variable"}
                          </Button>
                        </Row>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={24}>
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
                </div>
              </div>
            ))}
          </>
        )}
      </Form.List>
    </Form>
  );
}

export default EmailTemplateEditing;
