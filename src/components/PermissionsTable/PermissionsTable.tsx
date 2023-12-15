import React, { useState, useEffect } from "react";
import { Checkbox, Table } from "antd";
import { StyledTable } from "./PermissionsTable.styled";

interface IPermissionsTableProps {
  permissions: any[];
  onPermissionsChange: (selectedPermissions: any[]) => void;
}

const PermissionsTable: React.FC<IPermissionsTableProps> = ({
  permissions,
  onPermissionsChange,
}) => {
  const [localPermissions, setLocalPermissions] = useState<any[]>([]);

  const columns = [
    {
      title: "Permission",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "View",
      dataIndex: "view",
      key: "view",
      render: (text: any, record: any) => (
        <Checkbox
          checked={record.view}
          onChange={(e) => handleCheckboxChange(e, record, "view")}
        ></Checkbox>
      ),
    },
    {
      title: "Edit",
      dataIndex: "edit",
      key: "edit",
      render: (text: any, record: any) => (
        <Checkbox
          checked={record.edit}
          onChange={(e) => handleCheckboxChange(e, record, "edit")}
        ></Checkbox>
      ),
    },
    {
      title: "None",
      dataIndex: "none",
      key: "none",
      render: (text: any, record: any) => (
        <Checkbox
          checked={record.none}
          onChange={(e) => handleCheckboxChange(e, record, "none")}
        ></Checkbox>
      ),
    },
  ];

  const handleCheckboxChange = (
    e: any,
    record: any,
    type: "view" | "edit" | "none"
  ) => {
    const editPermission = record.permissions.find(
      (permission: { name: string }) => permission.name.includes("WRITE")
    );

    const viewPermission = record.permissions.find(
      (permission: { name: string }) => permission.name.includes("READ")
    );

    let permissionToUpdate: any = null;

    if (type === "edit") {
      permissionToUpdate = editPermission;
    } else if (type === "view") {
      permissionToUpdate = viewPermission;
    }

    console.log("editPermission", editPermission?.permission_uid);
    console.log("viewPermission", viewPermission?.permission_uid);

    const permissionUid: any = permissionToUpdate?.permission_uid;

    console.log("type", type);
    console.log("permissionUid", permissionUid);

    setLocalPermissions((prevPermissions) =>
      prevPermissions.map((group) => {
        if (group.key === record.key) {
          const updatedGroup = { ...group };

          // Update the specific property in the group based on the type
          if (type === "none" && e.target.checked) {
            updatedGroup[type] = e.target.checked;

            updatedGroup["view"] = false;
            updatedGroup["edit"] = false;
          } else if (type === "edit" && e.target.checked) {
            updatedGroup["view"] = true;
            updatedGroup[type] = e.target.checked;
            updatedGroup["none"] = false;
          } else if (type !== "none" && e.target.checked) {
            updatedGroup["none"] = false;
            updatedGroup[type] = e.target.checked;
          } else {
            updatedGroup[type] = e.target.checked;
          }
          console.log(updatedGroup);

          return updatedGroup;
        }
        return group;
      })
    );
    if (permissionToUpdate) {
      // Update the specific permission based on the type
    } else if (type === "none") {
      // Handle "none"
    }
  };

  useEffect(() => {
    // Notify parent component when localPermissions change
    onPermissionsChange(localPermissions);
  }, [localPermissions, onPermissionsChange]);

  useEffect(() => {
    // Group permissions by a common identifier (e.g., 'Enumerators')
    const groupedData = permissions.reduce((acc, item) => {
      const groupNameParts = item.name.split(" ");
      const groupName =
        groupNameParts.length > 1
          ? groupNameParts.slice(1).join(" ")
          : item.name;

      if (groupName.toLowerCase() !== "admin") {
        if (!acc[groupName]) {
          acc[groupName] = { name: groupName, permissions: [] };
        }
        acc[groupName].permissions.push({ ...item, key: item.permission_uid });
      }

      return acc;
    }, {});

    let counter = 1;
    const transformedData = Object.values(groupedData).map((group: any) => ({
      ...group,
      key: counter++,
      edit: false,
      view: false,
    }));

    // Update local state when permissions prop changes
    setLocalPermissions(Object.values(transformedData));
  }, [permissions]);

  return (
    <div>
      <StyledTable
        columns={columns}
        dataSource={localPermissions}
        pagination={false}
      />
    </div>
  );
};

export default PermissionsTable;
