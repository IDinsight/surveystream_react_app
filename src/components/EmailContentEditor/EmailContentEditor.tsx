import { useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface EmailContentEditorProps {
  form: any;
  formIndex: any;
  quillRef: any;
  setCursorPosition: any;
  value?: string;
  standalone?: boolean;
  disableEdit?: boolean;
}

function EmailContentEditor({
  form,
  formIndex,
  quillRef,
  setCursorPosition,
  value,
  standalone = false,
  disableEdit = false,
}: EmailContentEditorProps) {
  const [val, setVal] = useState(value || "");

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

  // Setting the field value on content change in editor
  useEffect(() => {
    const pathArr = standalone
      ? ["content"]
      : ["templates", formIndex, "content"];

    const currentValue = form.getFieldValue(pathArr);
    if (currentValue !== val) {
      form.setFields([
        {
          name: pathArr,
          value: val,
        },
      ]);
    }
  }, [val, form, formIndex]);

  // Setting the value if passed by pros
  useEffect(() => {
    if (value !== undefined && value !== val) {
      setVal(value);
    }
  }, [value]);

  return (
    <>
      <ReactQuill
        ref={quillRef}
        style={{ height: "200px", marginBottom: "30px" }}
        theme="snow"
        value={val}
        onChange={(val) => setVal(val)}
        modules={modules}
        onChangeSelection={handleSelectionChange}
        readOnly={disableEdit}
      />
    </>
  );
}

export default EmailContentEditor;
