import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { setAccessToken, logout } from './authSlice';
import {
  AuthResponse,
  RefreshResponse,
  LoginCredentials,
  PeopleResponse,
  Person,
} from '../types/api.types';

const baseQuery = fetchBaseQuery({
  baseUrl: '/',
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as { auth: { accessToken: string | null } };
    const token = state.auth.accessToken;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // Try to refresh the token
    const state = api.getState() as { auth: { refreshToken: string | null } };
    const refreshToken = state.auth.refreshToken;

    if (refreshToken) {
      const refreshResult = await baseQuery(
        {
          url: '/auth/refresh',
          method: 'POST',
          body: { refreshToken },
        },
        api,
        extraOptions
      );

      if (refreshResult.data) {
        const data = refreshResult.data as RefreshResponse;
        api.dispatch(setAccessToken(data.accessToken));
        // Retry the original request
        result = await baseQuery(args, api, extraOptions);
      } else {
        // Refresh failed - show session expired and redirect to login
        api.dispatch(logout());
        const currentPath = window.location.pathname;
        window.location.href = `/login?next=${currentPath}&sessionExpired=true`;
      }
    } else {
      api.dispatch(logout());
    }
  }

  return result;
};

export const api = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: ['People', 'Person'],
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginCredentials>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    logout: builder.mutation<void, { refreshToken: string }>({
      query: (body) => ({
        url: '/auth/logout',
        method: 'POST',
        body,
      }),
    }),
    getPeople: builder.query<PeopleResponse, number>({
      query: (page = 1) => `https://swapi.dev/api/people/?page=${page}`,
      providesTags: (result) =>
        result
          ? [
              ...result.results.map(({ url }) => ({ type: 'People' as const, id: url })),
              { type: 'People', id: 'LIST' },
            ]
          : [{ type: 'People', id: 'LIST' }],
    }),
    getPerson: builder.query<Person, string>({
      query: (id) => `https://swapi.dev/api/people/${id}/`,
      providesTags: (result) => (result ? [{ type: 'Person', id: result.url }] : []),
    }),
  }),
});

export const { useLoginMutation, useLogoutMutation, useGetPeopleQuery, useGetPersonQuery } = api;
