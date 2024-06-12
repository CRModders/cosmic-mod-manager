import { Button } from "@/components/ui/button";
import { CubeLoader } from "@/components/ui/spinner";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "./providers/auth-provider";

const CTAButton = () => {
	const { session } = useContext(AuthContext);

	if (session === undefined) {
		return (
			<Button className="" size="lg" variant="outline" aria-label="Loading...">
				<CubeLoader size="sm" />
			</Button>
		);
	}

	return (
		<>
			{session?.user_id ? (
				<Link to={"/dashboard/projects"}>
					<Button className="" size="lg" variant="outline" aria-label="Dashboard">
						Dashboard
					</Button>
				</Link>
			) : (
				<Link to={"/login"}>
					<Button className="" size="lg" variant="outline" aria-label="LogIn">
						Log In
					</Button>
				</Link>
			)}
		</>
	);
};

export default CTAButton;
