import { useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface EmailContentEditorProps {
  quillRef: any;
  form: any;
  setCursorPosition: any;
}

function EmailContentEditor({
  quillRef,
  form,
  setCursorPosition,
}: EmailContentEditorProps) {
  const [value, setValue] = useState("");

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

  useEffect(() => {
    form.setFields([
      {
        name: ["templates", 0, "content"],
        value: value,
      },
    ]);
  }, [value]);

  return (
    <>
      <ReactQuill
        ref={quillRef}
        style={{ height: "200px", marginBottom: "30px" }}
        theme="snow"
        value={value}
        onChange={(val) => setValue(val)}
        modules={modules}
        onChangeSelection={handleSelectionChange}
      />
    </>
  );
}

export default EmailContentEditor;
