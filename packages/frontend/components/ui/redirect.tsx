import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Redirect = ({ redirectTo }: { redirectTo: string }) => {
    const navigate = useNavigate();

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        navigate(redirectTo, { replace: true });
    }, [navigate]);

    return null;
};

export default Redirect;
