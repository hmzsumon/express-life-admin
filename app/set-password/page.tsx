'use client';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Image from 'next/image';
import Link from 'next/link';
import { useCreatePasswordMutation } from '@/redux/features/auth/authApi';
import { fetchBaseQueryError } from '@/redux/helpers';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';

const SetPassword = () => {
	const { email } = useSelector((state: any) => state.auth);
	const [createPassword, { data, isSuccess, isLoading, isError, error }] =
		useCreatePasswordMutation();
	const router = useRouter();
	const [password, setPassword] = useState<string>('');
	const [confirmPassword, setConfirmPassword] = useState<string>('');
	const [showPassword, setShowPassword] = useState<boolean>(false);
	const [passwordError, setPasswordError] = useState<boolean>(false);
	const [confirmPasswordError, setConfirmPasswordError] =
		useState<boolean>(false);
	const [errorText, setErrorText] = useState<string>('');

	// handle show password
	const handleShowPassword = () => {
		setShowPassword(!showPassword);
	};

	// submit form
	const handleSubmit = (e: { preventDefault: () => void }) => {
		e.preventDefault();
		// validate password
		if (password.length < 6) {
			setPasswordError(true);
			setErrorText('Password must be at least 6 characters ');
			return;
		} else {
			setPasswordError(false);
		}

		if (password !== confirmPassword) {
			setConfirmPasswordError(true);
			setErrorText('Passwords do not match');
			return;
		}

		createPassword({ password, email });
	};

	// handle password change
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		if (name === 'password') {
			setPassword(value);
			setPasswordError(false);
		}
		if (name === 'confirmPassword') {
			setConfirmPassword(value);
			setConfirmPasswordError(false);
		}
	};

	useEffect(() => {
		if (isError) {
			toast.error((error as fetchBaseQueryError).data.message);
		}
		if (isSuccess) {
			toast.success('Password created successfully');
			router.push('/');
		}
	}, [isSuccess, isError, error, router]);

	return (
		<>
			<div className='px-2 py-2 '>
				<Link href='/'>
					<Image src='/images/logo/logo.png' alt='WFC' width={60} height={10} />
				</Link>
			</div>
			<div className='px-4 mt-8 md:w-6/12 mx-auto'>
				<div className='p-4 bg-white border rounded-sm border-stroke shadow-default dark:border-strokedark dark:bg-boxdark'>
					<h1 className='text-2xl font-bold '>Set Password</h1>
					<div className='my-8'>
						<form onSubmit={handleSubmit}>
							<div className='space-y-4'>
								<div className='relative flex flex-col gap-1'>
									<label
										className={`
									text-sm font-semibold  ${passwordError && 'text-red-500'}
								`}
									>
										Password
									</label>
									<input
										className={`px-4 py-2 bg-transparent border rounded ${
											passwordError && 'border-red-500'
										}`}
										type={showPassword ? 'text' : 'password'}
										name='password'
										value={password}
										onChange={handleChange}
									/>
									<span
										className='absolute right-0 flex items-center px-4 text-gray-600 top-[34px]'
										onClick={handleShowPassword}
									>
										{showPassword ? (
											<svg
												xmlns='http://www.w3.org/2000/svg'
												fill='none'
												viewBox='0 0 24 24'
												strokeWidth={1.5}
												stroke='currentColor'
												className='w-5 h-5'
											>
												<path
													strokeLinecap='round'
													strokeLinejoin='round'
													d='M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88'
												/>
											</svg>
										) : (
											<svg
												xmlns='http://www.w3.org/2000/svg'
												fill='none'
												viewBox='0 0 24 24'
												strokeWidth={1.5}
												stroke='currentColor'
												className='w-5 h-5'
											>
												<path
													strokeLinecap='round'
													strokeLinejoin='round'
													d='M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z'
												/>
												<path
													strokeLinecap='round'
													strokeLinejoin='round'
													d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
												/>
											</svg>
										)}
									</span>
									{passwordError && (
										<small className='text-xs text-red-500'>{errorText}</small>
									)}
								</div>

								<div className='relative flex flex-col gap-1'>
									<label
										className={`
									text-sm font-semibold ${confirmPasswordError && 'text-red-500'}
								`}
									>
										Confirm Password
									</label>
									<input
										className={`px-4 py-2 bg-transparent border rounded ${
											confirmPasswordError && 'border-red-500'
										}`}
										type={showPassword ? 'text' : 'password'}
										name='confirmPassword'
										value={confirmPassword}
										onChange={handleChange}
									/>
									<span
										className='absolute right-0 flex items-center px-4 text-gray-600 top-[34px]'
										onClick={handleShowPassword}
									>
										{showPassword ? (
											<svg
												xmlns='http://www.w3.org/2000/svg'
												fill='none'
												viewBox='0 0 24 24'
												strokeWidth={1.5}
												stroke='currentColor'
												className='w-5 h-5'
											>
												<path
													strokeLinecap='round'
													strokeLinejoin='round'
													d='M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88'
												/>
											</svg>
										) : (
											<svg
												xmlns='http://www.w3.org/2000/svg'
												fill='none'
												viewBox='0 0 24 24'
												strokeWidth={1.5}
												stroke='currentColor'
												className='w-5 h-5'
											>
												<path
													strokeLinecap='round'
													strokeLinejoin='round'
													d='M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z'
												/>
												<path
													strokeLinecap='round'
													strokeLinejoin='round'
													d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
												/>
											</svg>
										)}
									</span>
									{confirmPasswordError && (
										<small className='text-xs text-red-500'>{errorText}</small>
									)}
								</div>

								<div className='my-6 space-y-4'>
									<button className='flex justify-center w-full p-3 font-medium rounded bg-primary text-gray'>
										Submit
									</button>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
		</>
	);
};

export default SetPassword;
