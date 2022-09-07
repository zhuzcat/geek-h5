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

// 频道信息
export type Channel = {
  id: number;
  name: string;
};

// 频道列表
export type ChannelList = {
  channels: Channel[];
};

// 文章
export type Article = {
  art_id: string;
  title: string;
  aut_id: string;
  aut_name: string;
  comm_count: number;
  pubdate: string;
  cover: {
    type: 0 | 1 | 3;
    images: string[];
  };
};

// 文章列表
export type ArticleList = {
  pre_timestamp: string;
  results: Article[];
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

export type UserChannelResponse = ApiResponse<ChannelList>;

export type ArticleListResponse = ApiResponse<ArticleList>;
