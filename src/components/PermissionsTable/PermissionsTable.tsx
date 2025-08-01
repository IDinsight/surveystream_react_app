import React, { useState, useEffect } from "react";
import { Checkbox, Table } from "antd";
import { StyledTable, CommonTable } from "./PermissionsTable.styled";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { RootState } from "../../redux/store";
import { RolePermissions } from "../../redux/userRoles/types";
import { setRolePermissions } from "../../redux/userRoles/userRolesSlice";
import { GlobalStyle } from "../../shared/Global.styled";

interface IPermissionsTableProps {
  permissions: any[];
  onPermissionsChange: (selectedPermissions: any[]) => void;
}

const PermissionsTable: React.FC<IPermissionsTableProps> = ({
  permissions,
  onPermissionsChange,
}) => {
  const dispatch = useAppDispatch();

  const [localPermissions, setLocalPermissions] = useState<any[]>([]);

  const { survey_uid } = useParams<{ survey_uid?: string }>() ?? {
    survey_uid: null,
  };
  const { role_uid } = useParams<{ role_uid?: string }>() ?? { role_uid: null };

  const rolePermissions = useAppSelector(
    (state: RootState) => state.userRoles.rolePermissions
  );
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

  const handleCheckboxChange = async (
    e: any,
    record: any,
    type: "view" | "edit" | "none"
  ) => {
    const updatedPermissions = localPermissions.map((group) => {
      if (group.key === record.key) {
        const updatedGroup = { ...group };

        // Update the specific property in the group based on the type
        if (type === "none" && e.target.checked) {
          // If none is checked, uncheck view and edit
          updatedGroup[type] = e.target.checked;
          updatedGroup["view"] = false;
          updatedGroup["edit"] = false;
        } else if (type === "edit" && e.target.checked) {
          // If edit is checked, check view and uncheck none
          updatedGroup["view"] = true;
          updatedGroup[type] = e.target.checked;
          updatedGroup["none"] = false;
        } else if (type !== "none" && e.target.checked) {
          // If view or edit is checked, uncheck none
          updatedGroup["none"] = false;
          updatedGroup[type] = e.target.checked;
        } else if (type === "view" && !e.target.checked) {
          // If view is unchecked, uncheck edit as well
          updatedGroup[type] = e.target.checked;
          updatedGroup["edit"] = false;
        } else {
          updatedGroup[type] = e.target.checked;
        }

        return updatedGroup;
      }
      return group;
    });

    setLocalPermissions(updatedPermissions);
    const extractedPermissions = extractRolePermissions(updatedPermissions);
    const rolePermissionsData: RolePermissions = {
      role_uid: role_uid ?? null,
      survey_uid: survey_uid ?? null,
      permissions: extractedPermissions,
    };

    onPermissionsChange(extractedPermissions);

    const setRolesRes = await dispatch(setRolePermissions(rolePermissionsData));
  };

  const extractRolePermissions = (localPermissions: any) => {
    const extractedPermissions: any[] = [];

    localPermissions.forEach((permission: any) => {
      const permissionsArray = permission.permissions
        .filter((p: any) => {
          if (permission.view === true && p.name.includes("READ")) {
            return true;
          } else if (permission.edit === true && p.name.includes("WRITE")) {
            return true;
          }
          return false;
        })
        .map((p: any) => p.permission_uid);

      extractedPermissions.push(permissionsArray);
    });

    return extractedPermissions.flat();
  };

  const renderPermissionData = () => {
    if (!Array.isArray(permissions)) {
      // Handle the case where permissions is not an array
      console.error("Invalid permissions data:", permissions);
      return;
    }

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

    // Get the keys of the rolePermissions.permissions array
    const rolePermissionsKeys = rolePermissions.permissions.map(
      (permission: any) => permission
    );

    // Transform the data and update local state
    const transformedData = Object.values(groupedData).map((group: any) => {
      const permissionsKeys = group.permissions.map(
        (permission: { permission_uid: any }) => permission.permission_uid
      );

      const hasViewPermission = permissionsKeys.some(
        (key: any) =>
          rolePermissionsKeys.includes(key) &&
          group.permissions.some(
            (p: any) => p.name.includes("READ") && p.permission_uid == key
          )
      );

      const hasEditPermission = permissionsKeys.some(
        (key: any) =>
          rolePermissionsKeys.includes(key) &&
          group.permissions.some(
            (p: any) => p.name.includes("WRITE") && p.permission_uid == key
          )
      );

      return {
        ...group,
        key: counter++,
        edit: hasEditPermission,
        view: hasViewPermission,
        none:
          rolePermissionsKeys.length > 0 &&
          !hasViewPermission &&
          !hasEditPermission,
      };
    });
    // Update local state when permissions prop changes
    setLocalPermissions(Object.values(transformedData));
  };

  useEffect(() => {
    renderPermissionData();
  }, [dispatch, permissions]);

  return (
    <>
      <GlobalStyle />
      <CommonTable
        columns={columns}
        dataSource={localPermissions}
        pagination={false}
        bordered={true}
      />
    </>
  );
};

export default PermissionsTable;
