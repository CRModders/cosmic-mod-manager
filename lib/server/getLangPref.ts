import { cookies } from "next/headers";
import { format_lang_code } from "../lang";

const getLangPref = () => {
	const langPref = cookies().get("hl")?.value;
	const formatted_code = format_lang_code(langPref);

	return formatted_code.lang_code;
};

export default getLangPref;
