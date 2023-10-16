'use client';
import {
	useApproveDepositMutation,
	useGetDepositByIdQuery,
	useRejectDepositMutation,
} from '@/redux/features/deposit/depositApi';
import { fetchBaseQueryError } from '@/redux/helpers';
import { toast } from 'react-toastify';

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
		customer_id,
		is_approved,
		is_rejected,
		name,
		phone,
		status,
		transactionId,
		user_id,
		_id,
	} = deposit || {};

	const [reason, setReason] = useState('Transaction Id not matching');
	const [show, setShow] = useState(false);
	const [showReject, setShowReject] = useState(false);
	const [showApprove, setShowApprove] = useState(false);

	const handleClose = () => {
		setShow(false);
		setShowApprove(false);
		setShowReject(false);
	};
	const handleShow = (item: any) => {
		setShow(true);
		if (item === 'approve') {
			setShowApprove(true);
		} else if (item === 'reject') {
			setShowReject(true);
		}
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
			setShow(false);
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
			reason: 'Transaction Id not matching',
		};
		rejectDeposit(data);
	};

	useEffect(() => {
		if (r_isSuccess) {
			setShow(false);
			toast.success('Deposit rejected successfully');
			router.push('/deposit');
		}

		if (r_isError && r_error) {
			toast.error((r_error as fetchBaseQueryError).data?.message);
		}
	}, [r_isSuccess, r_isError, r_error, router]);

	return (
		<div>
			{/* <!-- Alerts Item --> */}
			{show && (
				<div className='my-4 '>
					<div className='flex w-full border-l-6 border-warning bg-warning bg-opacity-[15%] px-7 py-4 shadow-md dark:bg-[#1b1b24c4] dark:bg-opacity-30 md:p-9'>
						<div className='flex items-center justify-center mr-5 rounded-lg h-9 w-9 bg-warning bg-opacity-30'>
							<svg
								width='19'
								height='16'
								viewBox='0 0 19 16'
								fill='none'
								xmlns='http://www.w3.org/2000/svg'
							>
								<path
									d='M1.50493 16H17.5023C18.6204 16 19.3413 14.9018 18.8354 13.9735L10.8367 0.770573C10.2852 -0.256858 8.70677 -0.256858 8.15528 0.770573L0.156617 13.9735C-0.334072 14.8998 0.386764 16 1.50493 16ZM10.7585 12.9298C10.7585 13.6155 10.2223 14.1433 9.45583 14.1433C8.6894 14.1433 8.15311 13.6155 8.15311 12.9298V12.9015C8.15311 12.2159 8.6894 11.688 9.45583 11.688C10.2223 11.688 10.7585 12.2159 10.7585 12.9015V12.9298ZM8.75236 4.01062H10.2548C10.6674 4.01062 10.9127 4.33826 10.8671 4.75288L10.2071 10.1186C10.1615 10.5049 9.88572 10.7455 9.50142 10.7455C9.11929 10.7455 8.84138 10.5028 8.79579 10.1186L8.13574 4.75288C8.09449 4.33826 8.33984 4.01062 8.75236 4.01062Z'
									fill='#FBBF24'
								></path>
							</svg>
						</div>
						<div className='w-full space-y-4'>
							<div>
								<h5 className='mb-3 text-lg font-semibold text-[#9D5425]'>
									Attention needed
								</h5>
								<p className='leading-relaxed text-[#D0915C]'>
									Are you sure you want to approve or reject this deposit?
								</p>
							</div>
							<div className='flex items-center justify-around '>
								{showApprove && (
									<button
										onClick={handleApprove}
										className='inline-flex items-center justify-center px-10 py-2 font-medium text-center text-white rounded-md bg-primary hover:bg-opacity-90 lg:px-8 xl:px-10'
									>
										<span>Approve</span>
									</button>
								)}
								{showReject && (
									<button
										onClick={handleReject}
										className='px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600'
									>
										<span>Reject</span>
									</button>
								)}
								<button
									onClick={handleClose}
									className='px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600'
								>
									<span>Cancel</span>
								</button>{' '}
							</div>
						</div>
					</div>
				</div>
			)}
			{/* <!-- Alerts Item --> */}
			<div className='px-4 py-1 list-none border text-blue-gray-400 '>
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
						onClick={() => handleShow('approve')}
						className='inline-flex items-center justify-center px-10 py-2 font-medium text-center text-white rounded-md bg-primary hover:bg-opacity-90 lg:px-8 xl:px-10'
					>
						<span>Approve</span>
					</button>{' '}
					<button
						onClick={() => handleShow('reject')}
						className='px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600'
					>
						<span>Reject</span>
					</button>{' '}
				</div>
			)}
		</div>
	);
};

export default Deposit;
