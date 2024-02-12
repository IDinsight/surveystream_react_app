import { DownOutlined, ExclamationCircleFilled } from "@ant-design/icons";
import { Button, Dropdown, MenuProps, Modal, Space, message } from "antd";
import { useState } from "react";
import { updateEnumeratorStatus } from "../../redux/assignments/assignmentsActions";
import { useAppDispatch } from "../../redux/hooks";

interface ISurveyorStatusProps {
  formID: string;
  record?: any;
}

function SurveyorStatus({ record, formID }: ISurveyorStatusProps) {
  const dispatch = useAppDispatch();
  const [isOpenDeleteModel, setIsOpenDeleteModel] = useState<boolean>(false);

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    // If the status is the same as the one clicked, do nothing
    if (e.key === record["surveyor_status"]) {
      return;
    }

    switch (e.key) {
      case "Active":
      case "Temp. Inactive":
        dispatch(
          updateEnumeratorStatus({
            enumeratorUID: record["enumerator_uid"],
            enumeratorType: "surveyor",
            formUID: formID,
            newStatus: e.key,
          })
        ).then((response: any) => {
          console.log(response);
          if (
            response.payload.status === 200 &&
            response.payload.data.success
          ) {
            message.success("Record updated successfully!");
          } else {
            message.error("Failed to update record!");
          }
        });
        break;
      case "Dropout":
        setIsOpenDeleteModel(true);
        break;
    }
  };

  const onDropoutConfirm = () => {
    setIsOpenDeleteModel(false);
    dispatch(
      updateEnumeratorStatus({
        enumeratorUID: record["enumerator_uid"],
        enumeratorType: "surveyor",
        formUID: formID,
        newStatus: "Dropout",
      })
    );
    message.success("Record updated successfully!");
  };

  const statusItems: MenuProps["items"] = [
    {
      label: "Active",
      key: "Active",
    },
    {
      label: "Temp. Inactive",
      key: "Temp. Inactive",
    },
    {
      label: "Dropout",
      key: "Dropout",
    },
  ];

  const menuProps = {
    items: statusItems,
    onClick: handleMenuClick,
  };

  const getMenuStyle = (status: string) => {
    if (status === "Active") {
      return {
        backgroundColor: "#F6FFED",
        color: "#237804",
        border: "1px solid #B7EB8F",
      };
    } else if (status === "Inactive") {
      return {
        backgroundColor: "#FFF7E6",
        color: "#AD4E00",
        border: "1px solid #FFD591",
      };
    } else if (status === "Dropout") {
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
        <Button size="small" style={getMenuStyle(record["surveyor_status"])}>
          <Space>
            {record["surveyor_status"]}
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
        onOk={onDropoutConfirm}
        onCancel={() => setIsOpenDeleteModel(false)}
      >
        <p>Surveyor has targets assigned to them.</p>
        <p>
          If you confirm to mark Surveyor as dropout, all of their assignments
          will be unassigned and released.
        </p>
        <p>Those targets have to be assigned to other surveyors.</p>
      </Modal>
    </div>
  );
}

export default SurveyorStatus;
