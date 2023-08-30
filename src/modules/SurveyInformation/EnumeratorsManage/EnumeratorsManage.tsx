import { useNavigate, useParams } from "react-router-dom";
import { Button, message } from "antd";
import Header from "../../../components/Header";
import {
  BackArrow,
  BackLink,
  NavWrapper,
  Title,
} from "../../../shared/Nav.styled";
import SideMenu from "../SideMenu";
import {
  EnumeratorsManageFormWrapper,
  EnumeratorsTable,
} from "./EnumeratorsManage.styled";
import { CloudUploadOutlined, EditOutlined } from "@ant-design/icons";
import EnumeratorsCountBox from "../../../components/EnumeratorsCountBox";
import { useEffect, useState } from "react";
import RowEditingModal from "./RowEditingModal";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { RootState } from "../../../redux/store";
import { setLoading } from "../../../redux/enumerators/enumeratorsSlice";
import { getSurveyCTOForm } from "../../../redux/surveyCTOInformation/surveyCTOInformationActions";

function EnumeratorsManage() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const { survey_uid } = useParams<{ survey_uid: string }>() ?? {
    survey_uid: "",
  };
  const { form_uid } = useParams<{ form_uid: string }>() ?? {
    form_uid: "",
  };

  const dispatch = useAppDispatch();

  const isLoading = useAppSelector(
    (state: RootState) => state.enumerators.loading
  );

  const [editMode, setEditMode] = useState<boolean>(false);
  const [editData, setEditData] = useState<boolean>(false);
  const [fieldData, setFieldData] = useState<any>([]);
  const [paginationPageSize, setPaginationPageSize] = useState<number>(10);

  // Mock data for table, generate it via database
  const dataTableColumn = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Phone no. (primary)",
      dataIndex: "phoneno",
    },
    {
      title: "Language",
      dataIndex: "language",
    },
    {
      title: "Address",
      dataIndex: "address",
    },
  ];

  const tableDataSource: any = [];
  for (let i = 0; i < 46; i++) {
    tableDataSource.push({
      key: i,
      name: `Rakesh Kumar`,
      email: "rakesh@gmail.com",
      phoneno: "7837283728",
      language: "Hindi",
      address: "23, 2nd Block, Katihar",
    });
  }

  // Row selection state and handler
  const [selectedRows, setSelectedRows] = useState<any>([]);
  const onSelectChange = (_: any, newSelectedRow: any) => {
    setSelectedRows(newSelectedRow);
  };

  const rowSelection = {
    selectedRows,
    onChange: onSelectChange,
  };
  const hasSelected = selectedRows.length > 0;

  // Handler for Edit Data button
  const onEditDataHandler = () => {
    if (!hasSelected) {
      message.error("No row selected for editing");
      return;
    }
    setEditData(true);

    // Setting the fields to show on Modal
    const fields = Object.keys({ ...selectedRows[0] })
      .filter((field) => field !== "key")
      .map((field) => {
        return {
          labelKey: field,
          label: dataTableColumn.find((col: any) => col.dataIndex === field)
            ?.title,
        };
      });
    setFieldData(fields);
  };

  const onEditingCancel = () => {
    setEditData(false);
  };

  const onEditingUpdate = () => {
    // Write logic to update the records
    setEditData(false);
  };

  useEffect(() => {
    //redirect to upload if missing csvHeaders and cannot perform mapping
    //TODO: update this for configured surveys already

    const handleFormUID = async () => {
      if (form_uid == "" || form_uid == undefined) {
        try {
          dispatch(setLoading(true));
          const sctoForm = await dispatch(
            getSurveyCTOForm({ survey_uid: survey_uid })
          );
          if (sctoForm?.payload[0]?.form_uid) {
            navigate(
              `/survey-information/enumerators/manage/${survey_uid}/${sctoForm?.payload[0]?.form_uid}`
            );
          } else {
            message.error("Kindly configure SCTO Form to proceed");
            navigate(
              `/survey-information/survey-cto-information/${survey_uid}`
            );
          }
          dispatch(setLoading(false));
        } catch (error) {
          dispatch(setLoading(false));
          console.log("Error fetching sctoForm:", error);
        }
      }
    };

    handleFormUID();
  }, []);

  return (
    <>
      <Header />
      <NavWrapper>
        <BackLink onClick={handleGoBack}>
          <BackArrow />
        </BackLink>
        <Title> TSDPS </Title>
      </NavWrapper>
      <div style={{ display: "flex" }}>
        <SideMenu />
        <EnumeratorsManageFormWrapper>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Title>Enumerators</Title>
            <div
              style={{ display: "flex", marginLeft: "auto", color: "#2F54EB" }}
            >
              {editMode ? (
                <>
                  <Button
                    icon={<EditOutlined />}
                    style={{ marginRight: 20 }}
                    onClick={onEditDataHandler}
                  >
                    Edit data
                  </Button>
                </>
              ) : null}
              <Button
                type="primary"
                icon={editMode ? null : <EditOutlined />}
                style={{ marginRight: 20, backgroundColor: "#2f54eB" }}
                onClick={() => setEditMode((prev) => !prev)}
              >
                {editMode ? "Done editing" : "Edit"}
              </Button>
              <Button
                type="primary"
                icon={<CloudUploadOutlined />}
                style={{ marginRight: 80, backgroundColor: "#2f54eB" }}
              >
                Add new enumerators
              </Button>
            </div>
          </div>
          <br />
          <EnumeratorsCountBox />
          <EnumeratorsTable
            rowSelection={editMode ? rowSelection : undefined}
            columns={dataTableColumn}
            dataSource={tableDataSource}
            style={{ marginRight: 80, marginTop: 30 }}
            pagination={{
              pageSize: paginationPageSize,
              pageSizeOptions: [10, 25, 50, 100],
              showSizeChanger: true,
              showQuickJumper: true,
              onShowSizeChange: (_, size) => setPaginationPageSize(size),
            }}
          />
          {editData ? (
            <RowEditingModal
              data={selectedRows}
              fields={fieldData}
              onCancel={onEditingCancel}
              onUpdate={onEditingUpdate}
            />
          ) : null}
        </EnumeratorsManageFormWrapper>
      </div>
    </>
  );
}

export default EnumeratorsManage;
