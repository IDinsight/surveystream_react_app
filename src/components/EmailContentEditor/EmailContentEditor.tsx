import { useEffect, useCallback, useState } from "react";
import ReactQuill from "react-quill";
import { debounce } from "lodash";
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

  // Debounced function to set the form field value
  const debouncedSetFieldsValue = useCallback(
    debounce((pathArr, val) => {
      form.setFieldsValue({
        [pathArr.join(".")]: val,
      });
    }, 750),
    []
  );

  // Setting the field value on content change in editor
  useEffect(() => {
    const pathArr = standalone
      ? ["content"]
      : ["templates", formIndex, "content"];

    const currentValue = form.getFieldValue(pathArr);
    if (currentValue !== val) {
      debouncedSetFieldsValue(pathArr, val);
    }
  }, [val, form, formIndex, standalone, debouncedSetFieldsValue]);

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
