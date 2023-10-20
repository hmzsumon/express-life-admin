'use client';
import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { toast } from 'react-toastify';

import { formatDate, formDateWithTime } from '@/lib/functions';

import CopyToClipboard from '@/lib/CopyToClipboard';
import {
	useApproveWithdrawMutation,
	useGetWithdrawByIdQuery,
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

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
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
			router.push('/withdraws');
		}

		if (a_isError && a_error) {
			toast.error((a_error as fetchBaseQueryError).data?.message);
		}
	}, [a_isSuccess, a_isError]);

	// reject handler
	const handleReject = async () => {
		const data = {
			id: _id,
			reason,
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
	}, [r_isSuccess, r_isError]);

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

					<li>
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
								onClick={handleClickOpen}
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
							{'Approve Deposit'}
						</DialogTitle>
						<DialogContent>
							<DialogContentText id='alert-dialog-description'>
								<div>
									<p className=' text-warning'>
										Are you sure you want to approve this deposit?
									</p>
									<div className=' flex flex-col'>
										<label htmlFor='basic-url'>
											<span>Enter Transaction id</span>
										</label>
										<input
											className='w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
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
				{/* <Modal show={show2} onHide={handleClose2} animation={false}>
					<Modal.Header closeButton>
						<Modal.Title>
							<span>Reject Deposit</span>
						</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<p className=' text-warning'>
							Are you sure you want to reject this deposit?
						</p>
						<div>
							<Form.Label htmlFor='basic-url'>
								<span>Enter reason for rejection</span>
							</Form.Label>
							<Form.Control
								placeholder='Enter reason for rejection'
								aria-label='Username'
								aria-describedby='basic-addon1'
								value={reason}
								onChange={(e) => setReason(e.target.value)}
							/>
						</div>
					</Modal.Body>
					<Modal.Footer>
						<Button variant='secondary' onClick={handleClose2}>
							Close
						</Button>
						<Button variant='danger' onClick={handleReject}>
							Confirm Reject
						</Button>
					</Modal.Footer>
				</Modal> */}
			</>
		</div>
	);
};

export default Withdraw;
