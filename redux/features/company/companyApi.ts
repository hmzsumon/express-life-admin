import { apiSlice } from '../api/apiSlice';

export const companyApi = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		// get company from api with typescript
		getCompany: builder.query<any, void>({
			query: () => '/admin/company',
		}),
	}),
});

export const { useGetCompanyQuery } = companyApi;
