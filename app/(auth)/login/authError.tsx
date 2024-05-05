"use client";

import { authjsErrorDocsPageURL } from "@/auth.config";
import FormErrorMsg from "@/components/formErrorMsg";
import type { locale_content_type } from "@/public/locales/interface";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const AuthError = ({ locale }: { locale: locale_content_type }) => {
	const searchParams = useSearchParams();
	const [errorCode, setErrorCode] = useState<null | undefined | string>(searchParams.get("error"));

	let errorMsg = errorCode;

	try {
		errorMsg = locale.auth?.errors[errorCode] || errorCode;
	} catch (error) {
		// Just chill :)
	}

	useEffect(() => {
		setErrorCode(searchParams.get("error"));
	}, [searchParams]);

	return (
		errorCode && (
			<FormErrorMsg>
				<div className="flex flex-col items-end justify-center">
					<p className="text-left">
						{errorMsg}
						<a
							rel="noreferrer"
							target="_blank"
							href={`${authjsErrorDocsPageURL}#${errorCode.toLowerCase()}`}
							className="text-xs text-foreground dark:text-foreground_muted_dark pl-2"
						>
							Learn more
						</a>
					</p>
				</div>
			</FormErrorMsg>
		)
	);
};

export default AuthError;
