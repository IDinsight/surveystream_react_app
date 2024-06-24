import { Button, Col, Input, Modal, Row, message } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { useAppDispatch } from "../../redux/hooks";
import { useNavigate } from "react-router-dom";
import { DeleteBtn } from "./DQFormCard.styled";
import { deleteDQForm, getDQForms } from "../../redux/dqForm/dqFormActions";
import { FormItemLabel } from "../../modules/DQForm/DQForm.styled";

interface DQFormCardProps {
  data: any;
  editable: boolean;
  surveyUID: string;
}

function DQFormCard({ data, editable, surveyUID }: DQFormCardProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [modal, contextHolder] = Modal.useModal();

  const dqFormUID = data.form_uid;

  const editHandler = () => {
    navigate(
      `/module-configuration/dq-forms/${surveyUID}/manage?dq_form_uid=${dqFormUID}`
    );
  };

  const deleteHandler = async () => {
    const deleteResp = await modal.confirm({
      title: "Deletion confirmation",
      icon: <ExclamationCircleOutlined />,
      content: "Are you sure you want to delete this DQ Form?",
      okText: "Delete",
      cancelText: "Cancel",
    });
    if (deleteResp) {
      dispatch(deleteDQForm({ formUID: dqFormUID })).then((response: any) => {
        console.log(response);
        if (response.payload.success) {
          message.success("DQ form deleted successfully.");
          dispatch(getDQForms({ survey_uid: surveyUID }));
        } else if (response.error) {
          message.error("Something went wrong!");
        }
      });
    }
  };

  return (
    <>
      <div
        style={{ backgroundColor: "#FAFAFA", padding: 24, marginBottom: 24 }}
      >
        <Row align="middle" style={{ marginBottom: 6 }}>
          <Col span={6}>
            <FormItemLabel>Main Form ID:</FormItemLabel>
          </Col>
          <Col span={8}>
            <Input disabled value={data.parent_scto_form_id} />
          </Col>
        </Row>
        <Row align="middle" style={{ marginBottom: 6 }}>
          <Col span={6}>
            <FormItemLabel>DQ form type:</FormItemLabel>
          </Col>
          <Col span={8}>
            <Input disabled value={data.dq_form_type} />
          </Col>
        </Row>
        <Row align="middle" style={{ marginBottom: 6 }}>
          <Col span={6}>
            <FormItemLabel>DQ Form ID:</FormItemLabel>
          </Col>
          <Col span={8}>
            <Input disabled value={data.scto_form_id} />
          </Col>
        </Row>
        <Row>
          <Button
            style={{ marginTop: 24 }}
            size="small"
            icon={<EditOutlined />}
            onClick={editHandler}
          >
            {editable ? "View / Edit" : "View"}
          </Button>
          <DeleteBtn
            size="small"
            icon={<DeleteOutlined />}
            disabled={!editable}
            onClick={deleteHandler}
          >
            Delete
          </DeleteBtn>
        </Row>
        {contextHolder}
      </div>
    </>
  );
}

export default DQFormCard;
