type ApiResponse<Data> = {
  message: string;
  data: Data;
};

// token
export type Token = {
  token: string;
  refresh_token: string;
};

// 用户信息
export type User = {
  id: string;
  name: string;
  photo: string;
  art_count: string;
  follow_count: string;
  fans_count: string;
  like_count: string;
};

// 用户详细信息
export type UserProfile = {
  id: string;
  name: string;
  photo: string;
  mobile: string;
  gender: string;
  birthday: string;
  intro: string;
};

export type LoginResponse = ApiResponse<Token>;

export type ProfileResponse = ApiResponse<User>;

export type UserProfileResponse = ApiResponse<UserProfile>;

export type UserPhotoResponse = ApiResponse<{
  photo: string;
}>;

export type RefreshTokenResponse = ApiResponse<{
  token: string;
}>;
