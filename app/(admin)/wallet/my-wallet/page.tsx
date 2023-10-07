'use client';
import React from 'react';
import { FaCoins, FaHandHoldingUsd, FaWallet } from 'react-icons/fa';
import { GiPayMoney, GiReceiveMoney } from 'react-icons/gi';
import { BsFillSendFill } from 'react-icons/bs';
import { useSelector } from 'react-redux';

const MyWallet = () => {
	const { user } = useSelector((state: any) => state.auth);
	return (
		<div>
			<h2>My Wallet</h2>
			<div>
				<div className='px-4 py-4'>
					<div className='grid gap-4 md:grid-cols-3'>
						<div className='flex items-start space-x-4 p-4  border-[#2e72d2] border rounded bg-[rgba(46,114,210,.1)]'>
							<FaWallet className='text-3xl text-[#2e72d2]' />
							<div className='space-y-2 '>
								<h1 className='text-xl font-bold '>Your Balance</h1>
								<p>
									{Number(user?.m_balance).toLocaleString('en-US', {
										minimumFractionDigits: 2,
										maximumFractionDigits: 6,
									})}{' '}
									USDT
								</p>
							</div>
						</div>

						{/* ELC*/}
						<div className='flex items-start space-x-4 p-4 border-[#2e72d2] border rounded bg-[rgba(46,114,210,.1)]'>
							<FaCoins className='text-3xl text-[#2e72d2]' />
							<div className='space-y-2 '>
								<h1 className='text-xl font-bold '>Total ElC Coin</h1>
								<p>
									{Number(
										user?.elc_coin ? user?.total_earing : 0
									).toLocaleString('en-US', {
										minimumFractionDigits: 2,
										maximumFractionDigits: 6,
									})}{' '}
									USDT
								</p>
							</div>
						</div>

						{/* Earing */}
						<div className='flex items-start space-x-4 p-4 border-[#2e72d2] border rounded bg-[rgba(46,114,210,.1)]'>
							<FaHandHoldingUsd className='text-4xl text-[#2e72d2]' />
							<div className='space-y-2 '>
								<h1 className='text-xl font-bold '>Total Earning</h1>
								<p>
									{Number(
										user?.total_earing ? user?.total_earing : 0
									).toLocaleString('en-US', {
										minimumFractionDigits: 2,
										maximumFractionDigits: 6,
									})}{' '}
									USDT
								</p>
							</div>
						</div>
						{/* Total Deposit */}
						<div className='flex items-start space-x-4 p-4 border-[#2e72d2] border rounded bg-[rgba(46,114,210,.1)]'>
							<GiPayMoney className='text-4xl text-[#2e72d2]' />
							<div className='space-y-2 '>
								<h1 className='text-xl font-bold '>Total Deposit</h1>
								<p>
									{Number(user?.total_deposit).toLocaleString('en-US', {
										minimumFractionDigits: 2,
										maximumFractionDigits: 2,
									})}{' '}
									USDT
								</p>
							</div>
						</div>

						{/* Total Withdraw */}
						<div className='flex items-start space-x-4 p-4 border-[#2e72d2] border rounded bg-[rgba(46,114,210,.1)]'>
							<GiReceiveMoney className='text-4xl text-[#2e72d2]' />
							<div className='space-y-2 '>
								<h1 className='text-xl font-bold '>Total Withdraw</h1>
								<p>
									{Number(user?.total_withdraw).toLocaleString('en-US', {
										minimumFractionDigits: 2,
										maximumFractionDigits: 2,
									})}{' '}
									USDT
								</p>
							</div>
						</div>

						{/* Total Send Money */}
						<div className='flex items-start space-x-4 p-4 border-[#2e72d2] border rounded bg-[rgba(46,114,210,.1)]'>
							<BsFillSendFill className='text-3xl text-[#2e72d2]' />
							<div className='space-y-2 '>
								<h1 className='text-xl font-bold '>Total Send Money</h1>
								<p>
									{Number(user?.total_withdraw).toLocaleString('en-US', {
										minimumFractionDigits: 2,
										maximumFractionDigits: 2,
									})}{' '}
									USDT
								</p>
							</div>
						</div>

						{/* Total Receive Money */}
						<div className='flex items-start space-x-4 p-4 border-[#2e72d2] border rounded bg-[rgba(46,114,210,.1)]'>
							<GiReceiveMoney className='text-4xl text-[#2e72d2]' />
							<div className='space-y-2 '>
								<h1 className='text-xl font-bold '>Total Receive Money</h1>
								<p>
									{Number(user?.total_withdraw).toLocaleString('en-US', {
										minimumFractionDigits: 2,
										maximumFractionDigits: 2,
									})}{' '}
									USDT
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default MyWallet;
