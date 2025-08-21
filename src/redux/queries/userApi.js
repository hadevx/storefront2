import { apiSlice } from "./apiSlice";

const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    loginUser: builder.mutation({
      query: (data) => ({
        url: "/api/users/login",
        method: "POST",
        body: data,
      }),
    }),
    registerUser: builder.mutation({
      query: (data) => ({
        url: "/api/users/register",
        method: "POST",
        body: data,
      }),
    }),
    updateUser: builder.mutation({
      query: (data) => ({
        url: "/api/users/profile",
        method: "PUT",
        body: data,
      }),
    }),

    createAddress: builder.mutation({
      query: (data) => ({
        url: "/api/users/address",
        method: "POST",
        body: data,
      }),
    }),
    getAddress: builder.query({
      query: (userId) => ({
        url: `/api/users/address/${userId}`,
      }),
    }),
    updateAddress: builder.mutation({
      query: (data) => ({
        url: "/api/users/address",
        method: "PUT",
        body: data,
      }),
    }),
    getUserDetails: builder.query({
      query: (userId) => ({
        url: `/api/users/${userId}`,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: `/api/users/logout`,
        method: "POST",
      }),
    }),
  }),
});

export const {
  useLoginUserMutation,
  useRegisterUserMutation,
  /* useGetUsersQuery, */
  useGetUserDetailsQuery,
  useLogoutMutation,
  useCreateAddressMutation,
  useGetAddressQuery,
  useUpdateUserMutation,
  useUpdateAddressMutation,
} = userApi;
