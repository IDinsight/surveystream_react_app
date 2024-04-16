import React, { useState, useRef } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Divider, Input, Select, Space, Button } from "antd";
import type { InputRef } from "antd";

interface ISelectGroupProps {
  label: string;
  groups: string[];
  setGroup: React.Dispatch<React.SetStateAction<string[]>>;
  onSelectChange: (value: string) => void;
}

function SelectGroup({
  label,
  groups,
  setGroup,
  onSelectChange,
}: ISelectGroupProps) {
  const [newName, setNewName] = useState("");
  const inputRef = useRef<InputRef>(null);

  const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewName(event.target.value);
  };

  const addItem = (
    e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>
  ) => {
    if (!newName) return;

    e.preventDefault();
    setGroup([...groups, newName]);

    // Reset the input field
    setNewName("");
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  return (
    <Select
      style={{ width: 250 }}
      value={label}
      dropdownRender={(menu) => (
        <>
          {menu}
          <Divider style={{ margin: "8px 0" }} />
          <Input
            placeholder="Please enter item"
            ref={inputRef}
            value={newName}
            onChange={onNameChange}
            onKeyDown={(e) => e.stopPropagation()}
          />
          <Button
            type="primary"
            size="small"
            icon={<PlusOutlined />}
            onClick={addItem}
            style={{ width: "100%", marginTop: 10, marginBottom: 4 }}
          >
            Add item
          </Button>
        </>
      )}
      options={groups.map((item) => ({ label: item, value: item }))}
      onChange={onSelectChange}
    />
  );
}

export default SelectGroup;
