import {
  Button,
  Col,
  Dropdown,
  MenuProps,
  Modal,
  Row,
  Select,
  message,
  Tooltip,
} from "antd";
import { FormItemLabel } from "../../modules/MediaAudits/MediaAudits.styled";
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  DownOutlined,
  EyeOutlined,
  LinkOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { useAppDispatch } from "../../redux/hooks";
import {
  deleteMediaAuditConfig,
  getMediaAuditsConfigs,
} from "../../redux/mediaAudits/mediaAuditsActions";
import { Link, useNavigate } from "react-router-dom";
import { DeleteBtn, OutputsBtn, IconText } from "./MediaForm.styled";

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
          <Col span={5}>
            <FormItemLabel>SurveyCTO form ID:</FormItemLabel>
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
          <Col span={5}>
            <FormItemLabel>Media type:</FormItemLabel>
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
          <Col span={5}>
            <FormItemLabel>Source:</FormItemLabel>
          </Col>
          <Col span={8}>
            <Select disabled value={data.source} style={{ width: "100%" }}>
              <Select.Option value={data.source}>{data.source}</Select.Option>
            </Select>
          </Col>
        </Row>
        <Row align="middle" style={{ marginBottom: 6 }}>
          <Col span={5}>
            <FormItemLabel>
              Outputs{" "}
              <Tooltip
                title="Link to the output Google Sheet/s will be shown here once they are
                created. This can take a few minutes. If it has been more than
                15 minutes, kindly contact the SurveyStream team."
              >
                <InfoCircleOutlined />
              </Tooltip>{" "}
              :
            </FormItemLabel>
          </Col>
          {data.google_sheet_key ? (
            <Col span={4}>
              <div
                style={{
                  marginLeft: "auto",
                  color: "#2F54EB",
                }}
              >
                <LinkOutlined style={{ fontSize: "20px" }} />
                <IconText
                  style={{
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    window.open(
                      `https://docs.google.com/spreadsheets/d/${data.google_sheet_key}`,
                      "__blank"
                    )
                  }
                >
                  Main Google Sheet output
                </IconText>
              </div>
            </Col>
          ) : null}
          {data.mapping_google_sheet_key ? (
            <Col span={10}>
              <div
                style={{
                  marginLeft: "auto",
                  color: "#2F54EB",
                }}
              >
                <LinkOutlined style={{ fontSize: "20px" }} />
                <IconText
                  style={{
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    window.open(
                      `https://docs.google.com/spreadsheets/d/${data.mapping_google_sheet_key}`,
                      "__blank"
                    )
                  }
                >
                  Master mapping Google Sheet{" "}
                  <Tooltip title="Contains links to language/location level sheets since multiple sheet creation option was selected in this configuration.">
                    <InfoCircleOutlined
                      style={{ fontSize: "15px", marginLeft: "2px" }}
                    />
                  </Tooltip>{" "}
                </IconText>
              </div>
            </Col>
          ) : null}
        </Row>

        <Row>
          <Button
            style={{ marginTop: 24 }}
            size="small"
            icon={editable ? <EditOutlined /> : <EyeOutlined />}
            onClick={editHandler}
          >
            {editable ? "Edit" : "View"}
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
