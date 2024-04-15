"use server";

import { get_available_lang_code } from "@/lib/lang";
import { cookies } from "next/headers";

export const setLanguagePreference = async (language_code: string) => {
	if (!language_code) return null;

	const valid_lang_code = get_available_lang_code(language_code);
	const currDate = new Date();
	currDate.setFullYear(currDate.getFullYear() + 1);

	cookies().set("hl", valid_lang_code.lang_code, {
		sameSite: "lax",
		httpOnly: false,
		expires: currDate,
	});

	return true;
};
