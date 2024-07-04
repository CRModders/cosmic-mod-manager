import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
const DashboardPage = () => {
    const navigate = useNavigate();

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        navigate("/dashboard/overview");
    }, []);

    return null;
};

export default DashboardPage;
