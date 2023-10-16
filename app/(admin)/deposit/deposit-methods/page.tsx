'use client';
import { fetchBaseQueryError } from '@/redux/helpers';
import { toast } from 'react-toastify';
import { useAddDepositMethodMutation } from '@/redux/features/deposit/depositApi';
import React, { useEffect, useState } from 'react';
import Resizer from 'react-image-file-resizer';
import { ScaleLoader } from 'react-spinners';
import AllDepositMethods from '@/components/Depoosits/DepositMethods';

const DepositMethods = () => {
	const [addDepositMethod, { isLoading, isSuccess, isError, error }] =
		useAddDepositMethodMutation();
	const [username, setUsername] = useState('');
	const [usernameError, setUsernameError] = useState(false);

	const [trxAddress, setTrxAddress] = useState('');
	const [trxAddressError, setTrxAddressError] = useState(false);
	const [file, setFile] = useState('');
	const [fileError, setFileError] = useState('');
	const [inputError, setInputError] = useState('');
	const [pic, setPic] = useState<string>('');
	const [textError, setTextError] = useState(''); // Set 'pic' state to hold a string value (URL or base64)

	const [loading, setLoading] = useState(false); // State to track loading status

	// handle change
	const handleChange = (e: any) => {
		const { name, value } = e.target;
		switch (name) {
			case 'username':
				setUsername(value);
				break;
			case 'trxAddress':
				setTrxAddress(value);
				break;
			default:
				break;
		}
	};

	// handle submit
	const handleSubmit = (e: any) => {
		e.preventDefault();

		if (!username) {
			setUsernameError(true);
			setInputError('Username is required');
			return;
		}

		if (!trxAddress) {
			setTrxAddressError(true);
			setInputError('Trx-20 Address is required');
			return;
		}

		const data = {
			username,
			trxAddress,
			url: pic,
		};

		addDepositMethod(data);
	};

	useEffect(() => {
		if (isSuccess) {
			toast.success('Deposit method added successfully');
			setUsername('');
			setTrxAddress('');
			setPic('');
		}

		if (isError && error) {
			toast.error((error as fetchBaseQueryError).data?.message);
		}
	}, [isSuccess, isError, error]);

	// Handle file upload
	const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target?.files?.[0];

		if (file) {
			// Validate file type
			if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
				console.log('Invalid file type. Only JPG and PNG files are allowed.');
				setTextError('Invalid file type. Only JPG and PNG files are allowed.');
				return;
			}

			// Show loading state during upload
			setLoading(true);

			// Resize and upload to Cloudinary
			Resizer.imageFileResizer(
				file,
				300, // Desired width
				300, // Desired height
				'JPEG', // Output format (JPEG, PNG, WEBP, etc.)
				100, // Quality (0-100)
				0, // Rotation
				(uri: any) => {
					uploadToCloudinary(uri as string);
				},
				'base64' // Output type (base64, blob, file)
			);
		}
	};

	const uploadToCloudinary = async (dataUrl: string) => {
		// Use your Cloudinary credentials here
		const cloudinaryUrl =
			'https://api.cloudinary.com/v1_1/duza4meju/image/upload';
		const formData = new FormData();
		formData.append('file', dataUrl);
		formData.append('upload_preset', 'rapid-win');

		try {
			const response = await fetch(cloudinaryUrl, {
				method: 'POST',
				body: formData,
			});

			const data = await response.json();
			setPic(data.secure_url);
			setLoading(false); // Turn off loading state after successful upload
			console.log(data);
		} catch (error) {
			console.error('Error uploading image to Cloudinary:', error);
			setLoading(false); // Turn off loading state on error as well
		}
	};

	return (
		<div>
			<div className='grid grid-cols-1'>
				{/* <!-- Input Fields --> */}
				<div className='bg-white border rounded-sm border-stroke shadow-default dark:border-strokedark dark:bg-boxdark'>
					<div className='border-b border-stroke py-4 px-6.5 dark:border-strokedark'>
						<h3 className='font-medium text-black dark:text-white'>
							Add Deposit Method
						</h3>
					</div>

					{/* <!-- Username --> */}
					<div className='flex flex-col gap-3 p-6.5'>
						<div>
							<label className='block mb-3 text-black dark:text-white'>
								Username
							</label>
							<input
								type='text'
								placeholder='Username'
								name='username'
								value={username}
								onChange={handleChange}
								className='w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
							/>
							{usernameError && (
								<small className='text-red-500'>{inputError}</small>
							)}
						</div>
					</div>

					{/* <!-- Trx-20 address --> */}
					<div className='flex flex-col gap-3 p-6.5'>
						<div>
							<label className='block mb-3 text-black dark:text-white'>
								Trx-20 Address
							</label>
							<input
								type='text'
								placeholder='Trx-20 Address'
								name='trxAddress'
								value={trxAddress}
								onChange={handleChange}
								className='w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
							/>
							{trxAddressError && (
								<small className='text-red-500'>{inputError}</small>
							)}
						</div>
					</div>
					{/* <!-- File upload --> */}
					<div className='flex flex-col gap-5.5 p-6.5'>
						<div>
							<label className='block mb-3 text-black dark:text-white'>
								Attach file
							</label>
							<div className='my-4'>
								{loading ? (
									// Display a loading indicator during image upload
									<div className='flex items-center justify-center w-20 h-20 rounded ring-2 ring-blue-500'>
										<ScaleLoader color='blue' />
									</div>
								) : (
									// Show the uploaded image or the default avatar
									// eslint-disable-next-line @next/next/no-img-element
									<img
										src={pic}
										alt='user avatar'
										className='w-24 h-24 rounded ring-2 ring-blue-500'
									/>
								)}
							</div>
							<input
								type='file'
								accept='image/jpeg, image/png'
								onChange={handleFileUpload}
								className='w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent font-medium outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:py-3 file:px-5 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary'
							/>
							{textError && <small className='text-red-500'>{textError}</small>}
						</div>
					</div>

					{/* Submit Button */}
					<div className='flex flex-col gap-5.5 p-6.5'>
						<button
							className='items-center justify-center px-10 py-4 font-medium text-center text-white rounded bg-primary hover:bg-opacity-90 lg:px-8 xl:px-10'
							onClick={handleSubmit}
						>
							Submit
						</button>
					</div>
				</div>
			</div>

			<div className='my-6'>
				<AllDepositMethods />
			</div>
		</div>
	);
};

export default DepositMethods;
