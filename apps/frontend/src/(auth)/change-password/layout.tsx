import { Helmet } from "react-helmet";
import { Outlet } from "react-router-dom";

const ChangePasswordPageLayout = () => {
    return (
        <div className="w-full min-h-[100vh] flex flex-col items-center justify-center py-8">
            <Helmet>
                <title>Change password | CRMM</title>
                <meta name="description" content="Change your crmm account password" />
            </Helmet>
            <Outlet />
        </div>
    );
};

export default ChangePasswordPageLayout;
