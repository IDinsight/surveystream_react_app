import { Button, Form, Modal } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { DescriptionText, DescriptionTitle } from "../SurveyInformation.styled";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { RootState } from "../../../redux/store";
import { getSupervisorRoles } from "../../../redux/userRoles/userRolesActions";
import { useEffect, useState } from "react";
import FullScreenLoader from "../../../components/Loaders/FullScreenLoader";
import { BodyWrapper, RolesTable } from "./UserRoles.styled";
import { ExclamationCircleFilled, FileAddOutlined } from "@ant-design/icons";
import {
  BackArrow,
  BackLink,
  NavWrapper,
  Title,
} from "../../../shared/Nav.styled";
import {
  FooterWrapper,
  SaveButton,
  ContinueButton,
} from "../../../shared/FooterBar.styled";
import SideMenu from "./SideMenu";
import Header from "../../../components/Header";

interface OriginalRolesData {
  reporting_role_uid: number | null;
  role_name: string;
  role_uid: number;
  survey_uid: number;
}

interface TransformedRolesData {
  role_uid: number | null;
  role: string;
  reporting_role: string | null;
  users_assigned: string | null;
}

function Roles() {
  const { survey_uid } = useParams<{ survey_uid?: string }>() ?? {
    survey_uid: "",
  };
  const [loading, setLoading] = useState(false);

  const supervisorRoles = useAppSelector(
    (state: RootState) => state.userRoles.supervisorRoles
  );
  const isLoading = useAppSelector(
    (state: RootState) => state.userRoles.loading
  );

  const [numRoleFields, setNumRoleFields] = useState(
    supervisorRoles.length !== 0 ? supervisorRoles.length : 1
  );
  const [isAllowedEdit, setIsAllowEdit] = useState<boolean>(true);

  const [rolesTableData, setRolesTableData] = useState<any>([]);

  const [paginationPageSize, setPaginationPageSize] = useState<number>(5);

  // Delete confirmation
  const [isOpenDeleteModel, setIsOpenDeleteModel] = useState<boolean>(false);

  const handleGoBack = () => {
    navigate(-1);
  };

  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const activeSurvey = useAppSelector(
    (state: RootState) => state.surveys.activeSurvey
  );

  const { path } = useParams();

  const fetchSupervisorRoles = async () => {
    const res = await dispatch(getSupervisorRoles({ survey_uid: survey_uid }));

    if (res.payload.length > 0) {
      const originalRolesData: OriginalRolesData = res.payload;
      console.log("originalRolesData", originalRolesData);

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
        users_assigned: "N/A",
      }));

      console.log("transformedData", transformedData);

      setRolesTableData(transformedData);
    } else {
      setRolesTableData([]);
    }
  };

  const handleEdit = (role_uid: any): void => {
    navigate(
      `/survey-information/user-roles/edit-role/${survey_uid}/${role_uid}`
    );
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
          <Button type="link" onClick={() => handleEdit(record?.role_uid)}>
            Edit
          </Button>
          <Button type="link" onClick={() => handleDuplicate(record)}>
            Duplicate
          </Button>

          <Button
            danger
            type="text"
            onClick={() => handleDelete(record)}
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
                  onClick={() =>
                    navigate(
                      `/survey-information/user-roles/add-role/${survey_uid}`
                    )
                  }
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
          </div>

          <FooterWrapper>
            <SaveButton>Save</SaveButton>
            <ContinueButton loading={loading}>Finalize roles</ContinueButton>
          </FooterWrapper>
        </>
      )}
    </>
  );
}

export default Roles;

function handleDuplicate(record: any): void {
  throw new Error("Function not implemented.");
}

function handleDelete(record: any): void {
  throw new Error("Function not implemented.");
}
