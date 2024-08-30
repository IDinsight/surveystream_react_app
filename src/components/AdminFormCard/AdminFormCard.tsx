import { Button, Col, Input, Modal, Row, message } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { useAppDispatch } from "../../redux/hooks";
import { useNavigate } from "react-router-dom";
import { DeleteBtn } from "./AdminFormCard.styled";
import {
  deleteAdminForm,
  getAdminForms,
} from "../../redux/adminForm/adminFormActions";
import { FormItemLabel } from "../../modules/AdminForm/AdminForm.styled";

interface AdminFormCardProps {
  data: any;
  editable: boolean;
  surveyUID: string;
}

function AdminFormCard({ data, editable, surveyUID }: AdminFormCardProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [modal, contextHolder] = Modal.useModal();

  const adminFormUID = data.form_uid;

  const editHandler = () => {
    navigate(
      `/module-configuration/admin-forms/${surveyUID}/manage?admin_form_uid=${adminFormUID}`
    );
  };

  const deleteHandler = async () => {
    const deleteResp = await modal.confirm({
      title: "Deletion confirmation",
      icon: <ExclamationCircleOutlined />,
      content: "Are you sure you want to delete this admin form?",
      okText: "Delete",
      cancelText: "Cancel",
    });
    if (deleteResp) {
      dispatch(deleteAdminForm({ formUID: adminFormUID })).then(
        (response: any) => {
          console.log(response);
          if (response.payload.success) {
            message.success("Admin form deleted successfully.");
            dispatch(getAdminForms({ survey_uid: surveyUID }));
          } else if (response.error) {
            message.error("Something went wrong!");
          }
        }
      );
    }
  };

  return (
    <>
      <div
        style={{ backgroundColor: "#FAFAFA", padding: 24, marginBottom: 24 }}
      >
        <Row align="middle" style={{ marginBottom: 6 }}>
          <Col span={6}>
            <FormItemLabel>Admin form type:</FormItemLabel>
          </Col>
          <Col span={8}>
            <Input
              disabled
              value={
                data.admin_form_type === "bikelog"
                  ? "Bikelog"
                  : data.admin_form_type === "account_details"
                  ? "Account details"
                  : data.admin_form_type
              }
            />
          </Col>
        </Row>
        <Row align="middle" style={{ marginBottom: 6 }}>
          <Col span={6}>
            <FormItemLabel>Admin form ID:</FormItemLabel>
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

export default AdminFormCard;
