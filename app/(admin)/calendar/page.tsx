import Calendar from '@/components/Calender';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Calendar Page | Next.js E-commerce Dashboard Template',
	description: 'This is Calendar',
	// other metadata
};

const CalendarPage = () => {
	return (
		<>
			<Calendar />
		</>
	);
};

export default CalendarPage;
