import { DownOutlined, ExclamationCircleFilled } from "@ant-design/icons";
import { Button, Dropdown, MenuProps, Modal, Space, message } from "antd";
import { useState } from "react";

function SurveyorStatus({
  status,
  onClick,
}: {
  status: string;
  onClick?: () => void;
}) {
  const [isOpenDeleteModel, setIsOpenDeleteModel] = useState<boolean>(false);

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    console.log("click", e.key);
    switch (e.key) {
      case "1":
        message.success("Record updated successfully!");
        break;
      case "2":
        message.success("Record updated successfully!");
        break;
      case "3":
        setIsOpenDeleteModel(true);
        break;
    }
  };

  const statusItems: MenuProps["items"] = [
    {
      label: "Active",
      key: "1",
    },
    {
      label: "Inactive",
      key: "2",
    },
    {
      label: "Dropout",
      key: "3",
    },
  ];

  const menuProps = {
    items: statusItems,
    onClick: handleMenuClick,
  };

  const getMenuStyle = (status: string) => {
    if (status === "active") {
      return {
        backgroundColor: "#F6FFED",
        color: "#237804",
        border: "1px solid #B7EB8F",
      };
    } else if (status === "inactive") {
      return {
        backgroundColor: "#FFF7E6",
        color: "#AD4E00",
        border: "1px solid #FFD591",
      };
    } else if (status === "dropout") {
      return {
        backgroundColor: "#FFF1F0",
        color: "#A8071A",
        border: "1px solid #FFA39E",
      };
    }
  };

  return (
    <div>
      <Dropdown menu={menuProps}>
        <Button size="small" style={getMenuStyle(status)}>
          <Space>
            {status.charAt(0).toUpperCase() + status.slice(1)}
            <DownOutlined />
          </Space>
        </Button>
      </Dropdown>
      <Modal
        open={isOpenDeleteModel}
        title={
          <div style={{ display: "flex" }}>
            <ExclamationCircleFilled
              style={{ color: "orange", fontSize: 20 }}
            />
            <p style={{ marginLeft: "10px" }}>
              You are marking a surveyor as a dropout!
            </p>
          </div>
        }
        okText="Confirm"
        okButtonProps={{ danger: true }}
        onOk={() => {
          setIsOpenDeleteModel(false);
          message.success("Record updated successfully!");
        }}
        onCancel={() => setIsOpenDeleteModel(false)}
      >
        <p>Bahadur Singh has 15 targets assigned to them.</p>
        <p>
          If you confirm to mark Bahadur Singh as dropout, all 15 of their
          assignments will be unassigned and released.
        </p>
        <p>Those 15 targets have to be assigned to other surveyors.</p>
      </Modal>
    </div>
  );
}

export default SurveyorStatus;
