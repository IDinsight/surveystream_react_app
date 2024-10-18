export type AssignmentPayload = {
  target_uid: number;
  enumerator_uid: number;
};

export type AssignmentFormPayload = {
  formUID: string;
  formData: AssignmentPayload[];
  callFn: (data: any) => void;
};

export interface AssignmentsState {
  tableConfig: {
    loading: boolean;
    data: any;
    err: string | null;
  };
  assignments: {
    loading: boolean;
    data: any;
    err: string | null;
  };
  assignmentEnumerators: {
    loading: boolean;
    data: any;
    err: string | null;
  };
  assignmentTargets: {
    loading: boolean;
    data: any;
    err: string | null;
  };
}
