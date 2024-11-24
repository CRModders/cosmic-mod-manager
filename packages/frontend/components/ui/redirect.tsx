import { Navigate } from "react-router";

const Redirect = ({ redirectTo }: { redirectTo: string }) => {
    return <Navigate to={redirectTo} replace={true} />;
};

export default Redirect;
