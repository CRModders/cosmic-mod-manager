import { Input } from "@/components/ui/input";
import React from "react";

type Props = {
	email: string;
};

const EmailField = ({ email }: Props) => {
	return (
		<div className="w-full flex items-center justify-start">
			<Input
				type="email"
				placeholder="johndoe@xyz.com"
				className="grow min-w-48 sm:max-w-96"
				readOnly
				value={email}
			/>
		</div>
	);
};

export default EmailField;
