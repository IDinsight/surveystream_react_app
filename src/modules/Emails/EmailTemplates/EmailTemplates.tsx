import { useState } from "react";
import { Button, Drawer, Popconfirm, Tooltip, message } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import NotebooksImg from "../../../assets/notebooks.svg";
import { useAppDispatch } from "../../../redux/hooks";
import { deleteEmailTemplate } from "../../../redux/emails/emailsActions";
import EmailTemplateEditForm from "./EmailTemplateEditForm";
import { EmailTemplatesTable } from "./EmailTemplates.styled";

function EmailTemplates({
  data,
  surveyEnumerators,
  emailConfigData,
  fetchEmailTemplates,
}: any) {
  const [paginationPageSize, setPaginationPageSize] = useState<number>(25);
  const [isEditTemplateDrawerVisible, setIsEditTemplateDrawerVisible] =
    useState(false);
  const [editTemplateValues, setEditTemplateValues] = useState();
  const dispatch = useAppDispatch();

  const showEditTemplateDrawer = () => {
    setIsEditTemplateDrawerVisible(true);
  };

  const closeEditTemplateDrawer = () => {
    setIsEditTemplateDrawerVisible(false);
  };

  const handleDeleteTemplate = async (template: any) => {
    try {
      const result = await dispatch(
        deleteEmailTemplate({
          id: template.email_template_uid,
          email_config_uid: template.email_config_uid,
        })
      );

      if (result.payload?.data?.success) {
        message.success("Email template deleted successfully");
        fetchEmailTemplates();
      } else {
        message.error("Failed to delete email template, try again.");
      }
    } catch (error) {
      message.error(
        "An error occurred while deleting email template, try again."
      );
    }
  };

  const handleEditTemplate = (template: any) => {
    setEditTemplateValues(template);
    showEditTemplateDrawer();
  };
  const templateColumns = [
    {
      title: "Config Type",
      dataIndex: "config_type",
      key: "config_type",
      sorter: (a: any, b: any) => a.config_type.localeCompare(b.config_type),
    },
    {
      title: "Email Templates",
      key: "templates",
      render: (record: {
        templates: {
          content: string;
          language: string;
          subject: string;
        }[];
      }) => (
        <div>
          {record.templates.length > 0 ? (
            record.templates.map((template, index) => {
              const { content, language, subject } = template;
              return (
                <div
                  className="custom-card"
                  style={{
                    display: "flex",
                    marginBottom: "10px",
                    flexDirection: "row",
                  }}
                  key={index}
                >
                  <div style={{ marginRight: "10px", width: "30%" }}>
                    <p>Language: {language}</p>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      maxHeight: "180px",
                      overflowY: "auto",
                    }}
                  >
                    <div style={{ marginRight: "10px" }}>
                      <p>Subject: {subject}</p>

                      <p>Content </p>
                      <p>{content}</p>
                    </div>
                  </div>
                  <div
                    style={{
                      marginTop: "10px",
                      float: "right",
                    }}
                  >
                    <Tooltip title="Edit">
                      <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => handleEditTemplate(template)}
                        style={{ marginBottom: 8 }}
                      >
                        Edit
                      </Button>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <Popconfirm
                        title="Are you sure you want to delete this template?"
                        onConfirm={() => handleDeleteTemplate(template)}
                        okText="Yes"
                        cancelText="No"
                      >
                        <Button type="link" icon={<DeleteOutlined />} danger>
                          Delete
                        </Button>
                      </Popconfirm>
                    </Tooltip>
                  </div>
                </div>
              );
            })
          ) : (
            <p>No templates available</p>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      {data.length > 0 ? (
        <EmailTemplatesTable
          dataSource={data}
          columns={templateColumns}
          pagination={{
            pageSize: paginationPageSize,
            pageSizeOptions: [10, 25, 50, 100],
            showSizeChanger: true,
            showQuickJumper: true,
            onShowSizeChange: (_, size) => setPaginationPageSize(size),
          }}
          rowKey={(record) => record.config_type}
        />
      ) : (
        <div
          style={{
            paddingTop: "20px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <div>
            <img src={NotebooksImg} height={220} width={225} alt="Empty data" />
            <p
              style={{
                color: "#8C8C8C",
                fontFamily: "Lato",
                fontSize: "14px",
                lineHeight: "22px",
              }}
            >
              For this survey, email templates have not yet been set up.
            </p>
          </div>
        </div>
      )}

      <Drawer
        title={"Edit Email Template"}
        width={650}
        onClose={closeEditTemplateDrawer}
        open={isEditTemplateDrawerVisible}
        style={{ paddingBottom: 80, fontFamily: "Lato" }}
      >
        <EmailTemplateEditForm
          closeAddManualDrawer={closeEditTemplateDrawer}
          surveyEnumerators={surveyEnumerators}
          initialValues={editTemplateValues}
          fetchEmailTemplates={fetchEmailTemplates}
          emailConfigData={emailConfigData}
          isEditMode={true}
        />
      </Drawer>
    </>
  );
}

export default EmailTemplates;
