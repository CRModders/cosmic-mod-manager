import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

type Props = {
	destinationUrl: string;
};

const RedrectTo = ({ destinationUrl }: Props) => {
	const navigate = useNavigate();

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		navigate(destinationUrl, { replace: true });
	}, []);
	return null;
};

export default RedrectTo;
