'use client';
import {
	useDeduceMoneyMutation,
	useFindUserByEmailOrUsernameMutation,
} from '@/redux/features/admin/adminUsersApi';
import { toast } from 'react-toastify';
import { fetchBaseQueryError } from '@/redux/helpers';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { PulseLoader } from 'react-spinners';

const DeductMoney = () => {
	const [selectedWallet, setSelectedWallet] = React.useState('company');
	const [selectedCompany, setSelectedCompany] = React.useState('coin');
	const [amount, setAmount] = React.useState<string>('');
	const [username, setUsername] = React.useState('');
	const [emailOrUsername, setEmailOrUsername] = useState('');
	const [errorText, setErrorText] = useState<string>('');
	const [findUser, setFindUser] = useState(false);
	const [recipient, setRecipient] = useState<any>({});
	const [description, setDescription] = useState<string>('');

	const [
		findUserByEmailOrUsername,
		{ data, isLoading, isError, isSuccess, error },
	] = useFindUserByEmailOrUsernameMutation();
	const { user } = data || {};

	// for adding money to company wallet
	const [
		deduceMoney,
		{
			isLoading: a_isLoading,
			isSuccess: a_isSuccess,
			isError: a_isError,
			error: a_error,
		},
	] = useDeduceMoneyMutation();

	// handle change
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target;
		setEmailOrUsername(value);
		setErrorText('');
	};

	// handle find user
	const handleFindUser = () => {
		if (!emailOrUsername) {
			setErrorText('Email or Username is required');
			return;
		}

		findUserByEmailOrUsername(emailOrUsername);
	};

	useEffect(() => {
		if (isSuccess) {
			setFindUser(true);
			setEmailOrUsername('');
			setErrorText('');
			setRecipient(user);
		}

		if (isError) {
			toast.error((error as fetchBaseQueryError).data?.message);
			setErrorText((error as fetchBaseQueryError).data?.message);
		}
	}, [isSuccess, isError, error, user]);

	// handle submit
	const handleSubmit = () => {
		if (!amount) {
			toast.error('Amount is required');
			return;
		}
		let data = {
			wallet: selectedWallet,
			wallet_type: selectedCompany,
			amount: Number(amount),
			recipient_id: recipient?._id,
		};
		deduceMoney(data);
		console.log('data', data);
	};

	useEffect(() => {
		if (a_isSuccess) {
			toast.success('Money added successfully');
			setAmount('');
			setSelectedWallet('company');
			setSelectedCompany('coin');
			setFindUser(false);
			setRecipient({});
		}

		if (a_isError) {
			toast.error((a_error as fetchBaseQueryError).data?.message);
		}
	}, [a_isSuccess, a_isError, a_error]);

	return (
		<div>
			{/* <ECommerce /> */}
			<div className='w-full px-4 mx-auto mt-10 md:w-8/12'>
				<div className='bg-white border rounded-sm border-stroke shadow-default dark:border-strokedark dark:bg-boxdark'>
					<div className='border-b rounded-lg border-stroke py-4 px-6.5 dark:border-strokedark'>
						<h3 className='text-xl font-bold text-center text-black dark:text-white'>
							Deduct Money from Wallet
						</h3>
						{/* Select a wallet Company or user */}
						<div>
							<label className='mb-2.5 block text-black dark:text-white'>
								Select a wallet Company or user
							</label>
							<select
								className='w-full px-4 py-2.5 border rounded-lg border-stroke dark:border-strokedark'
								name='wallet'
								id='wallet'
								value={selectedWallet}
								onChange={(e) => setSelectedWallet(e.target.value)}
							>
								<option value=''>Select a wallet Company or user</option>
								<option value='company'>Company Wallet</option>
								<option value='user'>Wallet User</option>
							</select>
						</div>
						{/*Start Company option */}
						{selectedWallet === 'company' && (
							<div className='mt-4'>
								<label className='mb-2.5 block text-black dark:text-white'>
									Select a Company Wallet
								</label>
								<select
									className='w-full px-4 py-2.5 border rounded-lg border-stroke dark:border-strokedark'
									name='company'
									id='company'
									value={selectedCompany}
									onChange={(e) => setSelectedCompany(e.target.value)}
								>
									<option value=''>Select a Company Wallet</option>
									<option value='coin'>Coin Value</option>
									<option value='rank'>Rank Value</option>
									<option value='tour'>Tour Fund</option>
									<option value='extra'>Extra</option>
								</select>
							</div>
						)}
						{/*End Company option */}
						{/*Start User option */}
						{selectedWallet === 'user' && (
							<div className='mt-4'>
								<label className='mb-2.5 block text-black dark:text-white'>
									Search User by Username
								</label>

								<div className='relative'>
									<input
										type='text'
										className='w-full px-4 py-2.5 border rounded-lg border-stroke dark:border-strokedark '
										placeholder='Username'
										value={emailOrUsername}
										onChange={(e) => handleChange(e)}
									/>
									{errorText && (
										<small className='text-xs text-red-500'>{errorText}</small>
									)}
									<button
										className='absolute top-0 right-0 px-4 py-2.5 border bg-gray-500 rounded-r-lg border-stroke dark:border-strokedark disabled:opacity-50 disabled:cursor-not-allowed'
										onClick={handleFindUser}
										disabled={isLoading || !emailOrUsername}
									>
										{isLoading ? (
											<div className='flex items-center justify-center '>
												<PulseLoader color='white' size={10} />
											</div>
										) : (
											'Get User'
										)}
									</button>
								</div>
								{/* <!-- Contact Info --> */}
								{findUser && (
									<div className='p-4 bg-transparent border rounded-sm border-stroke mt-2 '>
										<div className='border-b border-stroke py-4 px-6.5 '>
											<h3 className='font-medium text-gray-100'>
												Recipient Information
											</h3>
										</div>
										<div className='my-2 space-y-2 list-none '>
											<li className='flex items-center justify-between '>
												<p>Name</p>
												<p className='text-gray-500 '>{recipient?.full_name}</p>
											</li>
											<li className='flex items-center justify-between '>
												<p>Email</p>
												<p className='text-gray-500 '>{recipient?.email}</p>
											</li>
											<li className='flex items-center justify-between '>
												<p>Phone</p>
												<p className='text-gray-500 '>{recipient?.phone}</p>
											</li>
										</div>
										<hr className='my-3' />
									</div>
								)}
							</div>
						)}
						{/*End User option */}
						{/* Amount */}
						<div className='mt-4'>
							<label className='mb-2.5 block text-black dark:text-white'>
								Amount
							</label>
							<input
								type='number'
								className='w-full px-4 py-2.5 border rounded-lg border-stroke dark:border-strokedark'
								placeholder='Amount'
								value={amount}
								onChange={(e) => setAmount(e.target.value)}
							/>
						</div>

						{/* Start Description */}
						<div className='mt-4'>
							<label className='mb-2.5 block text-black dark:text-white'>
								Description
							</label>
							<textarea
								className='w-full px-4 py-2.5 border rounded-lg border-stroke dark:border-strokedark'
								placeholder='Description'
								value={description}
								onChange={(e) => setDescription(e.target.value)}
							/>
						</div>
						{/* End Description */}

						{/* <!-- Buttons --> */}
						<div className='flex justify-center mt-6 space-x-4'>
							<button
								className='flex items-center text-white justify-center w-full px-4 py-2.5 border bg-primary rounded-lg border-stroke dark:border-strokedark
							disabled:opacity-50 disabled:cursor-not-allowed
							'
								disabled={isLoading || !amount}
								onClick={handleSubmit}
							>
								{isLoading ? (
									<div className='flex items-center justify-center '>
										<PulseLoader color='white' size={10} />
									</div>
								) : (
									'Deduct Money'
								)}
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default DeductMoney;
