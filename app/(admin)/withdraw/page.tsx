'use client';
import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useGetDepositsQuery } from '@/redux/features/deposit/depositApi';
import Link from 'next/link';
import { formatDate } from '@/lib/functions';
import { AiFillEye } from 'react-icons/ai';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { SyncLoader } from 'react-spinners';
import { useSelector } from 'react-redux';
import { useGetWithdrawsQuery } from '@/redux/features/withdraw/withdrawApi';

type Withdraw = {
	id: string;
	name: string;
	customer_id: string;
	amount: number;
	status: string;
	date: string;
	tnx_id: string;
};

const Withdraw = () => {
	const { them } = useSelector((state: any) => state.colorThem);
	// get color-them from local storage
	const [theme, setTheme] = React.useState(
		createTheme({
			palette: {
				mode: 'light', // Default to 'light' mode
				// You can customize other palette settings here
			},
		})
	);

	// Use useEffect to watch for changes in the theme preference in local storage
	useEffect(() => {
		// Update the theme based on the stored preference
		setTheme(
			createTheme({
				palette: {
					mode: them === 'dark' ? 'dark' : 'light',
					// Add other palette settings here
				},
			})
		);
	}, [them]);

	const { data, isLoading, isSuccess, isError, error } = useGetWithdrawsQuery();
	const { withdraws } = data || [];
	const [selectedTab, setSelectedTab] = useState('all');

	// Filter deposits based on selected tab's criteria
	const filteredWithdraws = withdraws?.filter((deposit: Withdraw) => {
		if (selectedTab === 'all') return true;
		if (selectedTab === 'new') return deposit.status === 'pending';
		if (selectedTab === 'approve') return deposit.status === 'approved';
		if (selectedTab === 'rejected') return deposit.status === 'rejected';
		return true;
	});

	// Calculate total deposit amount based on the selected tab's criteria
	const totalAmount = filteredWithdraws?.reduce((total: any, withdraw: any) => {
		return total + withdraw.amount;
	}, 0);

	const columns: GridColDef<any>[] = [
		{
			field: 'date',
			headerName: 'Created At',
			width: 130,
			renderCell: (params: any) => (
				<div className='flex items-center gap-2 text-xs'>
					<p>{params.row.date}</p>
				</div>
			),
		},

		{
			field: 'customer_id',
			headerName: 'Customer ID',
			width: 130,
			renderCell: (params: any) => (
				<div className='flex items-center gap-2 text-xs'>
					<p>{params.row.customer_id}</p>
				</div>
			),
		},
		{
			field: 'name',
			headerName: 'Name',
			width: 200,
			renderCell: (params: any) => (
				<div className='flex items-center gap-2 text-xs'>
					<p>{params.row.name}</p>
				</div>
			),
		},
		{
			field: 'method',
			headerName: 'Method',
			width: 150,
			renderCell: (params: any) => (
				<div className='flex items-center gap-2 text-xs'>
					<p>{params.row.method.name}</p>
				</div>
			),
		},

		{
			field: 'amount',
			headerName: 'Amount',
			width: 130,
			renderCell: (params: any) => (
				<div className='flex items-center gap-2 text-xs'>
					<p>
						{Number(params.row.amount).toLocaleString('en-US', {
							style: 'currency',
							currency: 'USD',
						})}
					</p>
				</div>
			),
		},

		{
			field: 'status',
			headerName: 'Status',
			width: 150,
			renderCell: (params: any) => {
				return (
					<div className='flex items-center'>
						{params.row.status === 'pending' && (
							<p className='text-warning '>
								<span>Pending</span>
							</p>
						)}
						{params.row.status === 'approved' && (
							<p className='text-success '>
								<span>Approved</span>
							</p>
						)}

						{params.row.status === 'rejected' && (
							<p className='text-danger '>
								<span>Rejected</span>
							</p>
						)}
					</div>
				);
			},
		},
		{
			field: 'action',
			headerName: 'Action',
			width: 60,
			renderCell: (params: any) => {
				return (
					<div
						className='d-flex align-items-center justify-content-center w-100'
						style={{ cursor: 'pointer' }}
					>
						<Link href={`/withdraw/${params.row.id}`} passHref>
							<AiFillEye className='text-2xl text-primary' />
						</Link>
					</div>
				);
			},
		},
	];

	const rows: any = [];

	withdraws &&
		filteredWithdraws?.map((withdraw: any) => {
			return rows.unshift({
				id: withdraw._id,
				name: withdraw.username,
				customer_id: withdraw.customer_id,
				amount: withdraw.amount,
				status: withdraw.status,
				method: withdraw.method,
				date: formatDate(withdraw.createdAt),
			});
		});
	return (
		<div>
			{isLoading ? (
				<div className='flex items-center justify-center '>
					<SyncLoader color='#EAB308' size={10} />
				</div>
			) : (
				<ThemeProvider theme={theme}>
					<DataGrid
						rows={rows}
						columns={columns}
						sx={{
							boxShadow: 2,
							border: 2,
						}}
					/>
				</ThemeProvider>
			)}
		</div>
	);
};

export default Withdraw;
