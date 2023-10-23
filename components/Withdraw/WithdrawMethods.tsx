'use client';
import React, { use, useEffect } from 'react';
import { fetchBaseQueryError } from '@/redux/helpers';
import { toast } from 'react-toastify';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { SyncLoader } from 'react-spinners';
import {
	useActivateDepositMethodMutation,
	useGetDepositMethodsQuery,
} from '@/redux/features/deposit/depositApi';
import { useGetOwnersQuery } from '@/redux/features/owner/ownerApi';
import { useUpdateAllowToWithdrawMutation } from '@/redux/features/withdraw/withdrawApi';

const darkTheme = createTheme({
	palette: {
		mode: 'dark', // Set the mode to dark
		// You can further customize colors, typography, etc. here if needed
	},
});

const WithdrawMethods = () => {
	const { data, isLoading } = useGetOwnersQuery();
	const { owners } = data || {};

	const [
		updateAllowToWithdraw,
		{
			isLoading: a_isLoading,
			isError: a_isError,
			isSuccess: a_isSuccess,
			error: a_error,
		},
	] = useUpdateAllowToWithdrawMutation();

	// handle activate
	const handleActivate = (id: string) => {
		const data = {
			allow_to_withdraw: true,
			id,
		};
		updateAllowToWithdraw(data);
	};

	useEffect(() => {
		if (a_isSuccess) {
			toast.success('Deposit method activated successfully');
		}
		if (a_isError) {
			toast.error((a_error as fetchBaseQueryError).data?.message);
		}
	}, [a_isSuccess, a_isError, a_error]);

	const columns: GridColDef[] = [
		{
			field: 'full_name',
			headerName: 'Full Name',
			width: 200,
		},
		{
			field: 'username',
			headerName: 'Username',
			width: 150,
		},
		{
			field: 'total_withdraw_approved',
			headerName: 'Total Amount',
			width: 130,
			renderCell: (params: any) => (
				<div className='flex items-center gap-2 text-xs'>
					<p>
						{Number(params.row.total_withdraw_approved).toLocaleString(
							'en-US',
							{
								style: 'currency',
								currency: 'USD',
							}
						)}
					</p>
				</div>
			),
		},

		{
			field: 'is_active',
			headerName: 'Status',
			width: 150,
			renderCell: (params) => {
				return (
					<div className='flex items-center justify-center'>
						{params.value ? (
							<span className='px-2 py-1 text-xs text-green-500 bg-green-100 rounded-full'>
								Active
							</span>
						) : (
							<span className='px-2 py-1 text-xs text-red-500 bg-red-100 rounded-full'>
								Inactive
							</span>
						)}
					</div>
				);
			},
		},
		{
			field: 'action',
			headerName: 'Action',
			width: 150,
			renderCell: (params) => {
				return (
					<div className='flex items-center justify-center'>
						{params.row.allow_to_withdraw === true ? (
							<button className='px-2 py-1 text-xs text-white bg-red-500 rounded-full'>
								Deactivate
							</button>
						) : (
							<button
								className='px-2 py-1 text-xs text-white bg-green-500 rounded-full'
								onClick={() => handleActivate(params.row.id)}
							>
								Activate
							</button>
						)}
					</div>
				);
			},
		},
	];

	const rows: any[] = [];

	owners &&
		owners.map((method: any) => {
			return rows.push({
				id: method._id,
				full_name: method.full_name,
				username: method.username,
				total_withdraw_approved: method.total_withdraw_approved,
				allow_to_withdraw: method.allow_to_withdraw,
				is_active: method.allow_to_withdraw,
			});
		});
	return (
		<div>
			{isLoading ? (
				<div className='flex items-center justify-center '>
					<SyncLoader color='#EAB308' size={10} />
				</div>
			) : (
				<div className='px-2 mt-4 '>
					<ThemeProvider theme={darkTheme}>
						<Box sx={{ height: 600, width: '100%' }}>
							<DataGrid
								rows={rows}
								columns={columns}
								initialState={{
									pagination: {
										paginationModel: {
											pageSize: 20,
										},
									},
								}}
								pageSizeOptions={[20]}
								disableRowSelectionOnClick
							/>
						</Box>
					</ThemeProvider>
				</div>
			)}
		</div>
	);
};

export default WithdrawMethods;
