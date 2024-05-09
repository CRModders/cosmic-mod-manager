import { auth } from "@/auth";
import type { locale_content_type } from "@/public/locales/interface";
import Link from "next/link";
import { GearIcon } from "../Icons";

const SettingsButton = async ({ locale }: { locale: locale_content_type }) => {
	const session = await auth();
	if (!session?.user?.id) {
		return null;
	}

	return (
		<Link
			href={"/settings/account"}
			aria-label={locale.auth.settings}
			className="flex items-center justify-center rounded-full px-4 gap-2 hover:bg-transparent bg-background dark:hover:bg-transparent dark:bg-background_dark border border-shadow dark:border-zinc-600"
		>
			<GearIcon className="h-5 w-5 text-foreground/80 dark:text-foreground_dark/80" />
			<p className="h-10 flex items-center justify-center">{locale.auth.settings}</p>
		</Link>
	);
};

export default SettingsButton;
