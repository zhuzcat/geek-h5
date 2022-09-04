import { fetchQueryWithReauth } from "@/utils/http";
import { createApi } from "@reduxjs/toolkit/query/react";

const api = createApi({
  reducerPath: "api",

  baseQuery: fetchQueryWithReauth,

  tagTypes: ["Profile"],

  endpoints: () => ({}),

  keepUnusedDataFor: 10,
});

export { api };
