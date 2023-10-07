'use client';
import TnxDetails from '@/components/Transactions/TnxDetails';
import { NotFoundIcon } from '@/lib/icons/CommonIcons';
import { useGetAllTransactionsQuery } from '@/redux/features/auth/authApi';
import React, { useState } from 'react';
import { IoIosArrowDown } from 'react-icons/io';
const headers = [
	{
		id: 1,
		name: 'Date',
		class: 'text-left',
	},
	// {
	// 	id: 2,
	// 	name: 'O-Price',
	// 	class: 'text-center',
	// },
	// {
	// 	id: 3,
	// 	name: 'C-Price',
	// 	class: 'text-center',
	// },
	{
		id: 4,
		name: 'Type',
		class: 'text-center',
	},
	{
		id: 5,
		name: 'Amount',
		class: 'text-center',
	},
	{
		id: 6,
		name: 'Details',
		class: 'text-right',
	},
];

const Transactions = () => {
	const { data } = useGetAllTransactionsQuery(undefined);
	const { transactions: records } = data || [];

	const [currentPage, setCurrentPage] = useState(1);
	const [showMore, setShowMore] = useState(false);
	const [selected_id, setSelected_id] = useState<string | null>(null);
	const [selectedItem, setSelectedItem] = useState<any>(null);

	// handle show more
	const handleShowMore = (id: string) => {
		setSelected_id(id);
		records.find((item: any) => {
			if (item._id === id) {
				setSelectedItem(item);
			}
		});

		setShowMore(!showMore);
	};
	return (
		<div>
			<h1>Transactions</h1>
			<div className='px-4 '>
				<div className='mx-auto'>
					<div className='w-full h-full bg-black_2'>
						<div className='my-4 rounded '>
							<div className='w-full '>
								<div className='bg-[#071832] rounded-t-md'>
									<div className='grid grid-cols-4 list-none '>
										{headers.map((head, index) => {
											return (
												<li key={head.id} className={`py-4  px-2 `}>
													<p
														className={`
                      ${head.class} font-semibold leading-none text-white opacity-70`}
													>
														{head.name}
													</p>
												</li>
											);
										})}
									</div>
								</div>

								<div>
									{records?.slice((currentPage - 1) * 10, currentPage * 10).map(
										(
											tnx: {
												amount: number;
												createdAt: Date;
												transactionType: string;
												_id: string;
											},
											index: number
										) => {
											const { amount, createdAt, transactionType, _id } = tnx;
											const oddEven =
												index % 2 === 0
													? 'bg-blue-gray-800'
													: 'bg-blue-gray-900';

											return (
												<>
													<div
														key={_id}
														className={`
                    ${oddEven} grid grid-cols-4  list-none justify-between items-center px-2 py-2 text-[0.6rem] transition-colors text-blue-gray-200 cursor-pointer 
                    `}
														onClick={() => handleShowMore(_id)}
													>
														<li className=''>
															<p className='text-[0.6rem] font-normal text-left'>
																{new Date(createdAt).toLocaleDateString(
																	'en-US',
																	{
																		year: 'numeric',
																		month: 'short',
																		day: 'numeric',
																		hour: 'numeric',
																		minute: 'numeric',
																	}
																)}
															</p>
														</li>

														<li className=''>
															<div className='flex-col md:flex'>
																{transactionType && (
																	<p
																		className={`capitalize text-center ${
																			transactionType === 'cashIn'
																				? 'text-[#388E3C]'
																				: 'text-[#D32F2F]'
																		}`}
																	>
																		{transactionType}
																	</p>
																)}
															</div>
														</li>
														<li className=''>
															{transactionType === 'cashIn' && (
																<p className='capitalize text-center text-[#388E3C]'>
																	+ {Number(amount).toFixed(4)} $
																</p>
															)}
															{transactionType === 'cashOut' && (
																<p className='capitalize text-center text-[#D32F2F]'>
																	- {Number(amount).toFixed(2)} $
																</p>
															)}
														</li>

														<li className='flex items-center justify-end '>
															<IoIosArrowDown
																className={`${
																	showMore && selected_id === _id
																		? 'transform rotate-180'
																		: ''
																} text-blue-gray-400 text-xl  transition-all `}
															/>
														</li>
													</div>
													{showMore && selected_id === _id && (
														<div className=''>
															<h2 className='my-2 text-xs text-center text-blue-gray-200'>
																Description
															</h2>
															<hr className='my-2 border-0.5 border-black_3' />
															<div>
																<TnxDetails record={selectedItem} />
															</div>
															<hr className='my-2 border-0.5 border-black_3' />
														</div>
													)}
												</>
											);
										}
									)}
								</div>
							</div>

							{records?.length === 0 && (
								<div className='flex flex-col items-center justify-center gap-3'>
									<NotFoundIcon h={10} w={10} color={'gray'} />
									<p className='text-white'>No records found.</p>
								</div>
							)}
						</div>
						<div className='flex items-center justify-between w-full p-4 border-t border-blue-gray-50'>
							<p color='blue-gray' className='font-normal text-white'>
								Page {currentPage} of {Math.ceil(records?.length / 10)}
							</p>
							<div className='flex gap-2'>
								<button
									color='blue-gray'
									disabled={currentPage === 1}
									onClick={() => setCurrentPage(currentPage - 1)}
								>
									Previous
								</button>
								<button
									color='blue-gray'
									disabled={
										currentPage === Math.ceil(records?.length / 10) ||
										records?.length < 10
									}
									onClick={() => setCurrentPage(currentPage + 1)}
								>
									Next
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Transactions;
