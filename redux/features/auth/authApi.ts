import { apiSlice } from '../api/apiSlice';
import { setUser, logoutUser, setEmail } from './authSlice';
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
export const authApi = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
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

		// login user
		loginUser: builder.mutation<IUser, any>({
			query: (body) => ({
				url: '/admin-login',
				method: 'POST',
				body,
			}),
			invalidatesTags: ['User'],
			async onQueryStarted(arg, { dispatch, queryFulfilled }) {
				try {
					const result = await queryFulfilled;
					dispatch(setUser(result.data));
				} catch (error) {
					error as any;
				}
			},
		}),

		// get user by token._id from cookie
		loadUser: builder.query<any, void>({
			query: (id) => `/load-user`,
			providesTags: ['User'],
			async onQueryStarted(arg, { dispatch, queryFulfilled }) {
				try {
					const result = await queryFulfilled;
					dispatch(setUser(result.data));
				} catch (error) {
					// diclear error type
					error as any;
				}
			},
		}),

		// logout user
		logoutUser: builder.mutation({
			query: () => ({
				url: `/logout`,
				method: 'PUT',
			}),
			async onQueryStarted(arg, { dispatch, queryFulfilled }) {
				try {
					const result = await queryFulfilled;
					dispatch(logoutUser());
				} catch (error) {
					console.log(error);
				}
			},
		}),

		// get my team
		getMyTeam: builder.query<any, void>({
			query: (id) => `/my-team/${id}`,
			providesTags: ['User'],
		}),

		// resend verification email
		resendVerificationEmail: builder.mutation<IUser, any>({
			query: (body) => ({
				url: '/resend-email-verification',
				method: 'POST',
				body,
			}),
		}),

		// registration done
		registrationDone: builder.mutation<IUser, any>({
			query: (body) => ({
				url: '/register-done',
				method: 'POST',
				body,
			}),
		}),

		// check if user is exist by email
		checkUserByEmail: builder.mutation<IUser, any>({
			query: (body) => ({
				url: '/check-user-by-email',
				method: 'POST',
				body,
			}),

			async onQueryStarted(arg, { dispatch, queryFulfilled }) {
				try {
					const result = await queryFulfilled;
					dispatch(setEmail(result.data));
				} catch (error) {
					console.log(error);
				}
			},
		}),

		// get logged in user level_1 mambers
		getLoggedInUserLevel1Members: builder.query<any, void>({
			query: (id) => `/get-level-1-members/${id}`,
			providesTags: ['User'],
		}),

		// change email
		changeEmail: builder.mutation<IUser, any>({
			query: (body) => ({
				url: '/change-email',
				method: 'PUT',
				body,
			}),
			invalidatesTags: ['User'],
			async onQueryStarted(arg, { dispatch, queryFulfilled }) {
				try {
					const result = await queryFulfilled;
					dispatch(logoutUser());
				} catch (error) {
					console.log(error);
				}
			},
		}),

		// verify code for change email
		verifyCodeForChangeEmail: builder.mutation<IUser, any>({
			query: (body) => ({
				url: '/verify-code-for-change-email',
				method: 'POST',
				body,
			}),
		}),

		// add phone number
		addPhoneNumber: builder.mutation<IUser, any>({
			query: (body) => ({
				url: '/add-phone-number',
				method: 'PUT',
				body,
			}),
			invalidatesTags: ['User'],
		}),

		// get all transactions
		getAllTransactions: builder.query<any, void>({
			query: () => '/getMyTransactions',
		}),

		// get userDetails
		getUserDetails: builder.query<any, void>({
			query: (id) => `/get-user-details-by-id/${id}`,
		}),
	}),
});

export const {
	useRegisterUserMutation,
	useVerifyEmailMutation,
	useCreatePasswordMutation,
	useLoginUserMutation,
	useLogoutUserMutation,
	useGetMyTeamQuery,
	useResendVerificationEmailMutation,
	useRegistrationDoneMutation,
	useCheckUserByEmailMutation,
	useLoadUserQuery,
	useGetLoggedInUserLevel1MembersQuery,
	useChangeEmailMutation,
	useVerifyCodeForChangeEmailMutation,
	useAddPhoneNumberMutation,
	useGetAllTransactionsQuery,
	useGetUserDetailsQuery,
} = authApi;
