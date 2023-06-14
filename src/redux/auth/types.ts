export type LoginFormData = {
  username: string;
  password: string;
};

export type UpdateProfileForm = {
  new_email: string;
};

export type ChangePasswordData = {
  cur_password: "";
  new_password: "";
  confirm: "";
};

export type ResetPasswordData = {
  rpt_id: string;
  rpt_token: string;
  new_password: string;
  confirm: string;
};

export type ResetParams = {
  password: string;
  confirmPassword: string;
};
