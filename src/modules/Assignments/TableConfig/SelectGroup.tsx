import React, { useState, useRef } from "react";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { Divider, Input, Select, Space, Button } from "antd";
import type { InputRef } from "antd";

interface ISelectGroupProps {
  label: string;
  groups: string[];
  setGroup: React.Dispatch<React.SetStateAction<string[]>>;
  onSelectChange: (value: string | null) => void;
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
      style={{ width: 250, fontFamily: `"Lato", sans-serif` }}
      value={label}
      placeholder="Select a group"
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
            style={{ fontFamily: `"Lato", sans-serif` }}
          />
          <Button
            size="small"
            icon={<PlusOutlined />}
            onClick={addItem}
            style={{
              width: "100%",
              marginTop: 10,
              marginBottom: 4,
              fontFamily: `"Lato", sans-serif`,
              backgroundColor: "#597ef7",
              color: "white",
            }}
          >
            Add item
          </Button>
          {label ? (
            <Button
              danger
              size="small"
              icon={<MinusOutlined />}
              onClick={() => onSelectChange(null)}
              style={{
                width: "100%",
                marginTop: 6,
                marginBottom: 4,
                fontFamily: `"Lato", sans-serif`,
              }}
            >
              Remove group
            </Button>
          ) : null}
        </>
      )}
      options={groups.map((item) => ({ label: item, value: item }))}
      onChange={onSelectChange}
    />
  );
}

export default SelectGroup;
