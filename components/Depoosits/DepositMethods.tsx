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

const darkTheme = createTheme({
	palette: {
		mode: 'dark', // Set the mode to dark
		// You can further customize colors, typography, etc. here if needed
	},
});

const AllDepositMethods = () => {
	const { data, isLoading, isError, error } = useGetDepositMethodsQuery();
	const { methods } = data || [];

	const [
		activateDepositMethod,
		{
			isLoading: a_isLoading,
			isError: a_isError,
			isSuccess: a_isSuccess,
			error: a_error,
		},
	] = useActivateDepositMethodMutation();

	// handle activate
	const handleActivate = (id: string) => {
		activateDepositMethod(id);
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
			field: 'username',
			headerName: 'Username',
			width: 150,
		},
		{
			field: 'qr_code_url',
			headerName: 'QR Code',
			width: 100,
			renderCell: (params) => {
				return (
					<div className='flex items-center justify-center'>
						<img src={params.value} alt='QR Code' className='w-10 h-10' />
					</div>
				);
			},
		},
		{
			field: 'address',
			headerName: 'Trx Address',
			width: 400,
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
						{params.row.is_active === true ? (
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

	methods &&
		methods.map((method: any) => {
			return rows.push({
				id: method._id,
				username: method.username,
				address: method.trx_address, // Corrected from user.full_name
				is_active: method.is_active,
				qr_code_url: method.qr_code_url,
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
						<Box sx={{ height: 400, width: '100%' }}>
							<DataGrid
								rows={rows}
								columns={columns}
								initialState={{
									pagination: {
										paginationModel: {
											pageSize: 5,
										},
									},
								}}
								pageSizeOptions={[5]}
								disableRowSelectionOnClick
							/>
						</Box>
					</ThemeProvider>
				</div>
			)}
		</div>
	);
};

export default AllDepositMethods;
