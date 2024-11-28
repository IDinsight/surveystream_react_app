import {
  Button,
  Col,
  Dropdown,
  MenuProps,
  Modal,
  Row,
  Select,
  message,
} from "antd";
import { FormItemLabel } from "../../modules/MediaAudits/MediaAudits.styled";
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { useAppDispatch } from "../../redux/hooks";
import {
  deleteMediaAuditConfig,
  getMediaAuditsConfigs,
} from "../../redux/mediaAudits/mediaAuditsActions";
import { Link, useNavigate } from "react-router-dom";
import { DeleteBtn, OutputsBtn } from "./MediaForm.styled";

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

  const addUserOptions: MenuProps["items"] = [
    ...(data.google_sheet_key
      ? [
          {
            key: "1",
            label: (
              <Link
                to={`https://docs.google.com/spreadsheets/d/${data.google_sheet_key}`}
                target="_blank"
              >
                Main Audit Google Sheet
              </Link>
            ),
          },
        ]
      : []),
    ...(data.mapping_criteria && data.mapping_google_sheet_key
      ? [
          {
            key: "2",
            label: (
              <Link
                to={`https://docs.google.com/spreadsheets/d/${data.mapping_google_sheet_key}`}
                target="_blank"
              >
                Master Mapping Google Sheet
              </Link>
            ),
          },
        ]
      : []),
    ...(!data.google_sheet_key && !data.mapping_google_sheet_key
      ? [
          {
            key: "3",
            label:
              "Output links will be available here once the google sheets are created. This can take a few minutes. If it has been more than 15 minutes, please contact the SurveyStream team.",
            disabled: true,
          },
        ]
      : []),
  ];

  return (
    <>
      <div
        style={{ backgroundColor: "#FAFAFA", padding: 24, marginBottom: 24 }}
      >
        <Row align="middle" style={{ marginBottom: 6 }}>
          <Col span={6}>
            <FormItemLabel>Form ID:</FormItemLabel>
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
          <Dropdown
            menu={{ items: addUserOptions }}
            placement="bottomLeft"
            arrow
          >
            <OutputsBtn size="small" icon={<DownOutlined />} iconPosition="end">
              Outputs
            </OutputsBtn>
          </Dropdown>
        </Row>
        {contextHolder}
      </div>
    </>
  );
}

export default MediaForm;
