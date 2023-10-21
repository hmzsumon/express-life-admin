import { apiSlice } from '../api/apiSlice';

export const ownerApi = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		// get all owners
		getOwners: builder.query<any, void>({
			query: () => '/get-all-owners',
			providesTags: ['Owners'],
		}),

		// get owner by id
		getOwnerById: builder.query<any, string>({
			query: (id) => `/owner/${id}`,
			providesTags: ['Owner'],
		}),

		// approve owner
		approveOwner: builder.mutation<any, any>({
			query: (id) => ({
				url: `/owner/approve/${id}`,
				method: 'PUT',
			}),
			invalidatesTags: ['Owner', 'Owners', 'Company'],
		}),

		// reject owner
		rejectOwner: builder.mutation<any, any>({
			query: (data) => ({
				url: `/owner/reject`,
				method: 'PUT',
				body: data,
			}),
			invalidatesTags: ['Owner', 'Owners'],
		}),

		// add owner
		addOwner: builder.mutation<any, any>({
			query: (data) => ({
				url: `/add-owner`,
				method: 'POST',
				body: data,
			}),
			invalidatesTags: ['Owner', 'Owners'],
		}),
	}),
});

export const {
	useGetOwnersQuery,
	useGetOwnerByIdQuery,
	useApproveOwnerMutation,
	useRejectOwnerMutation,
	useAddOwnerMutation,
} = ownerApi;
