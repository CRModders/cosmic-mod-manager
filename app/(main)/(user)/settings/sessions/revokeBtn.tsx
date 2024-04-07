"use client";

import { revokeSession } from "@/app/api/actions/auth";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { sleep } from "@/lib/utils";
import { Cross1Icon } from "@radix-ui/react-icons";
import React, { useState } from "react";

type Props = {
	token: string;
};

const RevokeBtn = ({ token }: Props) => {
	const [loading, setLoading] = useState(false);

	return (
		<Button
			variant="outline"
			className="gap-2 hover:bg-background dark:hover:bg-background_dark hover:text-foreground/80 dark:hover:text-foreground_dark/80"
			onClick={async () => {
				if (loading) return;
				setLoading(true);
				await revokeSession(token);
				await sleep(3_000);
				setLoading(false);
			}}
			disabled={loading}
		>
			{loading ? <Spinner size="1rem" /> : <Cross1Icon />}
			Revoke session
		</Button>
	);
};

export default RevokeBtn;
