import { AuthContext } from "@/src/providers/auth-provider";
import { useContext, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

const SignupPageLayout = () => {
	const { session } = useContext(AuthContext);
	const navigate = useNavigate();

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (session?.user_id) {
			navigate("/");
		}
	}, [session]);

	return (
		<div className="w-full min-h-[100vh] flex flex-col items-center justify-center py-8">
			<Outlet />
		</div>
	);
};

export default SignupPageLayout;
