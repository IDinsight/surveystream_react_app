import { Button, Modal, message } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import {
  DescriptionText,
  DescriptionTitle,
} from "../../SurveyInformation.styled";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { RootState } from "../../../../redux/store";
import {
  getSupervisorRoles,
  postSupervisorRoles,
} from "../../../../redux/userRoles/userRolesActions";
import { useEffect, useState } from "react";
import FullScreenLoader from "../../../../components/Loaders/FullScreenLoader";
import { BodyWrapper, RolesTable } from "../SurveyUserRoles.styled";
import { ExclamationCircleFilled, FileAddOutlined } from "@ant-design/icons";
import {
  BackArrow,
  BackLink,
  NavWrapper,
  Title,
} from "../../../../shared/Nav.styled";
import {
  FooterWrapper,
  SaveButton,
  ContinueButton,
} from "../../../../shared/FooterBar.styled";
import SideMenu from "../SideMenu";
import Header from "../../../../components/Header";
import { setRolePermissions } from "../../../../redux/userRoles/userRolesSlice";
import { GlobalStyle } from "../../../../shared/Global.styled";

interface OriginalRolesData {
  reporting_role_uid: number | null;
  role_name: string;
  role_uid: number;
  survey_uid: number;
  permissions: any;
}

interface TransformedRolesData {
  role_uid: number | null;
  role: string;
  reporting_role: string | null;
  users_assigned: string | null;
}

function ManageSurveyRoles() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { survey_uid } = useParams<{ survey_uid?: string }>() ?? {
    survey_uid: "",
  };
  const isLoading = useAppSelector(
    (state: RootState) => state.userRoles.loading
  );
  const supervisorRoles = useAppSelector(
    (state: RootState) => state.userRoles.supervisorRoles
  );

  const [rolesTableData, setRolesTableData] = useState<any>([]);

  const [isOpenDeleteModel, setIsOpenDeleteModel] = useState<boolean>(false);

  const [paginationPageSize, setPaginationPageSize] = useState<number>(15);

  const [deleteRoleId, setDeleteRoleId] = useState<number>();

  const activeSurvey = useAppSelector(
    (state: RootState) => state.surveys.activeSurvey
  );

  const handleGoBack = () => {
    navigate(-1);
  };

  const fetchSupervisorRoles = async () => {
    const res = await dispatch(getSupervisorRoles({ survey_uid: survey_uid }));

    if (res.payload.length > 0) {
      const originalRolesData: OriginalRolesData = res.payload;

      const findItemByRoleUid = (roleUid: number): string | null => {
        if (Array.isArray(originalRolesData)) {
          const foundItem = originalRolesData.find(
            (item: { role_uid: number }) => item.role_uid === roleUid
          );

          if (foundItem) {
            return foundItem.role_name;
          }
        }
        return "N/A";
      };

      const transformedData: TransformedRolesData[] = (
        Array.isArray(originalRolesData)
          ? originalRolesData
          : [originalRolesData]
      ).map((item: any) => ({
        role_uid: item.role_uid,
        role: item.role_name,
        reporting_role: findItemByRoleUid(item.reporting_role_uid),
        users_assigned: item.user_count ?? "N/A",
      }));

      setRolesTableData(transformedData);
    } else {
      setRolesTableData([]);
    }
  };

  const handleDuplicate = (role_uid: any): void => {
    const filteredRole = supervisorRoles.find(
      (role) => role.role_uid == role_uid
    );

    dispatch(
      setRolePermissions({
        survey_uid: survey_uid ?? null,
        permissions: filteredRole?.permissions ?? [],
        role_uid: role_uid,
      })
    );
    navigate(
      `/survey-information/survey-roles/duplicate/${survey_uid}/${role_uid}`
    );
  };

  const handleEdit = (role_uid: any): void => {
    const filteredRole = supervisorRoles.find(
      (role) => role.role_uid == role_uid
    );

    dispatch(
      setRolePermissions({
        survey_uid: survey_uid ?? null,
        permissions: filteredRole?.permissions ?? [],
        role_uid: role_uid,
        duplicate: false,
      })
    );
    navigate(`/survey-information/survey-roles/edit/${survey_uid}/${role_uid}`);
  };

  const handleAddNewRole = () => {
    dispatch(
      setRolePermissions({
        survey_uid: survey_uid ?? null,
        permissions: [],
        role_uid: null,
      })
    );
    navigate(`/survey-information/survey-roles/add/${survey_uid}`);
  };

  const handleDelete = (role_uid: any): void => {
    setDeleteRoleId(role_uid);
    setIsOpenDeleteModel(true);
  };

  const handleDeleteRole = async () => {
    //to delete roles update roles for the survey without the deleted role
    //this is to ensure hierarchy validations on the backend
    const userRoles = supervisorRoles;

    let filteredRoles = [
      ...supervisorRoles.filter(
        (role) => role.role_uid != deleteRoleId?.toString()
      ),
    ];

    filteredRoles = filteredRoles.filter(
      (role) => role.role_name !== "Survey Admin"
    );

    const rolesRes = await dispatch(
      postSupervisorRoles({
        supervisorRolesData: filteredRoles,
        surveyUid: survey_uid ?? "",
      })
    );

    if (rolesRes.payload.status === false) {
      message.error(rolesRes.payload.message);
      return;
    } else {
      await fetchSupervisorRoles();
      message.success("Roles deleted successfully");
    }

    setDeleteRoleId(undefined);
    setIsOpenDeleteModel(false);
  };

  useEffect(() => {
    fetchSupervisorRoles();
  }, []);

  const rolesTableColumn = [
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Reporting Role",
      dataIndex: "reporting_role",
      key: "reporting_role",
    },
    {
      title: "Users assigned",
      dataIndex: "users_assigned",
      key: "users_assigned",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: (text: any, record: any) => (
        <span>
          <Button
            disabled={!record?.role_uid}
            type="link"
            onClick={() => handleEdit(record?.role_uid)}
          >
            Edit
          </Button>
          <Button
            disabled={!record?.role_uid}
            type="link"
            onClick={() => handleDuplicate(record?.role_uid)}
          >
            Duplicate
          </Button>

          <Button
            disabled={!record?.role_uid}
            danger
            type="text"
            onClick={() => handleDelete(record?.role_uid)}
            style={{ marginLeft: 8 }}
          >
            Delete
          </Button>
        </span>
      ),
    },
  ];

  return (
    <>
      <GlobalStyle />
      <Header />
      <NavWrapper>
        <BackLink onClick={handleGoBack}>
          <BackArrow />
        </BackLink>
        <Title>
          {(() => {
            const activeSurveyData = localStorage.getItem("activeSurvey");
            return (
              activeSurvey?.survey_name ||
              (activeSurveyData && JSON.parse(activeSurveyData).survey_name) ||
              ""
            );
          })()}
        </Title>
      </NavWrapper>
      {isLoading ? (
        <FullScreenLoader />
      ) : (
        <>
          <div style={{ display: "flex" }}>
            <SideMenu />
            <BodyWrapper>
              <DescriptionTitle>Roles</DescriptionTitle>
              <DescriptionText style={{ marginRight: "auto" }}>
                Manage the roles related to your survey here
              </DescriptionText>
              <div style={{ float: "right", marginTop: "-60px" }}>
                <Button
                  type="primary"
                  icon={<FileAddOutlined />}
                  style={{
                    marginLeft: "25px",
                    backgroundColor: "#2F54EB",
                  }}
                  onClick={() => handleAddNewRole()}
                >
                  Add new role{" "}
                </Button>
              </div>
              <div style={{ display: "flex" }}></div>
              <RolesTable
                columns={rolesTableColumn}
                dataSource={rolesTableData}
                pagination={{
                  pageSize: paginationPageSize,
                  pageSizeOptions: [10, 25, 50, 100],
                  showSizeChanger: true,
                  showQuickJumper: true,
                  onShowSizeChange: (_, size) => setPaginationPageSize(size),
                }}
              />
            </BodyWrapper>

            <Modal
              open={isOpenDeleteModel}
              title={
                <div style={{ display: "flex" }}>
                  <ExclamationCircleFilled
                    style={{ color: "orange", fontSize: 20 }}
                  />
                  <p style={{ marginLeft: "10px" }}>Delete the role</p>
                </div>
              }
              okText="Yes, delete role"
              onOk={() => handleDeleteRole()}
              onCancel={() => setIsOpenDeleteModel(false)}
            >
              <p>Are you sure you want to delete this role?</p>
            </Modal>
          </div>

          <FooterWrapper>
            <SaveButton disabled>Save</SaveButton>
            <ContinueButton
              onClick={() => {
                navigate(
                  `/survey-information/survey-users/users/${survey_uid}`
                );
              }}
            >
              Finalize roles
            </ContinueButton>
          </FooterWrapper>
        </>
      )}
    </>
  );
}

export default ManageSurveyRoles;
