import { auth } from "@/auth";
import React from "react";

const Modspage = async () => {
	const session = await auth();

	return (
		<div className="w-full flex items-center justify-center">
			<p>{JSON.stringify(session)}</p>
		</div>
	);
};

export default Modspage;
