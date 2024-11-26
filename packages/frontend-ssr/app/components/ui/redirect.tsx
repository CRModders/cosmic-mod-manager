import { Navigate } from "@remix-run/react";

const Redirect = ({ redirectTo }: { redirectTo: string }) => {
    return <Navigate to={redirectTo} replace={true} />;
};

export default Redirect;
