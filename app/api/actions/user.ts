"use server";

import { auth, signIn } from "@/auth";
import db from "@/lib/db";
import bcrypt from "bcrypt";
import {
	isValidName,
	isValidPassword,
	isValidUsername,
	parseName,
	parseUserName,
} from "@/lib/user";
import { User } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { passwordHashingSaltRounds } from "@/config";

const hashPassword = async (password: string) => {
	const hashedPassword = await bcrypt.hash(password, passwordHashingSaltRounds);

	return hashedPassword;
};

const ReturnPublicUserData = async (user: User) => {
	const hasAPassword = !!user?.password;
	return {
		id: user?.id,
		name: user?.name,
		userName: user?.userName,
		email: user?.email,
		role: user?.role,
		emailVerified: user?.emailVerified,
		image: user?.image,
		hasAPassword: hasAPassword,
	};
};

export const findUserById = async (id: string) => {
	try {
		const user = await db.user.findUnique({
			where: { id: id },
		});

		return await ReturnPublicUserData(user);
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

		return await ReturnPublicUserData(user);
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

		return await ReturnPublicUserData(user);
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

export const matchPassword = async (password: string, hash: string) => {
	return await bcrypt.compare(password, hash);
};

export const setNewPassword = async ({
	id,
	email,
	newPassword,
}: { id: string; email: string; newPassword: string }) => {
	if (isValidPassword(newPassword) !== true) {
		const error = isValidPassword(newPassword);
		return { success: false, message: `Invalid password. ${error}` };
	}

	const user = (await auth())?.user;
	if (user.id !== id) {
		return { success: false, message: "Unauthorized request" };
	}

	try {
		const hashedPassword = await hashPassword(newPassword);
		await db.user.update({
			where: { id: user.id },
			data: { password: hashedPassword },
		});
		revalidatePath("/settings/account");
		return { success: true, message: "Password set successfully!" };
	} catch (error) {
		return { success: false, message: "Internal server error" };
	}
};

export const loginUser = async ({
	email,
	password,
}: {
	email: string;
	password: string;
}) => {
	if (!email || !password) {
		return { success: false, message: "Email and password are required" };
	}

	const userData = await db.user.findUnique({
		where: { email: email },
	});

	if (!userData?.email) {
		return {
			success: false,
			message: "No account exists with the entered email address",
		};
	}

	if (!userData?.password) {
		return { success: false, message: "Incorrect email or password" };
	}

	const isCorrectPassword = await matchPassword(
		password as string,
		userData?.password,
	);

	if (!isCorrectPassword) {
		return { success: false, message: "Incorrect email or password" };
	}

	try {
		await signIn("credentials", {
			email: email,
			password: password,
			redirect: false,
		});

		return { success: true, message: "Login successful!" };
	} catch (error) {
		console.log({ error });
		return { success: false, message: "Internal server error" };
	}
};

export const removePassword = async ({
	id,
	password,
}: {
	id: string;
	password: string;
}) => {
	if (!id || !password) {
		return {
			success: false,
			message: "Invalid request!",
		};
	}

	const session = await auth();

	if (session?.user?.id !== id) {
		return {
			success: false,
			message: "Invalid request!",
		};
	}

	const userData = await db.user.findUnique({
		where: { id: id },
	});
	try {
		const isCorrectPassword = await matchPassword(password, userData.password);
		if (!isCorrectPassword) {
			return {
				success: false,
				message: "Incorrect password!",
			};
		}

		await db.user.update({
			where: { id: userData.id },
			data: { password: null },
		});

		revalidatePath("/settings/account");

		return {
			success: true,
			message: "Successfully removed password",
		};
	} catch (error) {
		console.log({ error });
		return {
			success: false,
			message: "Internal server error!",
		};
	}
};

export const getLinkedProvidersList = async (): Promise<string[]> => {
	const session = await auth();
	if (!session?.user?.id) return [];

	try {
		const linkedProviders = await db.account.findMany({
			where: { userId: session?.user?.id },
		});

		const list = [];
		for (const provider of linkedProviders) {
			list.push(provider.provider);
		}

		return list;
	} catch (error) {
		console.log({ error });
		return [];
	}
};

export const unlinkAuthProvider = async (name: string) => {
	const user = (await auth())?.user;
	if (!user?.id) {
		return {
			success: false,
			message: "Invalid request",
		};
	}

	const existingProviders = await db.account.findMany({
		where: { userId: user?.id },
	});

	if (!existingProviders?.length) {
		return {
			success: false,
			message: "Invalid request",
		};
	}

	if (existingProviders.length === 1) {
		return {
			success: false,
			message: "You can't unlink the only remaining auth provider",
		};
	}

	const targetProvider = existingProviders
		.filter((provider) => {
			if (provider.provider === name) {
				return provider;
			}
		})
		?.at(0);

	if (!targetProvider) {
		return {
			success: false,
			message: "Invalid request",
		};
	}
	try {
		await db.account.delete({
			where: {
				id: targetProvider.id,
			},
		});

		revalidatePath("/settings/account");

		return {
			success: true,
			message: `Successfully removed ${name} provider`,
		};
	} catch (error) {
		return {
			success: false,
			message: "Internal server error",
		};
	}
};

export const getCurrentAuthUser = async () => {
	const user = (await auth())?.user;
	if (!user?.id) {
		return null;
	}

	const userData = await db.user.findUnique({
		where: { id: user?.id },
	});

	if (!userData?.id) return null;
	return userData;
};
