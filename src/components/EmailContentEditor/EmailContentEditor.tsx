import { useEffect, useCallback, useState } from "react";
import ReactQuill from "react-quill";
import { debounce } from "lodash";
import "react-quill/dist/quill.snow.css";
import "./PatternBlot";
import "./PatternBlot.css";

interface EmailContentEditorProps {
  form: any;
  formIndex: any;
  quillRef: any;
  setCursorPosition: any;
  value?: string;
  standalone?: boolean;
  disableEdit?: boolean;
  validVariables: string[] | undefined;
  onChange?: (content: string) => void;
}

function EmailContentEditor({
  form,
  formIndex,
  quillRef,
  setCursorPosition,
  value,
  standalone = false,
  disableEdit = false,
  validVariables,
  onChange,
}: EmailContentEditorProps) {
  const [val, setVal] = useState("");

  // Initialize with value prop
  useEffect(() => {
    if (value && val !== value) {
      setVal(value);
    }
  }, [value]);

  const modules = {
    toolbar: [
      [{ header: [2, 3, false] }],
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"],
    ],
  };

  const handleSelectionChange = (range: any) => {
    if (range) {
      setCursorPosition(range.index);
    }
  };

  // Debounced function to set the form field value
  const debouncedSetFieldsValue = useCallback(
    debounce((pathArr, newVal) => {
      const currentValue = form.getFieldValue(pathArr);
      if (currentValue !== newVal) {
        form.setFieldsValue({
          [pathArr.join(".")]: newVal,
        });
        if (onChange) {
          onChange(newVal);
        }
      }
    }, 750),
    [form, onChange]
  );

  // Handle content change
  const handleChange = useCallback((content: string) => {
    setVal(content);
  }, []);

  // Setting the field value on content change in editor
  useEffect(() => {
    const pathArr = standalone
      ? ["content"]
      : ["templates", formIndex, "content"];
    debouncedSetFieldsValue(pathArr, val);
  }, [val, formIndex, standalone, debouncedSetFieldsValue]);

  useEffect(() => {
    const quill = quillRef.current.getEditor();
    const text = quill.getText();

    /* eslint-disable no-useless-escape */
    const pattern =
      /\{\{(?:\s*([^\}\r\n]+)\s*\(([^\}\r\n]+)\)|([^\}\r\n]+))\}\}/g;
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

    // Clear all previous variable formatting
    quill.formatText(0, text.length, "valid-variable", false);
    quill.formatText(0, text.length, "invalid-variable", false);

    let match: any;
    while ((match = pattern.exec(text)) !== null) {
      const aggregationFunction = match[1];
      const variableName = match[2] || match[3];

      if (aggregationFunction) {
        if (
          aggregationFunctions.includes(aggregationFunction) &&
          validVariables &&
          validVariables.includes(variableName)
        ) {
          quill.formatText(
            match.index,
            match[0].length,
            "valid-variable",
            match[0]
          );
        } else {
          quill.formatText(
            match.index,
            match[0].length,
            "invalid-variable",
            match[0]
          );
        }
      } else {
        if (validVariables && validVariables.includes(variableName)) {
          quill.formatText(
            match.index,
            match[0].length,
            "valid-variable",
            match[0]
          );
        } else {
          quill.formatText(
            match.index,
            match[0].length,
            "invalid-variable",
            match[0]
          );
        }
      }
    }
  }, [val, validVariables]);

  return (
    <>
      <ReactQuill
        ref={quillRef}
        style={{ height: "200px", marginBottom: "30px" }}
        theme="snow"
        value={val}
        onChange={handleChange}
        modules={modules}
        onChangeSelection={handleSelectionChange}
        readOnly={disableEdit}
      />
    </>
  );
}

export default EmailContentEditor;
