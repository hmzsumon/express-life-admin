'use client';
import React, { useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useGetDepositsQuery } from '@/redux/features/deposit/depositApi';
import Link from 'next/link';
import { formatDate } from '@/lib/functions';
import { AiFillEye } from 'react-icons/ai';
type Deposit = {
	id: string;
	name: string;
	customer_id: string;
	amount: number;
	status: string;
	date: string;
	tnx_id: string;
};
const Deposits = () => {
	const { data, isLoading, isSuccess, isError, error } = useGetDepositsQuery();
	const { deposits } = data || [];
	const [selectedTab, setSelectedTab] = useState('all');
	// Filter deposits based on selected tab's criteria
	const filteredDeposits = deposits?.filter((deposit: Deposit) => {
		if (selectedTab === 'all') return true;
		if (selectedTab === 'new') return deposit.status === 'pending';
		if (selectedTab === 'approve') return deposit.status === 'approved';
		if (selectedTab === 'rejected') return deposit.status === 'rejected';
		return true;
	});
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
			field: 'tnx_id',
			headerName: 'Transaction ID',
			width: 300,
			renderCell: (params: any) => (
				<div className='flex items-center gap-2 text-xs'>
					<p>{params.row.tnx_id}</p>
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
						<Link href={`/deposit/${params.row.id}`} passHref>
							<AiFillEye className='text-2xl text-primary' />
						</Link>
					</div>
				);
			},
		},
	];

	const rows: any = [];

	deposits &&
		filteredDeposits.map((deposit: any) => {
			return rows.unshift({
				id: deposit._id,
				name: deposit.name,
				customer_id: deposit.customer_id,
				amount: deposit.amount,
				status: deposit.status,
				date: formatDate(deposit.createdAt),
				tnx_id: deposit.transactionId,
			});
		});
	return (
		<div>
			<DataGrid
				rows={rows}
				columns={columns}
				sx={{
					boxShadow: 2,
					border: 2,
					borderColor: '#fff',
					'& .MuiDataGrid-cell:hover': {
						color: 'primary.main',
					},
					color: '#fff',
				}}
			/>
		</div>
	);
};

export default Deposits;