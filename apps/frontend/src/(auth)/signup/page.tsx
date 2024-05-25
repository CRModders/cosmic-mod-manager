import FormCard from "@/components/form-card";
import "@/src/globals.css";
import { Link } from "react-router-dom";
import AuthProviders from "../oauth-providers";


const SignupPage = () => {
    return (
        <FormCard header="Sign Up" footer={<SignupPageFooter />}>

            <div className="w-full flex items-start justify-center flex-col">
                <p className="text-sm flex items-center justify-start mx-1 my-2 text-foreground-muted">
                    Signup using any of the auth providers:
                </p>
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <AuthProviders />
                </div>
            </div>

        </FormCard>
    );
};

const SignupPageFooter = () => {
    return (

        <div className="w-full flex flex-col items-center justify-center gap-1 mt-4 text-sm">
            <p className="text-center text-foreground">
                <span className="text-foreground-muted">
                    Already have an account?&nbsp;
                </span>
                <Link
                    to="/login"
                    aria-label="Sign up"
                    className="text-foreground/90 font-semibold decoration-[0.1rem] hover:underline underline-offset-2"
                >
                    Log In
                </Link>
            </p>
        </div>
    )
}

export default SignupPage;

