import { Navigate } from "react-router-dom";

const Redirect = ({ redirectTo }: { redirectTo: string }) => {
    return <Navigate to={redirectTo} replace={true} />;
};

export default Redirect;
