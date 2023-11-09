'use client';
import {
	useApproveDepositMutation,
	useGetDepositByIdQuery,
	useRejectDepositMutation,
} from '@/redux/features/deposit/depositApi';
import { fetchBaseQueryError } from '@/redux/helpers';
import { toast } from 'react-toastify';
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Modal,
} from '@mui/material';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const Deposit = ({ params }: { params: { depositId: string } }) => {
	const router = useRouter();
	const id = params.depositId;
	const { data, isLoading, isSuccess, isError, error } = useGetDepositByIdQuery(
		id as string,
		{
			skip: !id,
		}
	);
	const { deposit } = data || {};
	const {
		amount,
		createdAt,
		updatedAt,
		customer_id,
		name,
		phone,
		status,
		transactionId,
		user_id,
		_id,
	} = deposit || {};

	const [reason, setReason] = useState('Transaction Id not matching');
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
		approveDeposit,
		{
			isLoading: a_isLoading,
			isError: a_isError,
			isSuccess: a_isSuccess,
			error: a_error,
		},
	] = useApproveDepositMutation();

	const [
		rejectDeposit,
		{
			isSuccess: r_isSuccess,
			isError: r_isError,
			error: r_error,
			isLoading: r_isLoading,
		},
	] = useRejectDepositMutation();

	// approve handler
	const handleApprove = async () => {
		approveDeposit(_id);
	};

	useEffect(() => {
		if (a_isSuccess) {
			toast.success('Deposit approved successfully');
			router.push('/deposit');
		}

		if (a_isError && a_error) {
			toast.error((a_error as fetchBaseQueryError).data?.message);
		}
	}, [a_isSuccess, a_isError, a_error, router]);

	// reject handler
	const handleReject = async () => {
		const data = {
			id: _id,
			reason: reason,
		};
		rejectDeposit(data);
	};

	useEffect(() => {
		if (r_isSuccess) {
			toast.success('Deposit rejected successfully');
			router.push('/deposit');
		}

		if (r_isError && r_error) {
			toast.error((r_error as fetchBaseQueryError).data?.message);
		}
	}, [r_isSuccess, r_isError, r_error, router]);

	return (
		<div>
			<div className='px-4 py-1 list-none border text-blue-gray-400 '>
				{/* Name */}
				<div className='grid grid-cols-2'>
					<li> Name</li>
					<li className='text-end'>{name}</li>
				</div>
				{/* Name */}
				<hr className='my-2 ' />

				{/* Amount */}
				<div className='grid grid-cols-2'>
					<li>Amount</li>
					<li className='text-end'>
						{Number(amount).toLocaleString('en-US', {
							style: 'currency',
							currency: 'USD',
						})}
					</li>
				</div>
				{/* Amount */}
				<hr className='my-2 ' />

				{/* transaction Id */}
				<div className='grid grid-cols-2'>
					<li>
						<p className='capitalize'>Transaction ID</p>
					</li>
					<li className='text-end'>{transactionId}</li>
				</div>
				{/* transaction Id */}
				<hr className='my-2 ' />

				{/* Customer Id */}
				<div className='grid grid-cols-2'>
					<li>
						<p className='capitalize'>User ID</p>
					</li>
					<li className='text-end'>{customer_id}</li>
				</div>
				{/* Customer Id */}
				<hr className='my-2 ' />

				{/* Status */}

				<div className='grid grid-cols-2'>
					<li>Status</li>
					<li className='text-end'>
						{status === 'approved' && (
							<p className='capitalize  text-[#388E3C]'>Success</p>
						)}
						{status === 'pending' && (
							<p className='capitalize  text-[#FFA000]'>Pending</p>
						)}
						{status === 'rejected' && (
							<p className='capitalize  text-[#D32F2F]'>Rejected</p>
						)}
					</li>
				</div>
				{/* Status */}
				<hr className='my-2 ' />
				{/* Date */}
				<div className='grid grid-cols-2'>
					<li>Created At</li>
					<li className='text-end'>
						{new Date(createdAt).toLocaleDateString('en-US', {
							year: 'numeric',
							month: 'short',
							day: 'numeric',
							hour: 'numeric',
							minute: 'numeric',
						})}
					</li>
				</div>
				<hr className='my-2 ' />
				<div className='grid grid-cols-2'>
					<li>Updated At</li>
					<li className='text-end'>
						{new Date(updatedAt).toLocaleDateString('en-US', {
							year: 'numeric',
							month: 'short',
							day: 'numeric',
							hour: 'numeric',
							minute: 'numeric',
						})}
					</li>
				</div>
				{/* Date */}
				<hr className='my-2 ' />
				<div className='grid grid-cols-2'>
					<li>
						<p className='capitalize'>Deposit By</p>
					</li>
					<li className='text-end'>{deposit?.method?.username}</li>
				</div>
			</div>
			{status === 'pending' && (
				<div className='grid gap-2 mt-2'>
					<button
						onClick={handleClickOpen}
						className='inline-flex items-center justify-center px-10 py-2 font-medium text-center text-white rounded-md bg-primary hover:bg-opacity-90 lg:px-8 xl:px-10'
					>
						<span>Approve</span>
					</button>{' '}
					<button
						onClick={handleClickOpen2}
						className='px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600'
					>
						<span>Reject</span>
					</button>{' '}
				</div>
			)}
			<>
				<div>
					<Dialog
						open={open}
						onClose={handleClose}
						aria-labelledby='alert-dialog-title'
						aria-describedby='alert-dialog-description'
					>
						<DialogTitle id='alert-dialog-title'>
							{'Approve Deposit'}
						</DialogTitle>
						<DialogContent>
							<DialogContentText id='alert-dialog-description'>
								<div>
									<p className=' text-warning'>
										Are you sure you want to approve this Deposit?
									</p>
								</div>
							</DialogContentText>
						</DialogContent>
						<DialogActions>
							<Button onClick={handleClose}>Close</Button>
							<Button onClick={handleApprove}>Approve</Button>
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
							{'Reject Deposit'}
						</DialogTitle>
						<DialogContent>
							<DialogContentText id='alert-dialog-description'>
								<div>
									<p className=' text-warning'>
										Are you sure you want to Reject this Deposit?
									</p>
									<div className='flex flex-col '>
										<label htmlFor='basic-url'>
											<span>Enter Reason</span>
										</label>
										<input
											className='w-full py-4 pl-6 pr-10 text-white bg-transparent border rounded-lg outline-none border-stroke focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
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

export default Deposit;
