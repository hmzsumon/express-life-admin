'use client';
import React, { useEffect, useState } from 'react';
import { useGetOwnersQuery } from '@/redux/features/owner/ownerApi';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useGetDepositsQuery } from '@/redux/features/deposit/depositApi';
import Link from 'next/link';
import { formatDate } from '@/lib/functions';
import { AiFillEye } from 'react-icons/ai';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { SyncLoader } from 'react-spinners';
import { useSelector } from 'react-redux';
import { FaExternalLinkAlt } from 'react-icons/fa';

type Owner = {
	_id: string;
	full_name: string;
	username: string;
	email: string;
	phone: string;
	customer_id: string;
	m_balance: number;
	total_o_amount: number;
	total_deposit_received: number;
	allow_to_deposit: boolean;
};

const OwnerList = () => {
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

	const { data, isLoading } = useGetOwnersQuery();
	const { owners } = data || {};

	const columns: GridColDef<any>[] = [
		{
			field: 'full_name',
			headerName: 'Full Name',
			width: 180,
			renderCell: (params: any) => (
				<div className='flex items-center gap-2 text-xs'>
					<p>{params.row.full_name}</p>
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
			field: 'email',
			headerName: 'Email',
			width: 200,
			renderCell: (params: any) => (
				<div className='flex items-center gap-2 text-xs'>
					<p>{params.row.email}</p>
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
			field: 'reserved',
			headerName: 'Reserved',
			width: 130,
			renderCell: (params: any) => (
				<div className='flex items-center gap-2 text-xs'>
					<p>
						{Number(params.row.reserved).toLocaleString('en-US', {
							style: 'currency',
							currency: 'USD',
						})}
					</p>
				</div>
			),
		},
		{
			field: 'deposit',
			headerName: 'Deposit Amount',
			width: 130,
			renderCell: (params: any) => (
				<div className='flex items-center gap-2 text-xs'>
					<p>
						{Number(params.row.deposit).toLocaleString('en-US', {
							style: 'currency',
							currency: 'USD',
						})}
					</p>
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

	owners &&
		owners.map((owner: Owner) => {
			return rows.unshift({
				id: owner._id,
				full_name: owner.full_name,
				username: owner.username,
				email: owner.email,
				phone: owner.phone,
				customer_id: owner.customer_id,
				balance: owner.m_balance,
				reserved: owner.total_o_amount,
				deposit: owner.total_deposit_received,
				allow_to_deposit: owner.allow_to_deposit,
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

export default OwnerList;
