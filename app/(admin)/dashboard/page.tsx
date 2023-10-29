import Dashboard from '@/components/Dashboard/Dashboard';
import OwnerList from '@/components/Dashboard/OwnerList';
import React from 'react';

const DashboardPage = () => {
	return (
		<div>
			<Dashboard />
			<div className='my-6 '>
				<OwnerList />
			</div>
		</div>
	);
};

export default DashboardPage;
