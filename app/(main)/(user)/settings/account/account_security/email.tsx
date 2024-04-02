//     This file is part of Cosmic Reach Mod Manager.
//
//    Cosmic Reach Mod Manager is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
//
//    Cosmic Reach Mod Manager is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
//   You should have received a copy of the GNU General Public License along with Cosmic Reach Mod Manager. If not, see <https://www.gnu.org/licenses/>.

import { Input } from "@/components/ui/input";
import React from "react";

type Props = {
	email: string;
};

const EmailField = ({ email }: Props) => {
	return (
		<div className="w-full flex items-center justify-start">
			<Input
				type="email"
				placeholder="johndoe@xyz.com"
				className="grow min-w-48 sm:max-w-96"
				readOnly
				value={email}
			/>
		</div>
	);
};

export default EmailField;
