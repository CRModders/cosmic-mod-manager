import { AuthContext } from "@/src/providers/auth-provider";
import { useContext, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Outlet, useNavigate } from "react-router-dom";

const LoginPageLayout = () => {
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
            <Helmet>
                <title>Login | CRMM</title>
                <meta name="description" content="Login page of cosmic reach mod manager" />
            </Helmet>
            <Outlet />
        </div>
    );
};

export default LoginPageLayout;
