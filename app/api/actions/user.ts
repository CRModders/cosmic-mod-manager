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
import { Account, Providers, User, UserVerificationActionTypes, VerificationEmail } from "@prisma/client";
import { revalidatePath } from "next/cache";
import {
	changePasswordConfirmationTokenValidity_ms,
	addNewPasswordVerificationTokenValidity_ms,
	deleteAccountVerificationTokenValidity_ms,
	passwordHashingSaltRounds,
	deletedUsernameReservationDuration_ms,
} from "@/config";
import {
	sendAccountDeletionConfirmationEmail,
	sendNewPasswordVerificationEmail,
	sendPasswordChangeEmail,
} from "./verificationEmails";
import { getAuthenticatedUser } from "./auth";

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
		if (!id) throw new Error("id is required");
		const user = await db.user.findUnique({
			where: { id: id },
		});

		return await ReturnPublicUserData(user);
	} catch (error) {
		console.log({ function: "findUserById", error });
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
		console.log({ function: "findUserByUsername", error });
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
		console.log({ function: "findUserByEmail", error });
		return null;
	}
};

// Check if a username is available to be used
const isUsernameAvailable = async (username: string, currId) => {
	let result = true;
	const existingUser = await findUserByUsername(username);
	if (existingUser?.id) {
		result = false;
	} else {
		const recentlyDeletedUser = await db.deletedUser.findFirst({
			where: { userName: username },
		});

		if (recentlyDeletedUser?.id) {
			if (recentlyDeletedUser?.deletionTime.getTime() + deletedUsernameReservationDuration_ms > new Date().getTime()) {
				result = false;
			} else {
				await db.deletedUser.delete({ where: { id: recentlyDeletedUser.id } });
			}
		}
	}
	return result;
};

type ProfileUpdateData = {
	name?: string;
	userName?: string;
	profileImageProvider?: Providers;
};

// Update user's profile data
export const updateUserProfile = async ({
	data,
}: {
	data: ProfileUpdateData;
}) => {
	try {
		const parsedName = data?.name ? parseName(data.name) : null;
		const parsedUsername = data?.userName ? parseUserName(data.userName) : null;
		const parsedProfileImageProvider = data?.profileImageProvider
			? parseProfileProvider(data.profileImageProvider)
			: null;

		if (!parsedName && !parsedUsername && !parsedProfileImageProvider) {
			return {
				success: false,
				message: "Invalid form data",
			};
		}

		if (isValidUsername(parsedUsername) !== true) {
			const error = isValidUsername(parsedUsername);
			return {
				success: false,
				message: error.toString(),
			};
		}

		if (isValidName(parsedName) !== true) {
			const error = isValidName(parsedName);
			return {
				success: false,
				message: error.toString(),
			};
		}

		const user = (await auth())?.user;

		if (!user?.id) {
			return {
				success: false,
				message: "Unauthorized request",
			};
		}
		const userData = await getAuthenticatedUser();

		if (!userData?.id) {
			return {
				success: false,
				message: "Unauthorized request",
			};
		}

		const updateData: ProfileUpdateData = {};
		if (parsedName && parsedName !== userData?.name) updateData.name = parsedName;
		if (parsedUsername && parsedUsername !== userData?.userName) updateData.userName = parsedUsername;
		if (parsedProfileImageProvider && parsedProfileImageProvider !== userData?.profileImageProvider)
			updateData.profileImageProvider = parsedProfileImageProvider;

		if (updateData?.userName) {
			const userNameAvailable = await isUsernameAvailable(updateData?.userName, user?.id);

			if (userNameAvailable !== true) {
				return {
					success: false,
					message: "That username is not available, try something else",
				};
			}
		}

		if (updateData?.profileImageProvider) {
			const newProfileImage = (
				await db.user.findUnique({
					where: { id: user?.id },
					select: {
						accounts: {
							where: { provider: updateData?.profileImageProvider },
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
					...updateData,
					image: newProfileImage,
				},
			});
		} else {
			await db.user.update({
				where: { id: user.id },
				data: {
					...updateData,
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

	const isCorrectPassword = await matchPassword(password as string, userData?.password);

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
export const getLinkedProvidersList = async () => {
	const session = await auth();
	if (!session?.user?.id) return [];

	try {
		const linkedProviders = await db.account.findMany({
			where: { userId: session?.user?.id },
		});

		const list: Partial<Account>[] = [];
		for (const provider of linkedProviders) {
			list.push({
				provider: provider.provider,
				providerAccountEmail: provider.providerAccountEmail,
			});
		}

		return list;
	} catch (error) {
		console.log({ error });
		return [];
	}
};

export const linkAuthProvider = async (newProviderName: string) => {
	await signIn(newProviderName, {
		redirect: true,
		callbackUrl: "/settings/account",
	});
};

// Unlink a provider from user's account; make sure there is at least one provider remaining
export const unlinkAuthProvider = async (newProviderName: string) => {
	const user = (await auth())?.user;
	if (!user?.id) {
		return {
			success: false,
			message: "Invalid request",
		};
	}

	const userData = await getAuthenticatedUser();

	if (!userData?.id) {
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
			if (provider.provider === newProviderName) {
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
			message: `Successfully removed ${newProviderName} provider`,
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

const isVerificationTokenValid = (tokenCreationDate: Date, validityDuration_ms: number) => {
	if (
		tokenCreationDate &&
		validityDuration_ms &&
		tokenCreationDate.getTime() + validityDuration_ms > new Date().getTime()
	) {
		return true;
	}
	return false;
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
			verificationEmail?.dateCreated &&
			!isVerificationTokenValid(verificationEmail?.dateCreated, addNewPasswordVerificationTokenValidity_ms)
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
export const initiateAddNewPasswordAction = async ({ newPassword }: { newPassword: string }) => {
	if (isValidPassword(newPassword) !== true) {
		const error = isValidPassword(newPassword);
		return { success: false, message: `Invalid password. ${error}` };
	}

	try {
		const user = (await auth())?.user;
		const userData = await getAuthenticatedUser();

		if (userData?.hasAPassword) {
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
		const user = await getAuthenticatedUser();
		if (!user) {
			return {
				success: false,
				message: "Unauthenticated request!",
			};
		}

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
			data: { password: null, unverifiedNewPassword: null },
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

		let res: VerificationEmail | null = null;

		try {
			res = await db.verificationEmail.delete({
				where: {
					token: token,
					action: UserVerificationActionTypes.ADD_PASSWORD,
				},
			});
		} catch (error) {
			return {
				success: false,
				message: "Invalid token",
			};
		}

		if (!res?.token) {
			return {
				success: false,
				message: "Invalid token",
			};
		}

		return {
			success: true,
			message: "Cancelled successfully",
		};
	} catch (error) {
		console.log({ error });
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

		let verificationActionData: VerificationEmail | null = null;

		try {
			verificationActionData = await db.verificationEmail.delete({
				where: {
					token: token,
					action: UserVerificationActionTypes.ADD_PASSWORD,
				},
			});
		} catch (error) {
			return {
				success: false,
				message: "Invalid token",
			};
		}

		if (!verificationActionData?.token) {
			return {
				success: false,
				message: "Invalid confirmation token",
			};
		}

		if (!isVerificationTokenValid(verificationActionData?.dateCreated, addNewPasswordVerificationTokenValidity_ms)) {
			return {
				success: false,
				message: "Expired token",
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
		console.log({ error });
		return {
			success: false,
			message: "Internal server error",
		};
	}
};

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

		if (!userData) {
			return {
				success: false,
				message: "No account exists with this email address.",
			};
		}

		if (!userData?.password) {
			return {
				success: false,
				message: "You can't change the password, you have not enabled password login.",
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
			message: emailSendRes?.message,
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

		let res: VerificationEmail | null = null;

		try {
			res = await db.verificationEmail.delete({
				where: {
					token: token,
					action: UserVerificationActionTypes.CHANGE_PASSWORD,
				},
			});
		} catch (error) {
			return {
				success: false,
				message: "Invalid token",
			};
		}

		if (!res?.token) {
			return {
				success: false,
				message: "Invalid token type",
			};
		}

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
		let verificationActionData: VerificationEmail | null = null;

		try {
			verificationActionData = await db.verificationEmail.delete({
				where: {
					token: token,
					action: UserVerificationActionTypes.CHANGE_PASSWORD,
				},
			});
		} catch (error) {
			return {
				success: false,
				message: "Invalid token",
			};
		}
		if (!verificationActionData?.token) {
			return {
				success: false,
				message: "Invalid confirmation token",
			};
		}

		if (!isVerificationTokenValid(verificationActionData?.dateCreated, changePasswordConfirmationTokenValidity_ms)) {
			return {
				success: false,
				message: "Expired token",
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
				message: "You can't use change password, your account doesn't have passwords enabled",
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

export const initiateDeleteAccountAction = async () => {
	const session = await auth();

	if (!session?.user?.id) {
		return {
			success: false,
			message: "Unauthenticated request",
		};
	}

	try {
		const userData = await getAuthenticatedUser();

		if (!userData?.id) {
			return {
				success: false,
				message: "Unauthenticated request",
			};
		}

		const emailSendRes = await sendAccountDeletionConfirmationEmail(userData);

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
		return {
			success: false,
			message: "Internal server error",
		};
	}
};

export const confirmAccountDeletion = async (token: string) => {
	if (!token) {
		return {
			success: false,
			message: "Missing confirmation token",
		};
	}

	try {
		const session = await auth();

		if (!session?.user?.id) {
			return {
				success: false,
				message: "Unauthenticated user",
			};
		}
		let verificationActionData: VerificationEmail | null = null;

		try {
			verificationActionData = await db.verificationEmail.delete({
				where: {
					token: token,
					action: UserVerificationActionTypes.DELETE_USER_ACCOUNT,
				},
			});
		} catch (error) {
			return {
				success: false,
				message: "Invalid token",
			};
		}

		if (!verificationActionData?.token) {
			return {
				success: false,
				message: "Invalid token",
			};
		}

		if (!isVerificationTokenValid(verificationActionData?.dateCreated, deleteAccountVerificationTokenValidity_ms)) {
			return {
				success: false,
				message: "Expired token",
			};
		}

		const validUser = await getAuthenticatedUser();

		if (!validUser?.id) {
			return {
				success: false,
				message: "Unauthenticated user",
			};
		}

		const userData = await db.user.delete({
			where: { id: session?.user?.id },
		});

		await db.deletedUser.create({
			data: {
				userName: userData.userName,
				email: userData.email,
				deletionTime: new Date(),
			},
		});

		return {
			success: true,
			message: "Successfully deleted your account",
		};
	} catch (error) {
		console.log({ error });
		return {
			success: false,
			message: "Internal server error",
		};
	}
};

export const cancelAccountDeletion = async (token: string) => {
	if (!token) {
		return {
			success: false,
			message: "Missing confirmation token",
		};
	}
	try {
		let res: VerificationEmail | null = null;

		try {
			res = await db.verificationEmail.delete({
				where: {
					token: token,
					action: UserVerificationActionTypes.DELETE_USER_ACCOUNT,
				},
			});
		} catch (error) {
			return {
				success: false,
				message: "Invalid token",
			};
		}

		if (!res?.token) {
			return {
				success: false,
				message: "Invalid token",
			};
		}

		return {
			success: true,
			message: "Successfully cancelled account deletion",
		};
	} catch (error) {
		console.log({ error });
		return {
			success: false,
			message: "Internal server error",
		};
	}
};
