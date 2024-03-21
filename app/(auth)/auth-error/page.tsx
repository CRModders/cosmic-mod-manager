"use client";

import React from "react";
import { useSearchParams } from "next/navigation";

const AuthError = () => {
	const params = useSearchParams().get("error");

	console.log(params);
	return <div>AuthError</div>;
};

export default AuthError;
