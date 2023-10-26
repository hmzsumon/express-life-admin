'use client';
import React from 'react';
import ChartOne from '../Charts/ChartOne';
import ChartThree from '../Charts/ChartThree';
import ChartTwo from '../Charts/ChartTwo';
import ChatCard from '../Chat/ChatCard';
import TableOne from '../Tables/TableOne';
import CardDataStats from '../CardDataStats';
import { GiReceiveMoney } from 'react-icons/gi';
import { FaHandHoldingUsd, FaUsers } from 'react-icons/fa';
import { FcMultipleInputs, FcCurrencyExchange } from 'react-icons/fc';
// import Map from "../Maps/TestMap";

// without this the component renders on server and throws an error
import dynamic from 'next/dynamic';
import { useGetCompanyQuery } from '@/redux/features/company/companyApi';
import Breadcrumb from '../Breadcrumbs/Breadcrumb';
import ScaleLoader from 'react-spinners/ScaleLoader';
import OwnerList from './OwnerList';

const MapOne = dynamic(() => import('../Maps/MapOne'), {
	ssr: false,
});

const Dashboard: React.FC = () => {
	const { data, isError, isLoading, isSuccess } = useGetCompanyQuery();
	const { company } = data || {};
	// console.log('company', company);
	const totalDeposit = Number(
		company?.deposit?.total_deposit_amount || 0
	).toLocaleString('en-US', {
		style: 'currency',
		currency: 'USD',
	});

	const totalWithdraw = Number(
		company?.withdraw?.total_withdraw_amount || 0
	).toLocaleString('en-US', {
		style: 'currency',
		currency: 'USD',
	});

	const totalBalance = Number(
		company?.deposit?.total_deposit_amount -
			company?.withdraw?.total_withdraw_amount
	).toLocaleString('en-US', {
		style: 'currency',
		currency: 'USD',
	});

	const totalRankValue = Number(
		company?.income?.rank_value || 0
	).toLocaleString('en-US', {
		style: 'currency',
		currency: 'USD',
	});

	const totalCoinValue = Number(
		company?.income?.coin_value || 0
	).toLocaleString('en-US', {
		style: 'currency',
		currency: 'USD',
	});
	return (
		<>
			<Breadcrumb pageName='Dashboard' />
			{isLoading ? (
				<div className='flex items-center justify-center '>
					<ScaleLoader color='#36d7b7' />
				</div>
			) : (
				<div className='grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5'>
					<CardDataStats
						title='Total Users'
						total={company?.users?.total_users || 0}
						rate='0.95%'
						levelDown
					>
						<FaUsers className='text-xl fill-primary dark:fill-white' />
					</CardDataStats>

					<CardDataStats
						title='Total Active Users'
						total={company?.users?.total_active_users || 0}
						rate='0.95%'
						levelDown
					>
						<FaUsers className='text-xl fill-primary dark:fill-white' />
					</CardDataStats>
					<CardDataStats
						title='Total Deposit'
						total={totalDeposit}
						rate='0.43%'
						levelUp
					>
						<FcMultipleInputs className='text-xl fill-primary dark:fill-white' />
					</CardDataStats>
					<CardDataStats
						title='Total Withdraw'
						total={totalWithdraw}
						rate='4.35%'
						levelUp
					>
						<FaHandHoldingUsd className='text-xl fill-primary dark:fill-white' />
					</CardDataStats>
					<CardDataStats
						title='Users Balance'
						total={totalBalance}
						rate='2.59%'
						levelUp
					>
						<FcCurrencyExchange className='text-xl fill-primary dark:fill-white' />
					</CardDataStats>
					<CardDataStats
						title='Rank Value'
						total={totalRankValue}
						rate='2.59%'
						levelUp
					>
						<FcCurrencyExchange className='text-xl fill-primary dark:fill-white' />
					</CardDataStats>
					<CardDataStats
						title='Coin Value'
						total={totalCoinValue}
						rate='2.59%'
						levelUp
					>
						<FcCurrencyExchange className='text-xl fill-primary dark:fill-white' />
					</CardDataStats>
				</div>
			)}
		</>
	);
};

export default Dashboard;
