import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import { store } from "../store"; // import your Redux store instance


export const apiSlice = createApi({
  reducerPath: "api",
  // baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000/" }),
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      // prepareHeaders: (headers, { getState }) => {
      //   const token = getState().auth.token;
              if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Data"],
  endpoints: (builder) => ({
    getData: builder.query({
      query: (endpoint) => endpoint,
      providesTags: ["Data"],
    }),
    updateData: builder.mutation({
      query: ({ endpoint, body }) => ({
        url: endpoint,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Data"],
    }),
    getMovieDetails: builder.query({
      query: (id) =>
        `/movie/${id}?api_key=${process.env.REACT_APP_TMDB_API_KEY}&append_to_response=credits,videos`,
    }),

    deleteData: builder.mutation({
      query: (endpoint) => ({
        url: endpoint,
        method: "DELETE",
      }),
      invalidatesTags: ["Data"],
    }),
    searchMovies: builder.query({
      query: (searchTerm) => `/search?search=${encodeURIComponent(searchTerm)}`,
    }),
    recommendMovies: builder.query({
      query: (recommendTerm) =>
        `/recommend?title=${encodeURIComponent(recommendTerm)}`,
    }),


    getUsers: builder.query({
      query: () => "/user",
      providesTags: ["Data"],
    }),
    addUser: builder.mutation({
      query: (body) => ({
        url: "/user",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Data"],
    }),
    updateUserBehavior: builder.mutation({
      query: ({ id, body }) => ({
        url: `/user/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Data"],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/user/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Data"],
    }),
    


    register: builder.mutation({
      query: (userData) => ({
        url: "/register",
        method: "POST",
        body: userData,
      }),
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
    }),
    getProfile: builder.query({
      query: () => "/auth/profile",
      providesTags: ["User"],
    }),
    addToWatchlist: builder.mutation({
      query: (movieId) => ({
        url: "/user/watchlist",
        method: "PUT",
        body: { movieId },
      }),
      invalidatesTags: ["User"],
    }),
    markAsWatched: builder.mutation({
      query: (movieId) => ({
        url: "/user/watched",
        method: "PUT",
        body: { movieId },
      }),
      invalidatesTags: ["User"],
    }),


// Add to endpoints in apiSlice.js
updateClick: builder.mutation({
  query: (movieId) => ({
    url: "/user/clicked",
    method: "PUT",
    body: { movieId },
  }),
  invalidatesTags: ["User"],
}),

addFavorite: builder.mutation({
  query: (movieId) => ({
    url: "/user/favorites",
    method: "PUT",
    body: { movieId },
  }),
  invalidatesTags: ["User"],
}),
removeFavorite: builder.mutation({
  query: (movieId) => ({
    url: "/user/favorites",
    method: "DELETE",
    body: { movieId },
  }),
  invalidatesTags: ["User"],
}),

recommendByBehavior: builder.query({
  query: () => "/recommend/personal",
})
    



// triggerScraping: builder.mutation({
//   query: () => ({
//     url: "/scrape",
//     method: "POST"
//   }),
})

});

export const {
  useGetDataQuery,
  useUpdateDataMutation,
  useDeleteDataMutation,
  useSearchMoviesQuery,
  useGetMovieDetailsQuery,
  useRecommendMoviesQuery,


  useGetUsersQuery,
  useAddUserMutation,
  useUpdateUserBehaviorMutation,
  useDeleteUserMutation,


  useRegisterMutation,
  useLoginMutation,
  useGetProfileQuery,
  useAddToWatchlistMutation,
  useMarkAsWatchedMutation,


  // uesUpdateClick,
  useUpdateClickMutation,
  useAddFavoriteMutation,
  useRemoveFavoriteMutation,
  useRecommendByBehaviorQuery

 

} = apiSlice;
