import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
	return (
		<section className="w-full flex items-center justify-center">
			{children}
		</section>
	);
};

export default Layout;
