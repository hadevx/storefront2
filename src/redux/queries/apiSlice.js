import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:4001",
  // baseUrl: "https://backend-production-9357.up.railway.app",
  // baseUrl: "https://backend.webschema.online",
  credentials: "include",
});

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ["Product", "Order", "User", "Status"],
  endpoints: (builder) => ({}),
});
