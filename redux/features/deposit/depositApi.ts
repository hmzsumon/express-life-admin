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

		// add deposit method
		addDepositMethod: builder.mutation<any, any>({
			query: (data) => ({
				url: `/add-deposit-method`,
				method: 'POST',
				body: data,
			}),
			invalidatesTags: ['Deposit', 'Deposits'],
		}),

		// get all deposit methods
		getDepositMethods: builder.query<any, void>({
			query: () => '/deposit-methods',
			providesTags: ['DepositMethods'],
		}),

		// activate deposit method
		activateDepositMethod: builder.mutation<any, any>({
			query: (id) => ({
				url: `/deposit-method/active/${id}`,
				method: 'PUT',
			}),
			invalidatesTags: ['DepositMethods'],
		}),
	}),
});

export const {
	useGetDepositsQuery,
	useGetDepositByIdQuery,
	useApproveDepositMutation,
	useRejectDepositMutation,
	useAddDepositMethodMutation,
	useGetDepositMethodsQuery,
	useActivateDepositMethodMutation,
} = depositApi;
