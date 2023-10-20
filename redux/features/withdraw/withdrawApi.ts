import { apiSlice } from '../api/apiSlice';

export const withdrawApi = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		// get all withdraws
		getWithdraws: builder.query<any, void>({
			query: () => '/admin/withdraws',
			providesTags: ['Withdraws'],
		}),

		// get withdraw by id
		getWithdrawById: builder.query<any, string>({
			query: (id) => `/admin/withdraw/${id}`,
			providesTags: ['Withdraw'],
		}),

		// approve withdraw
		approveWithdraw: builder.mutation<any, any>({
			query: (data) => ({
				url: `/withdraw/approve`,
				method: 'PUT',
				body: data,
			}),
		}),
	}),
});

export const {
	useGetWithdrawsQuery,
	useGetWithdrawByIdQuery,
	useApproveWithdrawMutation,
} = withdrawApi;
