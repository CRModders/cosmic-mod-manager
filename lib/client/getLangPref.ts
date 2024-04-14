import { getCookie } from "cookies-next";
import { format_lang_code } from "../lang";

const getLangPref = () => {
	const langPref = getCookie("hl");
	const formatted_code = format_lang_code(langPref);

	return formatted_code.lang_code;
};

export default getLangPref;
