"use client";

//     This file is part of Cosmic Reach Mod Manager.
//
//    Cosmic Reach Mod Manager is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
//
//    Cosmic Reach Mod Manager is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
//   You should have received a copy of the GNU General Public License along with Cosmic Reach Mod Manager. If not, see <https://www.gnu.org/licenses/>.

import { getActionType, getUserEmailFromVerificationToken } from "@/app/api/actions/user";
import { UserVerificationActionTypes } from "@prisma/client";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import AddPasswordConfirmAction from "./AddPassword";
import { Spinner } from "@/components/ui/spinner";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import ChangePassword from "./ChangePassword";
import DeleteAccountConfirmAction from "./DeleteAccount";

const ConfirmActionPage = () => {
	const token = decodeURIComponent(useSearchParams().get("token"));
	const [actionType, setActionType] = useState<UserVerificationActionTypes | undefined | null>(undefined);
	const [email, setEmail] = useState(null);

	const fetchActionType = async () => {
		const res = await getActionType(token);
		setActionType(res);
		const userEmail = await getUserEmailFromVerificationToken(token);
		setEmail(userEmail);
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		fetchActionType();
	}, []);

	if (actionType === null) {
		return (
			<section className="w-full flex items-center justify-center">
				<div className="max-w-md flex items-center justify-center gap-4 text-danger dark:text-danger_dark bg-danger/10 dark:bg-danger_dark/10 py-2 px-4 rounded-lg">
					<ExclamationTriangleIcon className="w-6 h-6" />
					<h1 className="text-2xl">Expired or invalid token</h1>
				</div>
			</section>
		);
	}

	switch (actionType) {
		case UserVerificationActionTypes.ADD_PASSWORD:
			return <AddPasswordConfirmAction token={token} />;
		case UserVerificationActionTypes.CHANGE_PASSWORD:
			return <ChangePassword token={token} email={email} />;
		case UserVerificationActionTypes.DELETE_USER_ACCOUNT:
			return <DeleteAccountConfirmAction token={token} />;
		default:
			return <Spinner />;
	}
};

export default ConfirmActionPage;
