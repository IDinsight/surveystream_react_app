import { useEffect, useState, useRef, useCallback } from "react";
import { Form, Button, Select, Input, message, Row, Col } from "antd";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import dayjs from "dayjs";
import {
  createEmailTemplate,
  updateEmailTemplate,
} from "../../../redux/emails/emailsActions";
import { useAppDispatch } from "../../../redux/hooks";

const { Option } = Select;

const EmailTemplateEditForm = ({
  emailConfigData,
  fetchEmailTemplates,
  initialValues = {},
  isEditMode = false,
}: any) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [editorHtml, setEditorHtml] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFunction, setSelectedFunction] = useState("");
  const [expression, setExpression] = useState("");
  const [selectedTable, setSelectedTable] = useState("");
  const editorRef = useRef(null);

  const dispatch = useAppDispatch();

  const variables = [
    "first_name",
    "last_name",
    "email",
    "phone_number",
    "address",
    "city",
    "state",
    "zipcode",
    "country",
    "company_name",
    // Add more variables as needed
  ];

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

  const tables = {
    users: ["id", "first_name", "last_name", "email"],
  };

  const handleInsertColumn = (columnName: any) => {
    if (selectedTable && editorRef.current) {
      const columnWithTable = `${selectedTable}.${columnName}`;
      const html = `<span data-column="${columnWithTable}" style="background-color: lightgreen;">${columnWithTable}</span>`;
      const range = editorRef.current.getSelection();
      if (range && range.index !== undefined) {
        editorRef.current.clipboard.dangerouslyPasteHTML(range.index, html);
      } else {
        editorRef.current.clipboard.dangerouslyPasteHTML(
          editorRef.current.getLength(),
          html
        );
      }
      setSelectedTable(columnName);
    }
  };

  const handleInsertTable = (tableName: any) => {
    const html = `<span data-table="${tableName}" style="background-color: lightblue;">${tableName}</span>`;
    const range = editorRef?.current?.getSelection();
    if (range && range.index !== undefined) {
      editorRef.current.clipboard.dangerouslyPasteHTML(range.index, html);
    } else {
      editorRef.current.clipboard.dangerouslyPasteHTML(
        editorRef.current.getLength(),
        html
      );
    }
    setSelectedTable(tableName);
  };

  const handleEditorClick = useCallback((event) => {
    const target = event.target;

    if (target && target.tagName === "SPAN" && target.dataset.variable) {
      const variable = target.dataset.variable;
      insertVariable(variable);
    }
  }, []);

  const insertVariable = (variable: any) => {
    if (variable && editorRef.current) {
      let insertionText = `{{${variable}}}`;

      if (selectedFunction) {
        insertionText = `${selectedFunction}(${variable}${
          expression ? ` ${expression}` : ""
        })`;
      }

      const html = `<span data-variable="${variable}" style="font-style: italic; color:blue">${insertionText}</span>`;
      const range = editorRef?.current?.getSelection();

      if (range && range.index !== undefined) {
        editorRef.current?.clipboard.dangerouslyPasteHTML(range.index, html);
      } else {
        // If there's no selection, just insert at the end of the editor
        editorRef.current?.clipboard.dangerouslyPasteHTML(
          editorRef.current?.getLength(),
          html
        );
      }
    }
  };

  const handleInsertExpression = () => {
    if (expression && editorRef.current) {
      const range = editorRef.current.getSelection();

      if (range) {
        editorRef.current.clipboard.dangerouslyPasteHTML(
          range.index,
          ` ${expression}`
        );
      } else {
        // If there's no selection, just insert at the end of the editor
        editorRef.current.clipboard.dangerouslyPasteHTML(
          editorRef.current.getLength(),
          ` ${expression}`
        );
      }
      setExpression("");
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const formValues = await form.validateFields();
      console.log("formValues", formValues);

      const template = form.getFieldsValue();

      const templateData = {
        email_config_uid: template.email_config_uid,
        language: template.language,
        subject: template.subject,
        content: template.content,
      };

      console.log("templateData", templateData);

      const res = await dispatch(createEmailTemplate({ ...templateData }));

      console.log("createEmailTemplate res", res);

      if (!res.payload.success) {
        // Error occurred
        message.error(
          res.payload?.message
            ? res.payload?.message
            : "An error occurred, email template could not be created. Kindly check form data and try again"
        );
        setLoading(false);
        return;
      }

      message.success("Email templates updated successfully");
    } catch (error) {
      console.error("error", error);
      message.error("Failed to update email templates");
    }
    setLoading(false);
  };

  const filteredVariables = variables.filter((variable: string) =>
    variable.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTables = Object.keys(tables).filter((table) =>
    table.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (!editorRef.current) {
      const editorElement = document.createElement("div");
      editorRef.current = new Quill(editorElement, {
        theme: "snow", // Snow theme for rich text editing
        modules: {
          toolbar: [
            [{ header: "1" }, { header: "2" }, { font: [] }],
            [{ size: [] }],
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "image", "video"],
            ["clean"],
          ],
        },
      });
      // Event listener for text-change to update editorHtml state
      editorRef.current.on("text-change", () => {
        setEditorHtml(editorRef.current.root.innerHTML);
        console.log("change content text", editorRef.current.root.innerHTML);
        form.setFieldValue("content", editorRef.current.root.innerHTML);
      });
      // Event listener for clicking on editor content
      editorRef.current.root.addEventListener("click", handleEditorClick);
      // Append editor to the DOM
      const editorContainer = document.getElementById("editor-container");
      if (editorContainer) {
        editorContainer.appendChild(editorElement);
      }
    }

    return () => {
      if (editorRef.current) {
        editorRef.current?.root?.removeEventListener(
          "click",
          handleEditorClick
        );
      }
    };
  }, []);

  useEffect(() => {
    if (isEditMode && initialValues) {
      console.log("initialValues", initialValues);
    }
  }, [isEditMode, initialValues, form]);

  return (
    <>
      <Row gutter={16}>
        <Col span={12}>
          {/* Left column content */}
          <Form form={form} layout="vertical">
            <Form.Item
              name="email_config_uid"
              label="Email Configuration"
              rules={[
                {
                  required: true,
                  message: "Please select an email configuration",
                },
              ]}
            >
              <Select
                placeholder="Select email configuration"
                options={emailConfigData.map((config: any) => ({
                  label: config.config_type,
                  value: config.email_config_uid,
                }))}
              />
            </Form.Item>
            <Form.Item
              name={"language"}
              label="Language"
              rules={[{ required: true, message: "Please select language" }]}
            >
              <Input placeholder="Enter language" />
            </Form.Item>
            <Form.Item
              name={"subject"}
              label="Subject"
              rules={[{ required: true, message: "Please enter subject" }]}
            >
              <Input placeholder="Enter subject" />
            </Form.Item>

            <Form.Item
              name={"content"}
              label="Content"
              rules={[{ required: true, message: "Please enter content" }]}
            >
              <div id="editor-container" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" onClick={handleSubmit} loading={loading}>
                {isEditMode ? "Update" : "Submit"}
              </Button>
            </Form.Item>
          </Form>
        </Col>
        <Col span={6}>
          {/* Middle column content */}
          <Input.Search
            placeholder="Search variables"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ marginBottom: 8 }}
          />

          {filteredVariables.length > 0 && (
            <div style={{ marginBottom: 8, fontFamily: "Lato" }}>
              <h3>Variables</h3>
              <ul>
                {filteredVariables.map((variable) => (
                  <li
                    key={variable}
                    style={{
                      cursor: "pointer",
                      color: "blue",
                      textDecoration: "underline",
                    }}
                    onClick={() => insertVariable(variable)}
                  >
                    {variable}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {filteredTables.length > 0 && (
            <div style={{ marginBottom: 8, fontFamily: "Lato" }}>
              <h3>Tables</h3>
              <ul>
                {filteredTables.map((table) => (
                  <li
                    key={table}
                    style={{
                      cursor: "pointer",
                      color: "green",
                      textDecoration: "underline",
                    }}
                    onClick={() => handleInsertTable(table)}
                  >
                    {table}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {selectedTable && (
            <div style={{ marginBottom: 8, fontFamily: "Lato" }}>
              <h3>Columns in {selectedTable}</h3>
              <ul>
                {tables[selectedTable].map((column: any) => (
                  <li
                    key={column}
                    style={{
                      cursor: "pointer",
                      color: "purple",
                      textDecoration: "underline",
                    }}
                    onClick={() => handleInsertColumn(column)}
                  >
                    {column}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Col>
        <Col span={6}>
          {/* Right column content */}
          <div style={{ marginBottom: 8, fontFamily: "Lato" }}>
            <Select
              placeholder="Select function"
              style={{ width: "100%", marginBottom: 8 }}
              value={selectedFunction}
              onChange={(value) => setSelectedFunction(value)}
            >
              {aggregationFunctions.map((func) => (
                <Option key={func} value={func}>
                  {func}
                </Option>
              ))}
            </Select>

            <Input
              placeholder="Enter expression"
              style={{ width: "100%", marginBottom: 8 }}
              value={expression}
              onChange={(e) => setExpression(e.target.value)}
            />
            <Button type="primary" onClick={handleInsertExpression}>
              Insert Expression
            </Button>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default EmailTemplateEditForm;
