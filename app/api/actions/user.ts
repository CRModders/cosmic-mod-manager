"use server";

//     This file is part of Cosmic Reach Mod Manager.
//
//    Cosmic Reach Mod Manager is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
//
//    Cosmic Reach Mod Manager is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
//   You should have received a copy of the GNU General Public License along with Cosmic Reach Mod Manager. If not, see <https://www.gnu.org/licenses/>.

import { auth, signIn } from "@/auth";
import db from "@/lib/db";
import bcrypt from "bcrypt";
import {
	isValidName,
	isValidPassword,
	isValidUsername,
	parseName,
	parseProfileProvider,
	parseUserName,
} from "@/lib/user";
import { Providers, User, UserVerificationActionTypes } from "@prisma/client";
import { revalidatePath } from "next/cache";
import {
	ConfirmAddPasswordTokenExpiry,
	passwordHashingSaltRounds,
} from "@/config";
import {
	sendNewPasswordVerificationEmail,
	sendPasswordChangeEmail,
} from "./verificationEmails";

// Hash the user password using bcrypt
const hashPassword = async (password: string) => {
	const hashedPassword = await bcrypt.hash(password, passwordHashingSaltRounds);

	return hashedPassword;
};

// Filter out private userdata and return only public userdata
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
		profileImageProvider: user?.profileImageProvider,
		hasAPassword: hasAPassword,
	};
};

// Find user from database using userId
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

// Find user from database using username
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

// Find user from database using user's account email
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

// Check if a username is available to be used
const isUsernameAvailable = async (username: string) => {
	const existingUser = await findUserByUsername(username);
	if (existingUser) {
		return false;
	}
	return true;
};

// Update user's profile data
export const updateUserProfile = async ({
	data,
}: {
	data: {
		username: string;
		name: string;
		profileImageProvider: Providers;
	};
}) => {
	try {
		const parsedData = {
			name: parseName(data?.name),
			username: parseUserName(data?.username),
			profileImageProvider: parseProfileProvider(data?.profileImageProvider),
		};

		if (
			!parsedData?.username ||
			!parsedData?.name ||
			!parsedData?.profileImageProvider
		) {
			return {
				success: false,
				message: "Invalid form data",
			};
		}

		if (isValidUsername(parsedData.username) !== true) {
			const error = isValidUsername(parsedData.username);
			return {
				success: false,
				message: error.toString(),
			};
		}

		if (isValidName(parsedData.name) !== true) {
			const error = isValidName(parsedData.name);
			return {
				success: false,
				message: error.toString(),
			};
		}

		if (!isUsernameAvailable(parsedData.username)) {
			return {
				success: false,
				message: "Username already taken",
			};
		}

		const user = (await auth())?.user;

		if (!user?.id) {
			return {
				success: false,
				message: "Unauthorized request",
			};
		}

		const userData = await findUserById(user?.id);

		if (userData?.profileImageProvider !== parsedData?.profileImageProvider) {
			const newProfileImage = (
				await db.user.findUnique({
					where: { id: user?.id },
					select: {
						accounts: {
							where: { provider: parsedData.profileImageProvider },
							select: {
								profileImage: true,
							},
						},
					},
				})
			).accounts[0].profileImage;

			await db.user.update({
				where: { id: user.id },
				data: {
					userName: parsedData.username,
					name: parsedData.name,
					profileImageProvider: parsedData?.profileImageProvider,
					image: newProfileImage,
				},
			});
		} else {
			await db.user.update({
				where: { id: user.id },
				data: {
					userName: parsedData.username,
					name: parsedData.name,
					profileImageProvider: parsedData?.profileImageProvider,
				},
			});
		}

		revalidatePath("/settings/account");
		return { success: true, message: "Successfully updated profile" };
	} catch (error) {
		console.log({ error });
		return {
			success: false,
			message: "Something went wrong! Please try again",
		};
	}
};

// Compare plain text password and the hashed password
export const matchPassword = async (password: string, hash: string) => {
	return await bcrypt.compare(password, hash);
};

// Log the user in using the credentials
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

// Get a list of all the linked auth providers
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

// Unlink a provider from user's account; make sure there is at least one provider remaining
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

/**
 *  Get currently loggedin user's data
 * ! WARN: Only to be used server side, using it in a code that will be executed on client may expose user credentials and private data
 */
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

// Returns actionType of confirmation action from the token
export const getActionType = async (token: string) => {
	if (!token) return null;

	try {
		const verificationEmail = await db.verificationEmail.findUnique({
			where: { token: token },
		});

		// Check if the token is expired
		if (
			verificationEmail.dateCreated.getTime() + ConfirmAddPasswordTokenExpiry <
			new Date().getTime()
		) {
			await db.verificationEmail.delete({
				where: { token: token },
			});

			return null;
		}

		return verificationEmail?.action || null;
	} catch (error) {
		console.log({ error });
		return null;
	}
};

export const getUserEmailFromVerificationToken = async (token: string) => {
	const tokenData = await db.verificationEmail.findUnique({
		where: { token: token },
	});
	const userId = tokenData?.userId;

	if (!userId) {
		return null;
	}

	const userData = await db.user.findUnique({
		where: { id: userId },
		select: {
			email: true,
		},
	});

	return userData?.email || null;
};

// Add newly set password to the database and | TODO: send a confirmation link to the user's email to confirm the password change
export const initiateAddNewPasswordAction = async ({
	newPassword,
}: { newPassword: string }) => {
	if (isValidPassword(newPassword) !== true) {
		const error = isValidPassword(newPassword);
		return { success: false, message: `Invalid password. ${error}` };
	}

	try {
		const user = (await auth())?.user;
		const userData = await db.user.findUnique({
			where: { id: user?.id },
		});

		if (userData?.password) {
			revalidatePath("/settings/account");

			return {
				success: false,
				message: "Invalid request!",
			};
		}

		const hashedPassword = await hashPassword(newPassword);
		await db.user.update({
			where: { id: user.id },
			data: { unverifiedNewPassword: hashedPassword },
		});

		const res = await sendNewPasswordVerificationEmail({
			userId: user.id,
			email: user.email,
			name: user.name,
		});
		if (res?.success !== true) {
			return {
				success: false,
				message: res?.message || "Error while sending confirmation email",
			};
		}

		revalidatePath("/settings/account");
		return { success: true, message: "Confirmation email sent!" };
	} catch (error) {
		return { success: false, message: "Internal server error" };
	}
};

// Remove account password
export const removePassword = async ({
	password,
}: {
	password: string;
}) => {
	if (!password) {
		return {
			success: false,
			message: "Invalid request!",
		};
	}

	try {
		const user = (await auth())?.user;
		const userData = await db.user.findUnique({
			where: { id: user?.id },
		});

		if (!userData?.password) {
			revalidatePath("/settings/account");

			return {
				success: false,
				message: "Invalid request!",
			};
		}

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

export const discardNewPasswordAddition = async (token: string) => {
	try {
		if (!token) {
			return {
				success: false,
				message: "Missing confirmation token",
			};
		}

		await db.verificationEmail.delete({
			where: { token: token, action: UserVerificationActionTypes.ADD_PASSWORD },
		});

		return {
			success: true,
			message: "Cancelled successfully",
		};
	} catch (error) {
		return {
			success: false,
			message: "Internal server error",
		};
	}
};

export const confirmNewPasswordAddition = async (token: string) => {
	try {
		if (!token) {
			return {
				success: false,
				message: "Missing confirmation token",
			};
		}

		const verificationActionData = await db.verificationEmail.delete({
			where: { token: token, action: UserVerificationActionTypes.ADD_PASSWORD },
		});

		if (!verificationActionData?.token) {
			return {
				success: false,
				message: "Invalid confirmation token",
			};
		}

		const userData = await db.user.findUnique({
			where: { id: verificationActionData?.userId },
			select: {
				unverifiedNewPassword: true,
				password: true,
			},
		});

		if (userData?.password) {
			return {
				success: false,
				message: "You have already added a password.",
			};
		}

		await db.user.update({
			where: { id: verificationActionData.userId },
			data: {
				password: userData.unverifiedNewPassword,
				unverifiedNewPassword: null,
			},
		});

		return {
			success: true,
			message: "Successfully added new password",
		};
	} catch (error) {
		return {
			success: false,
			message: "Internal server error",
		};
	}
};

// TODO: Create this function
export const initiateDeleteAccountAction = async () => {};

// TODO: Confirm account deletion
export const confirmAccountDeletion = async () => {};

// Initiate password change action
export const initiatePasswordChange = async (email: string) => {
	if (!email) {
		return {
			success: false,
			message: "Missing email",
		};
	}

	try {
		const userData = await db.user.findUnique({ where: { email: email } });
		if (!userData?.password) {
			return {
				success: false,
				message:
					"You can't change the password, you have not enabled password login.",
				description:
					"Only the accounts which have password added could change the password. If not you can use auth providers to login.",
			};
		}
		const emailSendRes = await sendPasswordChangeEmail(userData);

		if (emailSendRes?.success !== true) {
			return {
				success: false,
				message: emailSendRes?.message || "Error while sending email",
			};
		}

		return {
			success: true,
			message: emailSendRes?.message || "Error while sending email",
		};
	} catch (error) {
		console.log({ error });
		return {
			success: false,
			message: "Internal server error",
		};
	}
};

export const cancelPasswordChangeAction = async (token: string) => {
	try {
		if (!token) {
			return {
				success: false,
				message: "Missing confirmation token",
			};
		}

		await db.verificationEmail.delete({
			where: {
				token: token,
				action: UserVerificationActionTypes.CHANGE_PASSWORD,
			},
		});

		return {
			success: true,
			message: "Cancelled successfully",
		};
	} catch (error) {
		return {
			success: false,
			message: "Internal server error",
		};
	}
};

export const confirmPasswordChange = async ({
	token,
	newPassword,
}: {
	token: string;
	newPassword: string;
}) => {
	try {
		if (!token) {
			return {
				success: false,
				message: "Missing confirmation token",
			};
		}

		if (isValidPassword(newPassword) !== true) {
			const error = isValidPassword(newPassword);
			return {
				success: false,
				message: error as string,
			};
		}

		const verificationActionData = await db.verificationEmail.delete({
			where: {
				token: token,
				action: UserVerificationActionTypes.CHANGE_PASSWORD,
			},
		});

		if (!verificationActionData?.token) {
			return {
				success: false,
				message: "Invalid confirmation token",
			};
		}

		const userData = await db.user.findUnique({
			where: { id: verificationActionData?.userId },
			select: {
				password: true,
			},
		});

		if (!userData?.password) {
			return {
				success: false,
				message:
					"You can't use change password, your account doesn't have passwords enabled",
			};
		}

		const hashedPassword = await hashPassword(newPassword);

		await db.user.update({
			where: { id: verificationActionData.userId },
			data: {
				password: hashedPassword,
			},
		});

		return {
			success: true,
			message: "Successfully added new password",
		};
	} catch (error) {
		return {
			success: false,
			message: "Internal server error",
		};
	}
};
