"use client";

import { useSession } from "next-auth/react";
import React from "react";

const Modspage = () => {
	const session = useSession();

	return (
		<div className="w-full flex items-center justify-center">
			<p>{JSON.stringify(session)}</p>
		</div>
	);
};

export default Modspage;
