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
  const [val, setVal] = useState(value || "");

  // Update local state when prop changes
  useEffect(() => {
    if (value !== undefined) {
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

  // Immediate form update
  const updateForm = useCallback(
    (newVal: string) => {
      const pathArr = standalone
        ? ["content"]
        : ["templates", formIndex, "content"];
      form.setFieldsValue({
        [pathArr.join(".")]: newVal,
      });
      if (onChange) {
        onChange(newVal);
      }
    },
    [form, onChange, standalone, formIndex]
  );

  // Handle content change immediately
  const handleChange = useCallback(
    (content: string) => {
      setVal(content); // Update local state
      updateForm(content); // Update parent state
    },
    [updateForm]
  );

  // Separate pattern checking into its own effect
  const debouncedPatternCheck = useCallback(
    debounce((text: string, quill: any) => {
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

      quill.formatText(0, text.length, "valid-variable", false);
      quill.formatText(0, text.length, "invalid-variable", false);

      let match;
      while ((match = pattern.exec(text)) !== null) {
        const aggregationFunction = match[1];
        const variableName = match[2] || match[3];

        const isValid = aggregationFunction
          ? aggregationFunctions.includes(aggregationFunction) &&
            validVariables?.includes(variableName)
          : validVariables?.includes(variableName);

        quill.formatText(
          match.index,
          match[0].length,
          isValid ? "valid-variable" : "invalid-variable",
          match[0]
        );
      }
    }, 300),
    [validVariables]
  );

  // Run pattern check separately from state updates
  useEffect(() => {
    const quill = quillRef.current.getEditor();
    debouncedPatternCheck(quill.getText(), quill);
  }, [val, validVariables]);

  return (
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
  );
}

export default EmailContentEditor;
