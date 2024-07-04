import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SettingsPage = () => {
    const navigate = useNavigate();

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        navigate("/settings/account");
    }, []);

    return <p className="">Redirecting...</p>;
};

export default SettingsPage;
