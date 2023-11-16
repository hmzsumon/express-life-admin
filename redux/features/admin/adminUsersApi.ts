import { apiSlice } from '../api/apiSlice';

export interface IUser {
	user: any;
	token: string;
	success: boolean;
	data: {
		_id: string;
		name: string;
		email: string;
		role: string;
		createdAt: string;
		updatedAt: string;
	};
}

export const adminUsersApi = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		// get users from api with typescript
		getUsers: builder.query<any, void>({
			query: () => '/admin/users',
			providesTags: ['Users'],
		}),

		// register user
		registerUser: builder.mutation<IUser, any>({
			query: (body) => ({
				url: '/register',
				method: 'POST',
				body,
			}),
		}),

		// verify email
		verifyEmail: builder.mutation<IUser, any>({
			query: (body) => ({
				url: '/verify-email',
				method: 'POST',
				body,
				delay: 30000,
			}),
			invalidatesTags: ['User'],
		}),

		// create password
		createPassword: builder.mutation<IUser, any>({
			query: (body) => ({
				url: '/create-password',
				method: 'POST',
				body,
			}),
			invalidatesTags: ['User'],
		}),

		// update user
		updateUser: builder.mutation<IUser, any>({
			query: ({ id, ...patch }) => ({
				url: `/users/${id}`,
				method: 'PATCH',
				body: patch,
			}),
			invalidatesTags: ['User'],
		}),

		// delete user
		deleteUser: builder.mutation<void, any>({
			query: (id) => ({
				url: `/users/${id}`,
				method: 'DELETE',
			}),
			invalidatesTags: ['User'],
		}),

		// change status
		changeStatus: builder.mutation<void, any>({
			query: (data) => ({
				url: `/change-user-status`,
				method: 'PUT',
				body: data,
			}),
			invalidatesTags: ['User', 'Users'],
		}),

		// change block status
		changeBlockStatus: builder.mutation<void, any>({
			query: (data) => ({
				url: `/change-block-status`,
				method: 'PUT',
				body: data,
			}),
			invalidatesTags: ['User', 'Users'],
		}),
	}),
});

export const {
	useGetUsersQuery,
	useRegisterUserMutation,
	useVerifyEmailMutation,
	useCreatePasswordMutation,
	useUpdateUserMutation,
	useDeleteUserMutation,
	useChangeStatusMutation,
	useChangeBlockStatusMutation,
} = adminUsersApi;
