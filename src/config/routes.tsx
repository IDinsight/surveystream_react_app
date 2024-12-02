import { Routes, Route, Navigate, Outlet, useParams } from "react-router-dom";
import * as Sentry from "@sentry/react";
import Login from "../modules/Auth/Login";
import LandingPage from "../modules/LandingPage";
import SurveysHomePage from "../modules/SurveysHomePage";
import NewSurveyConfig from "../modules/NewSurveyConfig";
import ModuleSelection from "../modules/ModuleSelection";
import { getCookie, userHasPermission } from "../utils/helper";
import ForgotPassword from "../modules/Auth/ForgotPassword";
import ResetPassword from "../modules/Auth/ResetPassword";
import SurveyCTOQuestions from "../modules/SurveyInformation/SurveyCTOQuestions";
import SurveyCTOInfomation from "../modules/SurveyInformation/SurveyCTOInformation";
import SurveyConfiguration from "../modules/SurveyConfiguration";
import SurveyLocationAdd from "../modules/SurveyInformation/SurveyLocationAdd";
import SurveyLocationHierarchy from "../modules/SurveyInformation/SurveyLocationHierarchy";
import SurveyLocationUpload from "../modules/SurveyInformation/SurveyLocationUpload";
import EnumeratorsUpload from "../modules/SurveyInformation/Enumerators/EnumeratorsUpload";
import EnumeratorsMap from "../modules/SurveyInformation/Enumerators/EnumeratorsMap";
import NotFound from "../components/NotFound";
import TargetsUpload from "../modules/SurveyInformation/Targets/TargetsUpload";
import TargetsMap from "../modules/SurveyInformation/Targets/TargetsMap";
import TargetsHome from "../modules/SurveyInformation/Targets";
import EnumeratorsHome from "../modules/SurveyInformation/Enumerators";
import CompleteRegistration from "../modules/Users/CompleteRegistration";
import AddUser from "../modules/Users/AddUser";
import ManageUsers from "../modules/Users/ManageUsers";
import EditUser from "../modules/Users/EditUser";
import Assignments from "../modules/Assignments/Assignments";
import CreateAssignments from "../modules/Assignments/AssignmentsTab/CreateAssignments/CreateAssignments";
import UploadAssignments from "../modules/Assignments/AssignmentsTab/UploadAssignments/UploadAssignments";
import SurveyRoles from "../modules/SurveyInformation/SurveyUserRoles/SurveyRoles";
import SurveyUsers from "../modules/SurveyInformation/SurveyUserRoles/SurveyUsers";
import { useAppSelector } from "../redux/hooks";
import { RootState } from "../redux/store";
import PermissionDenied from "../components/PermissionDenied";
import SurveyStatusMapping from "../modules/SurveyInformation/SurveyStatusMapping";
import MediaAuditsHome from "../modules/MediaAudits";
import MediaAuditsManage from "../modules/MediaAudits/MediaAuditsManage";
import DQFormHome from "../modules/DQ/DQForm";
import DQFormManage from "../modules/DQ/DQForm/DQFormManage";
import DQFormSCTOQuestion from "../modules/DQ/DQForm/DQFormSCTOQuestion";
import DQChecksHome from "../modules/DQ/DQChecks";
import DQChecksManage from "../modules/DQ/DQChecks/DQChecksManage";
import DQChecksEdit from "../modules/DQ/DQChecks/DQChecksEdit";
import ConfigureEmails from "../modules/Emails/ConfigureEmails/ConfigureEmails";
import Emails from "../modules/Emails/Emails";
import TableConfig from "../modules/Assignments/TableConfig/TableConfig";
import AdminFormHome from "../modules/AdminForm";
import AdminFormManage from "../modules/AdminForm/AdminFormManage";
import AdminFormSCTOQuestion from "../modules/AdminForm/AdminFormSCTOQuestion";
import MappingHome from "../modules/Mapping";
import MappingManage from "../modules/Mapping/MappingManage";

const SentryRoutes = Sentry.withSentryReactRouterV6Routing(Routes);

const isAuthenticated = () => {
  // Return true if authenticated, false otherwise
  const rememberToken = getCookie("remember_token");
  return rememberToken !== "";
};

const useUserProfile = () => {
  return useAppSelector((state: RootState) => state.auth.profile);
};

const useIsSuperAdmin = () => {
  const userProfile = useUserProfile();
  return userProfile?.is_super_admin;
};

const useCanCreateSurvey = () => {
  const userProfile = useUserProfile();
  return userProfile?.can_create_survey;
};

const PrivateRoute = () => {
  const isAuthorized = isAuthenticated();
  return isAuthorized ? <Outlet /> : <Navigate to="/login" replace />;
};

const SuperAdminRoute = () => {
  const isAuthorized = isAuthenticated();
  const isAdmin = useIsSuperAdmin();
  const isSuperAdminAuthorized = isAuthorized && isAdmin;

  return isSuperAdminAuthorized ? <Outlet /> : <PermissionDenied />;
};

const SurveyCreationRoute = () => {
  const isAuthorized = isAuthenticated();
  const canCreate = useCanCreateSurvey();
  const isSurveyAuthorized = isAuthorized && canCreate;

  return isSurveyAuthorized ? <Outlet /> : <PermissionDenied />;
};

const ProtectedPermissionRoute = (permission_name: any) => {
  const { survey_uid } = useParams<{ survey_uid?: string }>();
  const userProfile = useAppSelector((state: RootState) => state.auth.profile);

  const hasPermission = userHasPermission(
    userProfile,
    survey_uid || "",
    permission_name
  );

  return hasPermission ? <Outlet /> : <PermissionDenied />;
};

const AppRoutes = () => {
  return (
    <SentryRoutes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/reset-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:id/:token" element={<ResetPassword />} />
      <Route
        path="/complete-registration/:token"
        element={<CompleteRegistration />}
      />
      <Route element={<SuperAdminRoute />}>
        <Route path="/users" element={<ManageUsers />} />
        <Route path="/users/add" element={<AddUser />} />
        <Route path="/users/edit" element={<EditUser />} />
      </Route>

      <Route element={<SurveyCreationRoute />}>
        <Route
          path="/new-survey-config/:survey_uid?"
          element={<NewSurveyConfig />}
        />
      </Route>

      <Route element={<PrivateRoute />}>
        <Route path="/surveys" element={<SurveysHomePage />} />
        <Route
          path="/survey-configuration/:survey_uid?"
          element={<SurveyConfiguration />}
        />
      </Route>

      <Route
        element={<ProtectedPermissionRoute permission_name="Survey Admin" />}
      >
        <Route
          path="/module-selection/:survey_uid?"
          element={<ModuleSelection />}
        />
        <Route
          path="/survey-information/:survey_uid?"
          element={<SurveyCTOInfomation />}
        />
        <Route
          path="/survey-information/survey-users/:path?/:survey_uid?"
          element={<SurveyUsers />}
        />

        <Route
          path="/survey-information/survey-roles/:path?/:survey_uid?/:role_uid?"
          element={<SurveyRoles />}
        />

        <Route
          path="/survey-information/survey-cto-information/:survey_uid?"
          element={<SurveyCTOInfomation />}
        />
        <Route
          path="/survey-information/survey-cto-questions/:survey_uid?/:form_uid?"
          element={<SurveyCTOQuestions />}
        />
      </Route>
      <Route
        element={
          <ProtectedPermissionRoute permission_name="WRITE Survey Locations" />
        }
      >
        <Route
          path="/survey-information/location/add/:survey_uid?"
          element={<SurveyLocationAdd />}
        />
        <Route
          path="/survey-information/location/hierarchy/:survey_uid?"
          element={<SurveyLocationHierarchy />}
        />
      </Route>
      <Route
        element={
          <ProtectedPermissionRoute permission_name="READ Survey Locations" />
        }
      >
        <Route
          path="/survey-information/location/upload/:survey_uid?"
          element={<SurveyLocationUpload />}
        />
      </Route>
      <Route
        element={
          <ProtectedPermissionRoute permission_name="READ Enumerators" />
        }
      >
        <Route
          path="/survey-information/enumerators/:survey_uid?/:form_uid?"
          element={<EnumeratorsHome />}
        />
      </Route>
      <Route
        element={
          <ProtectedPermissionRoute permission_name="WRITE Enumerators" />
        }
      >
        <Route
          path="/survey-information/enumerators/upload/:survey_uid?/:form_uid?"
          element={<EnumeratorsUpload />}
        />
        <Route
          path="/survey-information/enumerators/map/:survey_uid?/:form_uid?"
          element={<EnumeratorsMap />}
        />
      </Route>
      <Route
        element={<ProtectedPermissionRoute permission_name="READ Targets" />}
      >
        <Route
          path="/survey-information/targets/:survey_uid?/:form_uid?"
          element={<TargetsHome />}
        />
      </Route>
      <Route
        element={<ProtectedPermissionRoute permission_name="WRITE Targets" />}
      >
        <Route
          path="/survey-information/targets/upload/:survey_uid?/:form_uid?"
          element={<TargetsUpload />}
        />
        <Route
          path="/survey-information/targets/map/:survey_uid?/:form_uid?"
          element={<TargetsMap />}
        />
      </Route>
      <Route
        element={
          <ProtectedPermissionRoute permission_name="WRITE Assignments" />
        }
      >
        <Route
          path="/module-configuration/table-config/:survey_uid?/:form_uid?"
          element={<TableConfig />}
        />
      </Route>
      <Route
        element={
          <ProtectedPermissionRoute permission_name="READ Assignments" />
        }
      >
        <Route
          path="/module-configuration/assignments/:survey_uid?/:form_uid?"
          element={<Assignments />}
        />
      </Route>
      <Route
        element={
          <ProtectedPermissionRoute permission_name="WRITE Assignments" />
        }
      >
        <Route
          path="/module-configuration/assignments/:survey_uid?/:form_uid?/create"
          element={<CreateAssignments />}
        />
      </Route>
      <Route
        element={
          <ProtectedPermissionRoute permission_name="WRITE Assignments Upload" />
        }
      >
        <Route
          path="/module-configuration/assignments/:survey_uid?/:form_uid?/upload"
          element={<UploadAssignments />}
        />
      </Route>
      <Route
        element={<ProtectedPermissionRoute permission_name="READ Emails" />}
      >
        <Route
          path="/module-configuration/emails/:survey_uid?/:tabId?"
          element={<Emails />}
        />
      </Route>
      <Route
        element={<ProtectedPermissionRoute permission_name="WRITE Emails" />}
      >
        <Route
          path="/module-configuration/emails/:survey_uid?/create"
          element={<ConfigureEmails />}
        />
      </Route>
      <Route
        element={
          <ProtectedPermissionRoute permission_name="WRITE Target Status Mapping" />
        }
      >
        <Route
          path="/survey-information/survey/status-mapping/:survey_uid?"
          element={<SurveyStatusMapping />}
        />
      </Route>
      <Route
        element={
          <ProtectedPermissionRoute permission_name="READ Media Files Config" />
        }
      >
        <Route
          path="/module-configuration/media-audits/:survey_uid?"
          element={<MediaAuditsHome />}
        />
        <Route
          path="/module-configuration/media-audits/:survey_uid/manage"
          element={<MediaAuditsManage />}
        />
      </Route>
      <Route
        element={
          <ProtectedPermissionRoute permission_name="READ Data Quality Forms" />
        }
      >
        <Route
          path="/module-configuration/dq-forms/:survey_uid?"
          element={<DQFormHome />}
        />
        <Route
          path="/module-configuration/dq-forms/:survey_uid/manage"
          element={<DQFormManage />}
        />
        <Route
          path="/module-configuration/dq-forms/:survey_uid/scto-questions/:dq_form_uid"
          element={<DQFormSCTOQuestion />}
        />
      </Route>
      <Route
        element={
          <ProtectedPermissionRoute permission_name="READ Data Quality" />
        }
      >
        <Route
          path="/module-configuration/dq-checks/:survey_uid?"
          element={<DQChecksHome />}
        />
        <Route
          path="/module-configuration/dq-checks/:survey_uid/manage"
          element={<DQChecksManage />}
        />
        <Route
          path="/module-configuration/dq-checks/:survey_uid/:form_uid/edit/:type_id"
          element={<DQChecksEdit />}
        />
      </Route>
      <Route
        element={
          <ProtectedPermissionRoute permission_name="READ Admin Forms" />
        }
      >
        <Route
          path="/module-configuration/admin-forms/:survey_uid?"
          element={<AdminFormHome />}
        />
        <Route
          path="/module-configuration/admin-forms/:survey_uid/manage"
          element={<AdminFormManage />}
        />
        <Route
          path="/module-configuration/admin-forms/:survey_uid/scto-questions/:admin_form_uid"
          element={<AdminFormSCTOQuestion />}
        />
      </Route>
      <Route
        element={<ProtectedPermissionRoute permission_name="READ Mapping" />}
      >
        <Route
          path="/survey-information/mapping/:survey_uid?"
          element={<MappingHome />}
        />
        <Route
          path="/survey-information/mapping/:survey_uid?/:mapping_name?"
          element={<MappingManage />}
        />
      </Route>
      <Route path="*" element={<NotFound />} />
    </SentryRoutes>
  );
};

export default AppRoutes;
