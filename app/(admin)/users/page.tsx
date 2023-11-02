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
import { useGetUsersQuery } from '@/redux/features/admin/adminUsersApi';
import { useRouter } from 'next/navigation';

type Deposit = {
	id: string;
	name: string;
	customer_id: string;
	amount: number;
	status: string;
	date: string;
	tnx_id: string;
};

const Users = () => {
	const router = useRouter();
	const { user } = useSelector((state: any) => state.auth);
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

	// check if user is admin or not and redirect to dashboard
	useEffect(() => {
		if (user?.role !== 'admin') {
			router.push('/dashboard');
		}
	}, [user, router]);

	const { data, isLoading, isSuccess, isError, error } = useGetUsersQuery();
	const { users } = data || [];
	const [selectedTab, setSelectedTab] = useState('all');

	// filter all is_active users
	const activeUsers = users?.filter((user: any) => user.is_active === true);

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
			field: 'username',
			headerName: 'Username',
			width: 130,
			renderCell: (params: any) => (
				<div className='flex items-center gap-2 text-xs'>
					<p>{params.row.username}</p>
				</div>
			),
		},

		{
			field: 'balance',
			headerName: 'Balance',
			width: 130,
			renderCell: (params: any) => (
				<div className='flex items-center gap-2 text-xs'>
					<p>
						{Number(params.row.balance).toLocaleString('en-US', {
							style: 'currency',
							currency: 'USD',
						})}
					</p>
				</div>
			),
		},
		{
			field: 'phone',
			headerName: 'Phone Number',
			width: 150,
			renderCell: (params: any) => (
				<div className='flex items-center gap-2 text-xs'>
					<p>{params.row.phone}</p>
				</div>
			),
		},

		{
			field: 'country',
			headerName: 'Country',
			width: 150,
			renderCell: (params: any) => (
				<div className='flex items-center gap-2 text-xs'>
					<p>{params.row.country}</p>
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
						{params.row.status === true && (
							<p className='text-success '>
								<span>Active</span>
							</p>
						)}

						{params.row.status === false && (
							<p className='text-danger '>
								<span>Not Active</span>
							</p>
						)}
					</div>
				);
			},
		},
		{
			field: 'refer_by',
			headerName: 'Refer By',
			width: 150,
			renderCell: (params: any) => (
				<div className='flex items-center gap-2 text-xs'>
					<p>{params.row.refer_by}</p>
				</div>
			),
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
						<Link href={`/deposit/${params.row.id}`} passHref>
							<AiFillEye className='text-2xl text-primary' />
						</Link>
					</div>
				);
			},
		},
	];

	const rows: any = [];

	users &&
		users.map((user: any) => {
			return rows.unshift({
				id: user._id,
				customer_id: user.customer_id,
				username: user.username,
				balance: user.m_balance,
				phone: user.phone,
				country: user.country,
				status: user.is_active,
				date: formatDate(user.createdAt),
				tnx_id: user.transactionId,
				approved_by: user.approved_by,
				refer_by: user?.sponsor?.username,
			});
		});
	return (
		<div>
			{isLoading ? (
				<div className='flex items-center justify-center '>
					<SyncLoader color='#EAB308' size={10} />
				</div>
			) : (
				<>
					<div className='my-10 '>
						{/* <!-- Alerts Item --> */}
						<div className='flex w-full bg-opacity-[15%] px-7 py-8 shadow-md dark:bg-[#1B1B24] dark:bg-opacity-30 md:p-9'>
							<div className='flex items-center justify-between gap-4 '>
								<li className='flex items-center gap-2 list-none '>
									<h3 className='font-semibold text-gray-800 dark:text-white'>
										Total Users
									</h3>
									<p>{users?.length} </p>
								</li>

								<li className='flex items-center gap-2 list-none '>
									<h3 className='font-semibold text-gray-800 dark:text-white'>
										Active Users
									</h3>
									<p>{activeUsers?.length} </p>
								</li>
							</div>
						</div>
						{/* <!-- Alerts Item --> */}
					</div>

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
				</>
			)}
		</div>
	);
};

export default Users;
