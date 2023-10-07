import React from 'react';
interface Props {
	record: any;
}

const TnxDetails = ({ record }: Props) => {
	return (
		<div className='py- px-2 text-[0.6rem] list-none text-blue-gray-400'>
			<div className='grid grid-cols-2'>
				<li>Tnx ID</li>
				<li className='text-end'>{record?._id}</li>
			</div>
			<hr className='my-2 border-0.5 border-black_3' />
			<div className='grid grid-cols-2'>
				<li>Purpose</li>
				<li className='text-end'>{record?.purpose}</li>
			</div>
			<hr className='my-2 border-0.5 border-black_3' />
			<div className='grid grid-cols-3'>
				<li className='flex items-center col-span-1 '>Description</li>
				<li className='col-span-2 text-end'>{record?.description}</li>
			</div>
			<hr className='my-2 border-0.5 border-black_3' />
			<div className='grid grid-cols-2'>
				<li>Amount</li>
				<li className='text-end'>
					{Number(record?.amount).toLocaleString('en-US', {
						minimumFractionDigits: 4,
						style: 'currency',
						currency: 'USD',
					})}
				</li>
			</div>
			<hr className='my-2 border-0.5 border-black_3' />

			<div className='grid grid-cols-2 '>
				<li>Created At</li>
				<li className='text-end'>
					{new Date(record?.createdAt).toLocaleDateString('en-US', {
						year: 'numeric',
						month: 'short',
						day: 'numeric',
						hour: 'numeric',
						minute: 'numeric',
					})}
				</li>
			</div>
		</div>
	);
};

export default TnxDetails;
