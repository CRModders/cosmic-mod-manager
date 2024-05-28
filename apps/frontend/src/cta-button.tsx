import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "./providers/auth-provider";

const CTAButton = () => {
	const { session } = useContext(AuthContext);

	if (session === undefined) {
		return (
			<Button className="" size="lg" variant="outline" aria-label="Explore mods">
				<Spinner size="1.2rem" />
			</Button>
		);
	}

	return (
		<>
			{session?.user_id ? (
				<Link to={"/dashboard"}>
					<Button className="" size="lg" variant="outline" aria-label="Explore mods">
						<p className="font-semibold text-base sm:text-md duration-0 dark:duration-0">Dashboard</p>
					</Button>
				</Link>
			) : (
				<Link to={"/login"}>
					<Button className="" size="lg" variant="outline" aria-label="Explore mods">
						<p className="font-semibold text-base sm:text-md duration-0 dark:duration-0">Log In</p>
					</Button>
				</Link>
			)}
		</>
	);
};

export default CTAButton;
