import { useState } from "react";

import NotebooksImg from "../../../assets/notebooks.svg";
import { EmailTemplatesTable } from "./EmailTemplates.styled";
import { Button, Drawer, message, Popconfirm, Tooltip } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useAppDispatch } from "../../../redux/hooks";
import { deleteEmailTemplate } from "../../../redux/emails/emailsActions";
import EmailTemplateEditing from "./EmailTemplateEditing";

interface EmailTemplatesProps {
  templatesData: any;
  fetchEmailTemplates: () => void;
}

const EmailTemplates = ({
  templatesData,
  fetchEmailTemplates,
}: EmailTemplatesProps) => {
  const dispatch = useAppDispatch();
  const [paginationPageSize, setPaginationPageSize] = useState<number>(25);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [editTemplateValues, setEditTemplateValues] = useState();

  const handleEditTemplate = (template: any) => {
    setEditTemplateValues(template);
    setIsDrawerOpen(true);
  };

  const handleDeleteTemplate = async (template: any) => {
    try {
      const result = await dispatch(
        deleteEmailTemplate({
          email_template_uid: template.email_template_uid,
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

  const templateColumns = [
    {
      title: "Config Name",
      dataIndex: "config_name",
      key: "config_name",
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
                    </div>
                  </div>
                  <div
                    style={{
                      marginTop: "10px",
                      marginLeft: "auto",
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
          <Drawer
            title={"Edit Email Template"}
            width={700}
            open={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
            style={{ paddingBottom: 80, fontFamily: "Lato" }}
          >
            <EmailTemplateEditing
              emailTemplateConfig={editTemplateValues}
              templatesData={templatesData}
              setIsDrawerOpen={setIsDrawerOpen}
              fetchEmailTemplates={fetchEmailTemplates}
            />
          </Drawer>
        </div>
      ),
    },
  ];

  return (
    <>
      {templatesData.length > 0 ? (
        <EmailTemplatesTable
          dataSource={templatesData}
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
    </>
  );
};

export default EmailTemplates;
