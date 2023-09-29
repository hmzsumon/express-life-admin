'use client';
import './globals.css';
import './data-tables-css.css';
// import './satoshi.css';
import { Providers } from '@/redux/provider';
import { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from '@/components/common/Loader';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [loading, setLoading] = useState<boolean>(true);
	useEffect(() => {
		setTimeout(() => setLoading(false), 1000);
	}, []);

	return (
		<html lang='en'>
			<body suppressHydrationWarning={true}>
				<Providers>{children}</Providers>
				<ToastContainer />
			</body>
		</html>
	);
}
