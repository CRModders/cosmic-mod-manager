import React from "react";

const LoginPage = async () => {
	const p = new Promise((resolve) => {
		setTimeout(() => {
			resolve("HI");
		}, 3000);
	});

	await p;

	return <div>LoginPage</div>;
};

export default LoginPage;
