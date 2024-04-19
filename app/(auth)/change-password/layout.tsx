//     This file is part of Cosmic Reach Mod Manager.
//
//    Cosmic Reach Mod Manager is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
//
//    Cosmic Reach Mod Manager is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
//   You should have received a copy of the GNU General Public License along with Cosmic Reach Mod Manager. If not, see <https://www.gnu.org/licenses/>.

import { get_locale } from "@/lib/lang";
import getLangPref from "@/lib/server/getLangPref";

export default function ChangePasswordPageLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<section className="flex w-full flex-col items-center justify-center">
			<div className="inline-block w-full">{children}</div>
		</section>
	);
}

export const generateMetadata = async () => {
	const langPref = getLangPref();
	const change_password_page_locale = get_locale(langPref).content.auth.change_password_page;

	return {
		title: change_password_page_locale.change_password,
		description: change_password_page_locale.meta_desc,
	};
};
