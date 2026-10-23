import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const patchCards = (dispatch, recipe) =>
  dispatch(api.util.updateQueryData('getCards', undefined, recipe));

const patchInfiniteCards = (dispatch, recipe) =>
  dispatch(api.util.updateQueryData('getInfinitePosts', undefined, recipe));

const pageLimit = 6;

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://dummyjson.com/',
  }),
  endpoints: (build) => ({
    getCards: build.query({
      query: () => 'products',
      transformResponse: (response) => response.products,
    }),

    addCard: build.mutation({
      queryFn: (body) => ({ data: { ...body, id: Date.now() } }),
      async onQueryStarted(body, { dispatch, queryFulfilled }) {
        try {
          const { data: newCard } = await queryFulfilled;

          patchCards(dispatch, (draft) => {
            draft.unshift(newCard);
          });

          patchInfiniteCards(dispatch, (draft) => {
            draft.pages[0]?.products.unshift(newCard);
          });
        } catch (error) {
          console.error(error);
        }
      },
    }),

    deleteCard: build.mutation({
      queryFn: () => ({ data: null }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;

          patchCards(dispatch, (draft) => draft.filter((c) => c.id !== id));

          patchInfiniteCards(dispatch, (draft) => {
            draft.pages.forEach((page) => {
              page.products = page.products.filter((c) => c.id !== id);
            });
          });
        } catch (error) {
          console.error(error);
        }
      },
    }),

    updateCard: build.mutation({
      queryFn: ({ id, ...body }) => ({ data: { id, ...body } }),
      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        try {
          const { data: updatedCard } = await queryFulfilled;

          patchCards(dispatch, (draft) => {
            const card = draft.find((c) => c.id === id);
            if (card) Object.assign(card, updatedCard);
          });

          patchInfiniteCards(dispatch, (draft) => {
            draft.pages.forEach((page) => {
              const card = page.products.find((c) => c.id === id);
              if (card) Object.assign(card, updatedCard);
            });
          });
        } catch (error) {
          console.error(error);
        }
      },
    }),

    getInfinitePosts: build.infiniteQuery({
      query: ({ pageParam }) =>
        `products?limit=${pageLimit}&skip=${(pageParam - 1) * pageLimit}&select=title,description,price,brand`,
      infiniteQueryOptions: {
        initialPageParam: 1,
        getNextPageParam: (lastPage, _, lastPageParam) =>
          lastPageParam * pageLimit < lastPage.total
            ? lastPageParam + 1
            : undefined,
      },
    }),
  }),
});

export const {
  useGetCardsQuery,
  useAddCardMutation,
  useDeleteCardMutation,
  useUpdateCardMutation,
  useGetInfinitePostsInfiniteQuery,
} = api;
