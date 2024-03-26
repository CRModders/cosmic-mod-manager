"use server";

import { auth, signOut } from "@/auth";
import db from "@/lib/db";
import {
	isValidName,
	isValidUsername,
	parseName,
	parseUserName,
} from "@/lib/user";
import { revalidatePath } from "next/cache";

export const findUserById = async (id: string) => {
	try {
		const user = await db.user.findUnique({
			where: { id: id },
		});

		return user;
	} catch (error) {
		console.log({ error });
		return null;
	}
};

export const findUserByUsername = async (username: string) => {
	try {
		const user = await db.user.findUnique({
			where: { userName: username },
		});

		return user;
	} catch (error) {
		console.log({ error });
		return null;
	}
};

export const findUserByEmail = async (email: string) => {
	try {
		const user = await db.user.findUnique({
			where: { email: email },
		});

		return user;
	} catch (error) {
		console.log({ error });
		return null;
	}
};

const isUsernameAvailable = async (username: string) => {
	const existingUser = await findUserByUsername(username);
	if (existingUser) {
		return false;
	}
	return true;
};

export const updateUserProfile = async ({
	id,
	data,
}: {
	id: string;
	data: {
		username: string;
		name: string;
	};
}) => {
	try {
		const parsedData = {
			name: parseName(data.name),
			username: parseUserName(data.username),
		};

		if (!parsedData?.username || !parsedData?.name) {
			return {
				success: false,
				error: "Invalid form data",
			};
		}

		if (isValidUsername(parsedData.username) !== true) {
			const error = isValidUsername(parsedData.username);
			return {
				success: false,
				error: error.toString(),
			};
		}

		if (isValidName(parsedData.name) !== true) {
			const error = isValidName(parsedData.name);
			return {
				success: false,
				error: error.toString(),
			};
		}

		if (!isUsernameAvailable(parsedData.username)) {
			return {
				success: false,
				error: "Username already taken",
			};
		}

		const currUser = (await auth())?.user;
		const targetUser = await findUserById(id);
		if (!currUser || currUser.id !== targetUser.id) {
			return {
				success: false,
				error: "Invalid profile update request!",
			};
		}

		const result = await db.user.update({
			where: { id: id },
			data: {
				userName: parsedData.username,
				name: parsedData.name,
			},
		});

		// Refresh the page
		revalidatePath("/settings/account");
		return { success: true, result };
	} catch (error) {
		console.log(error);
		return { success: false, error: "Something went wrong! Please try again" };
	}
};
