import { apiSlice } from '../api/apiSlice';

export const depositApi = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		// get all deposits
		getDeposits: builder.query<any, void>({
			query: () => '/admin/deposits',
			providesTags: ['Deposits'],
		}),

		// get deposit by id
		getDepositById: builder.query<any, string>({
			query: (id) => `/deposit/${id}`,
			providesTags: ['Deposit'],
		}),

		// approve deposit
		approveDeposit: builder.mutation<any, any>({
			query: (id) => ({
				url: `/deposit/approve/${id}`,
				method: 'PUT',
			}),
			invalidatesTags: ['Deposit', 'Deposits', 'Company'],
		}),

		// reject deposit
		rejectDeposit: builder.mutation<any, any>({
			query: (data) => ({
				url: `/deposit/reject`,
				method: 'PUT',
				body: data,
			}),
			invalidatesTags: ['Deposit', 'Deposits'],
		}),
	}),
});

export const {
	useGetDepositsQuery,
	useGetDepositByIdQuery,
	useApproveDepositMutation,
	useRejectDepositMutation,
} = depositApi;
