'use client';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Image from 'next/image';
import Link from 'next/link';
import { setEmail } from '@/redux/features/auth/authSlice';
import { useCheckUserByEmailMutation } from '@/redux/features/auth/authApi';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
const ForgotPassword = () => {
	const [email, setEmail] = useState<string>('');
	const [errorText, setErrorText] = useState<string>('');
	const [stateError, setStateError] = useState<boolean>(false);
	const [next, setNext] = useState<boolean>(false);
	const dispatch = useDispatch();
	const [checkUserByEmail, { data, isLoading, isError, error, isSuccess }] =
		useCheckUserByEmailMutation();
	const router = useRouter();

	// handle check user
	const handleCheckUser = () => {
		if (!email) {
			setStateError(true);
			setErrorText('Please enter your email');
			return;
		}
		checkUserByEmail({ email: email });
	};

	// handle change
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setEmail(e.target.value);
		setStateError(false);
	};

	useEffect(() => {
		if (isError) {
			setStateError(true);
			setErrorText(
				'User does not exist. Please try again or create a new account.'
			);
		}

		if (isSuccess) {
			router.push(`/security-verification?email=${email}`);
		}
	}, [isError, isSuccess, email, router]);

	return (
		<>
			<div className='px-2 py-2 '>
				<Link href='/'>
					<Image src='/images/logo/logo.png' alt='WFC' width={60} height={10} />
				</Link>
			</div>
			<div className=' px-4 md:w-6/12 mx-auto mt-20'>
				<div className='p-4 bg-white border rounded-sm border-stroke shadow-default dark:border-strokedark dark:bg-boxdark'>
					<h1 className='text-2xl font-bold  '>Reset Your Password</h1>

					<div className='my-8'>
						<div className='space-y-4  '>
							<div className='flex flex-col gap-1'>
								<label className='text-sm font-semibold text-gray-400 '>
									Enter Your Email
								</label>
								<input
									className={`px-4 py-2 bg-transparent border rounded hover:border-yellow-700 focus:border-yellow-700 ${
										stateError && 'border-red-500'
									} `}
									type='text'
									value={email}
									onChange={(e) => handleChange(e)}
								/>
								{stateError && (
									<small className='text-xs text-red-500'>{errorText}</small>
								)}
							</div>

							<div className='my-6 space-y-4'>
								<button
									className='flex justify-center w-full p-3 font-medium rounded bg-primary text-gray'
									onClick={handleCheckUser}
								>
									Next
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default ForgotPassword;
