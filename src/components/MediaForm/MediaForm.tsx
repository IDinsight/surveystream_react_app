import { Button, Col, Modal, Row, Select, message } from "antd";
import { FormItemLabel } from "../../modules/MediaAudits/MediaAudits.styled";
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { useAppDispatch } from "../../redux/hooks";
import {
  deleteMediaAuditConfig,
  getMediaAuditsConfigs,
} from "../../redux/mediaAudits/mediaAuditsActions";
import { useNavigate } from "react-router-dom";
import { DeleteBtn } from "./MediaForm.styled";

interface MediaFormProps {
  data: any;
  editable: boolean;
  surveyUID: string;
}

function MediaForm({ data, editable, surveyUID }: MediaFormProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [modal, contextHolder] = Modal.useModal();

  const mediaFilesConfigUID = data.media_files_config_uid;

  const editHandler = () => {
    navigate(
      `/module-configuration/media-audits/${surveyUID}/manage?media_config_uid=${mediaFilesConfigUID}`
    );
  };

  const deleteHandler = async () => {
    const deleteResp = await modal.confirm({
      title: "Deletion confirmation",
      icon: <ExclamationCircleOutlined />,
      content: "Are you sure you want to delete this media audit config?",
      okText: "Delete",
      cancelText: "Cancel",
    });
    if (deleteResp) {
      dispatch(
        deleteMediaAuditConfig({
          mediaConfigUID: mediaFilesConfigUID,
        })
      ).then((response: any) => {
        if (response.payload.success) {
          message.success("Media audit config deleted successfully.");
          dispatch(getMediaAuditsConfigs({ survey_uid: surveyUID }));
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
            <FormItemLabel>Main SCTO form:</FormItemLabel>
          </Col>
          <Col span={8}>
            <Select
              disabled
              value={data.scto_form_id}
              style={{ width: "100%" }}
            >
              <Select.Option value={data.scto_form_id}>
                {data.scto_form_id}
              </Select.Option>
            </Select>
          </Col>
        </Row>
        <Row align="middle" style={{ marginBottom: 6 }}>
          <Col span={6}>
            <FormItemLabel>Media Audit type:</FormItemLabel>
          </Col>
          <Col span={8}>
            <Select disabled value={data.file_type} style={{ width: "100%" }}>
              <Select.Option value={data.file_type}>
                {data.file_type}
              </Select.Option>
            </Select>
          </Col>
        </Row>
        <Row align="middle" style={{ marginBottom: 6 }}>
          <Col span={6}>
            <FormItemLabel>Media Audit source:</FormItemLabel>
          </Col>
          <Col span={8}>
            <Select disabled value={data.source} style={{ width: "100%" }}>
              <Select.Option value={data.source}>{data.source}</Select.Option>
            </Select>
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

export default MediaForm;
