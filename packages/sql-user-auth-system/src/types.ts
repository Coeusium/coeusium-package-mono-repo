export interface User {
  id: string;
  email: string;
  username: string;
  registration_date: Date;
  last_login: Date;
  verified: boolean;
  logged_in: boolean;
}

export interface UserPassword {
  user_id: string;
  password: string;
}

export interface UserLogin {
  user_id: string;
  login_date: Date;
}

export interface UserLogout {
  user_id: string;
  logout_date: Date;
}

export interface UserPasswordReset {
  user_id: string;
  token: string;
  date_requested: string;
  completed: string;
}

export interface AuthGroup {
  group_name: string;
  group_parent: string;
}

export interface AuthGroupMembership {
  user_id: string;
  group_name: string;
}
