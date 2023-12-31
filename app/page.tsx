'use client';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { fetchBaseQueryError } from '@/redux/helpers';
import { useLoginUserMutation } from '@/redux/features/auth/authApi';
import { useRouter } from 'next/navigation';
import { PulseLoader } from 'react-spinners';
import Link from 'next/link';

export default function Home() {
	const router = useRouter();
	const [loginUser, { data, isSuccess, isLoading, isError, error }] =
		useLoginUserMutation();
	const [email, setEmail] = useState<string>('');
	const [emailError, setEmailError] = useState<boolean>(false);
	const [password, setPassword] = useState<string>('');
	const [showPassword, setShowPassword] = useState<boolean>(false);
	const [passwordError, setPasswordError] = useState<boolean>(false);

	// handle show password
	const handleShowPassword = () => {
		setShowPassword(!showPassword);
	};

	// handle change
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		if (name === 'email') {
			setEmail(value);
		}
		if (name === 'password') {
			setPassword(value);
		}
	};

	// submit form
	const handleSubmit = (e: { preventDefault: () => void }) => {
		e.preventDefault();

		if (!email) {
			setEmailError(true);
			return;
		}
		if (!password) {
			setPasswordError(true);
			return;
		}

		loginUser({ email, password });
	};

	useEffect(() => {
		if (isSuccess) {
			toast.success('Login successful');
			router.push('/dashboard');
		}
		if (isError) {
			toast.error((error as fetchBaseQueryError).data?.message);
		}
	}, [isSuccess, isError, error, router]);

	return (
		<div>
			{/* <ECommerce /> */}
			<div className='w-full px-4 mx-auto mt-20 md:w-6/12'>
				<div className='bg-white border rounded-sm border-stroke shadow-default dark:border-strokedark dark:bg-boxdark'>
					<div className='border-b rounded-lg border-stroke py-4 px-6.5 dark:border-strokedark'>
						<h3 className='text-xl font-bold text-center text-black dark:text-white'>
							Sign to Your Account
						</h3>
					</div>
					<form onSubmit={handleSubmit}>
						<div className='p-6.5'>
							<div className='mb-4.5'>
								<label className='mb-2.5 block text-black dark:text-white'>
									Email
								</label>
								<input
									type='email'
									value={email}
									name='email'
									placeholder='Enter your email address'
									className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
									onChange={handleChange}
								/>
							</div>

							<div className='relative '>
								<label className='mb-2.5 block text-black dark:text-white'>
									Password
								</label>
								<input
									type={showPassword ? 'text' : 'password'}
									value={password}
									name='password'
									placeholder='Enter password'
									className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
									onChange={handleChange}
								/>
								<span
									className='absolute right-0 flex items-center px-4 text-gray-600 top-[50px]'
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
							</div>

							<div className='mt-5 mb-5.5 flex items-center justify-between'>
								<label htmlFor='formCheckbox' className='flex cursor-pointer'>
									<div className='relative pt-0.5'>
										<input
											type='checkbox'
											id='formCheckbox'
											className='sr-only taskCheckbox'
										/>
										<div className='flex items-center justify-center w-5 h-5 mr-3 border rounded box border-stroke dark:border-strokedark'>
											<span className='text-white opacity-0'>
												<svg
													className='fill-current'
													width='10'
													height='7'
													viewBox='0 0 10 7'
													fill='none'
													xmlns='http://www.w3.org/2000/svg'
												>
													<path
														fillRule='evenodd'
														clipRule='evenodd'
														d='M9.70685 0.292804C9.89455 0.480344 10 0.734667 10 0.999847C10 1.26503 9.89455 1.51935 9.70685 1.70689L4.70059 6.7072C4.51283 6.89468 4.2582 7 3.9927 7C3.72721 7 3.47258 6.89468 3.28482 6.7072L0.281063 3.70701C0.0986771 3.5184 -0.00224342 3.26578 3.785e-05 3.00357C0.00231912 2.74136 0.10762 2.49053 0.29326 2.30511C0.4789 2.11969 0.730026 2.01451 0.992551 2.01224C1.25508 2.00996 1.50799 2.11076 1.69683 2.29293L3.9927 4.58607L8.29108 0.292804C8.47884 0.105322 8.73347 0 8.99896 0C9.26446 0 9.51908 0.105322 9.70685 0.292804Z'
														fill=''
													/>
												</svg>
											</span>
										</div>
									</div>
									<p>Remember me</p>
								</label>

								<Link href='/forget-password' className='text-sm text-primary'>
									Forget password?
								</Link>
							</div>

							<button className='flex justify-center w-full p-3 font-medium rounded bg-primary text-gray'>
								{isLoading ? (
									<div className='flex items-center justify-center '>
										<PulseLoader color='white' size={10} />
									</div>
								) : (
									'Login'
								)}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
