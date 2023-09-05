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
import { TargetsManageFormWrapper, TargetsTable } from "./TargetsManage.styled";
import {
  CloudDownloadOutlined,
  CloudUploadOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import RowEditingModal from "./RowEditingModal";
import TargetsCountBox from "../../../components/TargetsCountBox";
import { getEnumerators } from "../../../redux/enumerators/enumeratorsActions";
import { setLoading } from "../../../redux/enumerators/enumeratorsSlice";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { RootState } from "../../../redux/store";
import { getSurveyCTOForm } from "../../../redux/surveyCTOInformation/surveyCTOInformationActions";
import { getTargets } from "../../../redux/targets/targetActions";
import FullScreenLoader from "../../../components/Loaders/FullScreenLoader";

function TargetsManage() {
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

  const isLoading = useAppSelector((state: RootState) => state.targets.loading);
  const activeSurvey = useAppSelector(
    (state: RootState) => state.surveys.activeSurvey
  );
  const targetList = useAppSelector(
    (state: RootState) => state.targets.targetsList
  );

  const [targetsCount, setTargetsCount] = useState<number>(0);

  const [editMode, setEditMode] = useState<boolean>(false);
  const [editData, setEditData] = useState<boolean>(false);
  const [fieldData, setFieldData] = useState<any>([]);
  const [paginationPageSize, setPaginationPageSize] = useState<number>(10);
  const [dataTableColumn, setDataTableColumn] = useState<any>([]);
  const [tableDataSource, setTableDataSource] = useState<any>([]);

  // Row selection state and handler
  const [selectedRows, setSelectedRows] = useState<any>([]);

  const onSelectChange = (selectedRowKeys: React.Key[], selectedRows: any) => {
    const selectedTargetIds = selectedRows.map((row: any) => row.target_id);

    const selectedTargetData = targetList.filter((row: any) =>
      selectedTargetIds.includes(row.target_id)
    );

    setSelectedRows(selectedTargetData);
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

  const onEditingUpdate = async () => {
    if (form_uid) {
      await getTargetsList(form_uid);
    }
    setEditData(false);
  };

  const moveToUpload = () => {
    navigate(`/survey-information/targets/upload/${survey_uid}/${form_uid}`);
  };

  const handleFormUID = async () => {
    if (form_uid == "" || form_uid == undefined) {
      try {
        dispatch(setLoading(true));
        const sctoForm = await dispatch(
          getSurveyCTOForm({ survey_uid: survey_uid })
        );
        if (sctoForm?.payload[0]?.form_uid) {
          navigate(
            `/survey-information/targets/manage/${survey_uid}/${sctoForm?.payload[0]?.form_uid}`
          );
        } else {
          message.error("Kindly configure SCTO Form to proceed");
          navigate(`/survey-information/survey-cto-information/${survey_uid}`);
        }
        dispatch(setLoading(false));
      } catch (error) {
        dispatch(setLoading(false));
        console.log("Error fetching sctoForm:", error);
      }
    }
  };
  const getTargetsList = async (form_uid: string) => {
    const targetRes = await dispatch(getTargets({ formUID: form_uid }));
    if (targetRes.payload.status == 200) {
      message.success("Targets loaded successfully.");
      //create rowbox data
      const originalData = targetRes.payload.data.data;
      setTargetsCount(originalData.length);

      const columnsToExclude = ["target_uid"];

      // Define column mappings
      const columnMappings = Object.keys(originalData[0])
        .filter((column) => !columnsToExclude.includes(column))
        .filter((column) =>
          originalData.some(
            (row: { [x: string]: null }) => row[column] !== null
          )
        ) // Filter out columns with all null values
        .map((column) => ({
          title: column,
          dataIndex: column,
        }));

      setDataTableColumn(columnMappings);

      const tableDataSource = originalData.map((item: any, index: any) => {
        const rowData: Record<string, any> = {}; // Use index signature

        for (const mapping of columnMappings) {
          const { title, dataIndex } = mapping;
          rowData[dataIndex] = item[dataIndex];
        }

        return {
          key: index,
          ...rowData,
        };
      });

      setTableDataSource(tableDataSource);
    } else {
      message.error("Targets failed to load, kindly reload to try again.");
    }
  };

  useEffect(() => {
    //redirect to upload if missing csvHeaders and cannot perform mapping
    //TODO: update this for configured surveys already
    handleFormUID();
    if (form_uid) {
      getTargetsList(form_uid);
    }
  }, []);

  return (
    <>
      <Header />
      <NavWrapper>
        <BackLink onClick={handleGoBack}>
          <BackArrow />
        </BackLink>
        <Title> {activeSurvey?.survey_name} </Title>
      </NavWrapper>
      {isLoading ? (
        <FullScreenLoader />
      ) : (
        <div style={{ display: "flex" }}>
          <SideMenu />
          <TargetsManageFormWrapper>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Title>Targets</Title>
              <div
                style={{
                  display: "flex",
                  marginLeft: "auto",
                  color: "#2F54EB",
                }}
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
                  onClick={moveToUpload}
                  type="primary"
                  icon={<CloudUploadOutlined />}
                  style={{ marginRight: 80, backgroundColor: "#2f54eB" }}
                >
                  Upload new targets
                </Button>
              </div>
            </div>
            <br />
            <div style={{ display: "flex" }}>
              <TargetsCountBox total={targetsCount} />
              <div style={{ marginLeft: "auto", marginRight: 80 }}>
                <Button
                  type="primary"
                  icon={<CloudDownloadOutlined />}
                  style={{ backgroundColor: "#2f54eB" }}
                >
                  Download targets
                </Button>
              </div>
            </div>
            <TargetsTable
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
          </TargetsManageFormWrapper>
        </div>
      )}
    </>
  );
}

export default TargetsManage;
