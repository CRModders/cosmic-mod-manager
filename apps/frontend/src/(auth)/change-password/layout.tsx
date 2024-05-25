import { Outlet } from "react-router-dom";

const ChangePasswordPageLayout = () => {
	return (
		<div className="w-full min-h-[100vh] flex flex-col items-center justify-center py-8">
			<Outlet />
		</div>
	);
};

export default ChangePasswordPageLayout;
