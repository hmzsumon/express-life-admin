'use client';
import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { toast } from 'react-toastify';

import { formatDate, formDateWithTime } from '@/lib/functions';

import CopyToClipboard from '@/lib/CopyToClipboard';
import {
	useApproveWithdrawMutation,
	useGetWithdrawByIdQuery,
	useRejectWithdrawMutation,
} from '@/redux/features/withdraw/withdrawApi';
import { useRejectDepositMutation } from '@/redux/features/deposit/depositApi';
import { fetchBaseQueryError } from '@/redux/helpers';
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Modal,
} from '@mui/material';
import { useRouter } from 'next/navigation';

const Withdraw = ({ params }: { params: { id: string } }) => {
	const router = useRouter();
	const id = params.id;

	const { data, isLoading, isSuccess, isError, error } =
		useGetWithdrawByIdQuery(id as string, {
			skip: !id,
		});
	const { withdraw } = data || {};
	console.log(withdraw);
	const {
		amount,
		net_amount,
		charge,
		customer_id,
		is_approved,
		is_rejected,
		username,
		full_name,
		phone,
		status,
		transactionId,
		user_id,
		_id,
		method,
	} = withdraw || {};

	const [reason, setReason] = useState('Transaction Id not matching');
	const [tnxId, setTnxId] = useState('');
	const [open, setOpen] = React.useState(false);
	const [open2, setOpen2] = React.useState(false);

	const handleClickOpen = () => {
		setOpen(true);
	};
	const handleClickOpen2 = () => {
		setOpen2(true);
	};

	const handleClose = () => {
		setOpen(false);
	};
	const handleClose2 = () => {
		setOpen2(false);
	};

	const [
		approveWithdraw,
		{
			isLoading: a_isLoading,
			isError: a_isError,
			isSuccess: a_isSuccess,
			error: a_error,
		},
	] = useApproveWithdrawMutation();

	const [
		rejectWithdraw,
		{
			isSuccess: r_isSuccess,
			isError: r_isError,
			error: r_error,
			isLoading: r_isLoading,
		},
	] = useRejectWithdrawMutation();

	// approve handler
	const handleApprove = async () => {
		const data = {
			id: _id,
			tnxId,
		};
		approveWithdraw(data);
	};

	useEffect(() => {
		if (a_isSuccess) {
			handleClose();
			toast.success('Withdraw approved successfully');
			router.push('/withdraw');
		}

		if (a_isError && a_error) {
			toast.error((a_error as fetchBaseQueryError).data?.message);
		}
	}, [a_isSuccess, a_isError, a_error, router]);

	// reject handler
	const handleReject = async () => {
		const data = {
			id: _id,
			reason,
		};
		rejectWithdraw(data);
	};

	useEffect(() => {
		if (r_isSuccess) {
			toast.success('Withdraw rejected successfully');
			router.push('/withdraw');
		}

		if (r_isError && r_error) {
			toast.error((r_error as fetchBaseQueryError).data?.message);
		}
	}, [r_isSuccess, r_isError, r_error, router]);

	return (
		<div>
			<div>
				<p className='text-center '>
					<span
						className={`text-capitalize ${
							status === 'pending' && 'text-warning'
						} ${status === 'approved' && 'text-success'} ${
							status === 'rejected' && 'text-danger'
						} `}
					>
						{withdraw?.status}
					</span>{' '}
					Withdraw Details
				</p>
				<div className=' list-none'>
					<li className=' flex items-center justify-between'>
						<span>User name</span>
						<span className='float-end'>{username}</span>
					</li>
					<li className=' flex items-center justify-between'>
						<span>User Id</span>
						<span className='float-end'>{customer_id}</span>
					</li>
					<li className=' flex items-center justify-between'>
						<span>Phone</span>
						<span className='float-end'>{phone}</span>
					</li>
					<li className=' flex items-center justify-between'>
						<span>Amount</span>
						<span className='float-end'>
							{Number(amount).toLocaleString('en-US', {
								style: 'currency',
								currency: 'USD',
							})}
						</span>
					</li>
					<li className=' flex items-center justify-between'>
						<span>Charge</span>
						<span className='float-end '>
							{Number(charge).toLocaleString('en-US', {
								style: 'currency',
								currency: 'USD',
							})}
						</span>
					</li>
					<li className=' flex items-center justify-between'>
						<span>Net Amount</span>
						<span className='gap-1  text-danger flex '>
							{Number(net_amount).toLocaleString('en-US', {
								style: 'currency',
								currency: 'USD',
							})}
							<CopyToClipboard text={net_amount} />
						</span>
					</li>
					{method?.name === 'crypto' && (
						<>
							<li className=' flex items-center justify-between'>
								<span>Network</span>
								<span className='float-end'>{method?.network}</span>
							</li>
							<li className=' flex items-center justify-between'>
								<span>Address</span>
								<span className='gap-1 float-end d-flex'>
									{method?.address}
									<CopyToClipboard text={method?.address} />
								</span>
							</li>
						</>
					)}

					<li className=' flex items-center justify-between'>
						<span>Date Time</span>
						<span className='float-end '>
							{new Date(withdraw?.createdAt).toLocaleDateString('en-US', {
								year: 'numeric',
								month: 'short',
								day: 'numeric',
								hour: 'numeric',
								minute: 'numeric',
							})}
						</span>
					</li>

					{method?.name === 'binance' && (
						<>
							<li className=' flex items-center justify-between'>
								<span>Binance Pay ID</span>
								<span className='gap-1  flex'>
									{method?.pay_id}
									<CopyToClipboard text={method?.pay_id} />
								</span>
							</li>

							<li className=' flex items-center justify-between'>
								<span>Binance ID</span>
								<span className='gap-1  flex'>
									{method?.binance_id}
									<CopyToClipboard text={method?.binance_id} />
								</span>
							</li>
						</>
					)}
					{status === 'pending' && (
						<div className='gap-2 mt-2 grid'>
							<button
								className='inline-flex items-center justify-center rounded-md bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10'
								onClick={handleClickOpen}
							>
								<span>Approve</span>
							</button>{' '}
							<button
								className='inline-flex items-center justify-center rounded-md bg-red-500 py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10'
								onClick={handleClickOpen2}
							>
								<span>Reject</span>
							</button>{' '}
						</div>
					)}
				</div>
			</div>

			<>
				<div>
					<Dialog
						open={open}
						onClose={handleClose}
						aria-labelledby='alert-dialog-title'
						aria-describedby='alert-dialog-description'
					>
						<DialogTitle id='alert-dialog-title'>
							{'Approve Withdraw'}
						</DialogTitle>
						<DialogContent>
							<DialogContentText id='alert-dialog-description'>
								<div>
									<p className=' text-warning'>
										Are you sure you want to approve this withdraw?
									</p>
									<div className=' flex flex-col'>
										<label htmlFor='basic-url'>
											<span>Enter Transaction id</span>
										</label>
										<input
											className='w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-white'
											placeholder='Enter Transaction id'
											aria-label='Username'
											aria-describedby='basic-addon1'
											value={tnxId}
											onChange={(e) => setTnxId(e.target.value)}
										/>
									</div>
								</div>
							</DialogContentText>
						</DialogContent>
						<DialogActions>
							<Button onClick={handleClose}>Close</Button>
							<Button onClick={handleApprove} disabled={tnxId === ''}>
								Approve
							</Button>
						</DialogActions>
					</Dialog>
				</div>
			</>
			{/* for reject */}
			<>
				<div>
					<Dialog
						open={open2}
						onClose={handleClose2}
						aria-labelledby='alert-dialog-title'
						aria-describedby='alert-dialog-description'
					>
						<DialogTitle id='alert-dialog-title'>
							{'Reject Withdraw'}
						</DialogTitle>
						<DialogContent>
							<DialogContentText id='alert-dialog-description'>
								<div>
									<p className=' text-warning'>
										Are you sure you want to Reject this Withdraw?
									</p>
									<div className=' flex flex-col'>
										<label htmlFor='basic-url'>
											<span>Enter Reason</span>
										</label>
										<input
											className='w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-white'
											placeholder='Enter Reason'
											aria-label='Username'
											aria-describedby='basic-addon1'
											value={reason}
											onChange={(e) => setReason(e.target.value)}
										/>
									</div>
								</div>
							</DialogContentText>
						</DialogContent>
						<DialogActions>
							<Button onClick={handleClose2}>Close</Button>
							<Button onClick={handleReject} disabled={reason === ''}>
								Reject
							</Button>
						</DialogActions>
					</Dialog>
				</div>
			</>
		</div>
	);
};

export default Withdraw;
