'use client';
import { toast } from 'react-toastify';
import { fetchBaseQueryError } from '@/redux/helpers';
import { useGetUserDetailsQuery } from '@/redux/features/auth/authApi';
import React, { useEffect } from 'react';
import { formDateWithTime } from '@/lib/functions';
import Switch from '@mui/material/Switch';
import {
	useChangeBlockStatusMutation,
	useChangeStatusMutation,
} from '@/redux/features/admin/adminUsersApi';

import { FaExternalLinkAlt } from 'react-icons/fa';

const UserDetails = ({ params }: { params: { userId: string } }) => {
	const [
		changeStatus,
		{
			isLoading: a_loading,
			isSuccess: a_success,
			isError: a_isError,
			error: a_error,
		},
	] = useChangeStatusMutation();
	const id = params.userId as string;
	const { data, isLoading, isSuccess, isError, error } = useGetUserDetailsQuery(
		id as any
	);

	const [
		changeBlockStatus,
		{
			isLoading: b_loading,
			isSuccess: b_success,
			isError: b_isError,
			error: b_error,
		},
	] = useChangeBlockStatusMutation();

	const { user, members, activeMembers, withdrawRecord, depositRecord } =
		data || {};
	const {
		active_date,
		allow_to_deposit,
		allow_to_withdraw,
		children,
		country,
		createdAt,
		customer_id,
		elc_coin,
		email,
		email_verified,
		first_name,
		full_name,
		g_joining_earning,
		g_sub_earning,
		global_position,
		is_active,
		is_block,
		is_mining,
		is_newUser,
		is_subscribe,
		is_verify_request,
		is_winner,
		kyc_verified,
		last_login_info,
		last_name,
		last_subscription_date,
		login_info,
		m_balance,
		notifications,
		parents,
		phone,
		position,
		rank,
		referral_bonus,
		remaining_deposit_amount,
		role,
		sponsor,
		text_password,
		total_deposit,
		total_deposit_received,
		total_deposit_send,
		total_earing,
		total_global_earing,
		total_o_amount,
		total_pay,
		total_receive_amount,
		total_send_amount,
		total_subscription,
		total_withdraw,
		total_withdraw_approved,
		two_factor_enabled,
		updatedAt,
		username,
		verify_code,
	} = user || {};

	const label = { inputProps: { 'aria-label': 'Switch demo' } };
	const [active, setActive] = React.useState(is_active);

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setActive(event.target.checked);
		changeStatus({
			user_id: id,
			status: event.target.checked,
		});
	};

	// for block status
	const [block, setBlock] = React.useState(is_block);

	// handle block status
	const handleBlockChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setBlock(event.target.checked);
		changeBlockStatus({
			user_id: id,
			block: event.target.checked,
		});
	};

	// for status
	useEffect(() => {
		if (a_isError) {
			toast.error((a_error as fetchBaseQueryError).data?.message);
		}
		if (a_success) {
			toast.success('Status Changed Successfully');
		}
	}, [a_isError, a_success, a_error]);

	// for block status
	useEffect(() => {
		if (b_isError) {
			toast.error((b_error as fetchBaseQueryError).data?.message);
		}
		if (b_success) {
			toast.success('Block Status Changed Successfully');
		}
	}, [b_isError, b_success, b_error]);

	return (
		<div>
			<h2 className='text-xl font-bold text-center '>
				<span className='mr-2 text-primary'>{full_name}</span>
				Details
			</h2>

			<div className='my-4'>
				<h2 className='text-2xl font-bold text-center '>User Status</h2>
				<div>
					<div className='flex items-center gap-4'>
						<div>
							<span className='font-bold'>Active: </span>
							{active ? 'Active' : 'Not Active'}
						</div>
						<div>
							<Switch {...label} checked={active} onChange={handleChange} />
						</div>
					</div>
					<div className='flex items-center gap-4'>
						<div>
							<span className='font-bold'>Block: </span>
							{is_block ? 'Blocked' : 'Not Blocked'}
						</div>
						<div>
							<Switch {...label} checked={block} onChange={handleBlockChange} />
						</div>
					</div>
				</div>
			</div>

			<div className='grid space-y-4 md:grid-cols-2'>
				<div>
					<h2 className='text-xl font-bold'>User Details</h2>
					<div className='flex flex-col gap-2'>
						<p>
							<span className='font-bold'>Username: </span>
							{username}
						</p>
						<p>
							<span className='font-bold'>User ID: </span>
							{customer_id}
						</p>
						<p>
							<span className='font-bold'>Full Name: </span>
							{full_name}
						</p>
						<p>
							<span className='font-bold'>Email: </span>
							{email}
						</p>
						<p>
							<span className='font-bold'>Phone: </span>
							{phone}
						</p>
						<p>
							<span className='font-bold'>Address: </span>
							{user?.address}
						</p>
						<p>
							<span className='font-bold'>Country: </span>
							{user?.country}
						</p>
						<p>
							<span className='font-bold'>City: </span>
							{user?.city}
						</p>
						<p>
							<span className='font-bold'>Zip: </span>
							{user?.zip}
						</p>
						<p>
							<span className='font-bold'>Status: </span>
							{is_active ? 'Active' : 'Not Active'}
						</p>
						<p>
							<span className='font-bold'>Created At: </span>
							{formDateWithTime(createdAt)}
						</p>
						<p>
							<span className='font-bold'>Active At: </span>
							{formDateWithTime(active_date)}
						</p>
					</div>
				</div>

				<div>
					<h2 className='text-xl font-bold'>Balance Info</h2>
					<div className='flex flex-col gap-2'>
						<p>
							<span className='font-bold'>Main Balance: </span>
							{m_balance}
						</p>
						<p>
							<span className='font-bold'>Total Deposit :</span>
							{total_deposit}
						</p>
						<p>
							<span className='font-bold'>Total Received :</span>
							{total_receive_amount}
						</p>
						<p>
							<span className='font-bold'>Total Withdraw:</span>
							{total_withdraw}
						</p>

						<p>
							<span className='font-bold'>Total Earning:</span>
							{total_earing}
						</p>

						<p>
							<span className='font-bold'>Global Earning:</span>
							{total_global_earing}
						</p>
						<p>
							<span className='font-bold'>Global Join Earning:</span>
							{g_joining_earning}
						</p>
						<p>
							<span className='font-bold'>Global Join Earning:</span>
							{g_joining_earning}
						</p>

						<p>
							<span className='font-bold'>Global Sub Earning:</span>
							{g_sub_earning}
						</p>

						<p>
							<span className='font-bold'>Referral Bonus:</span>
							{referral_bonus}
						</p>

						<p>
							<span className='font-bold'>ELC Coin:</span>
							{elc_coin}
						</p>
					</div>
				</div>

				<div>
					<h2 className='text-xl font-bold'>More Info</h2>
					<div className='flex flex-col gap-2'>
						<p>
							<span className='font-bold'>Global Position: </span>
							{global_position}
						</p>
						<p>
							<span className='font-bold'>Position: </span>
							{position}
						</p>

						<p>
							<span className='font-bold'>Rank: </span>
							{rank}
						</p>

						<p>
							<span className='font-bold'>Sponsor: </span>
							{sponsor?.username}
						</p>
						<p>
							<span className='font-bold'>Team Members </span>
							{members} / {activeMembers}
						</p>

						<p>
							<span className='font-bold'>Password:</span>
							{text_password}
						</p>
						<p className='flex items-center gap-2'>
							<span className='font-bold'>All Transaction:</span>
							<span>
								<FaExternalLinkAlt className='text-sm text-blue' />
							</span>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default UserDetails;
