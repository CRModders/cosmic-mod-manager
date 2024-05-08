//     This file is part of Cosmic Reach Mod Manager.
//
//    Cosmic Reach Mod Manager is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
//
//    Cosmic Reach Mod Manager is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
//   You should have received a copy of the GNU General Public License along with Cosmic Reach Mod Manager. If not, see <https://www.gnu.org/licenses/>.

import {
	addNewPasswordVerificationTokenValidity_ms,
	changePasswordConfirmationTokenValidity_ms,
	deleteAccountVerificationTokenValidity_ms,
} from "@/config";
import db from "@/lib/db";
import { sendEmail } from "@/lib/email";
import {
	AccountDeletionVerificationEmailTemplate,
	ChangePasswordVerificationEmailTemplate,
	NewPasswordConfirmationEmailTemplate,
} from "@/lib/email/templates";
import { get_locale } from "@/lib/lang";
import getLangPref from "@/lib/server/getLangPref";
import { generateRandomCode } from "@/lib/utils";
import { UserVerificationActionTypes, type User } from "@prisma/client";

const baseUrl = process.env.BASE_URL;

export const sendNewPasswordVerificationEmail = async ({
	userId,
	email,
	name,
}: { userId: string; email: string; name: string }) => {
	const locale = get_locale(getLangPref()).content;

	try {
		await db.verificationEmail.deleteMany({
			where: {
				userId: userId,
				action: UserVerificationActionTypes.ADD_PASSWORD,
			},
		});

		const res = await db.verificationEmail.create({
			data: {
				userId: userId,
				action: UserVerificationActionTypes.ADD_PASSWORD,
				token: `${userId}${generateRandomCode()}`,
			},
		});

		const token = res.token;

		const emailTemplate = NewPasswordConfirmationEmailTemplate({
			name: name,
			confirmationPageUrl: `${baseUrl}/verify?token=${encodeURIComponent(token)}`,
			siteUrl: baseUrl,
			expiryDurationMs: addNewPasswordVerificationTokenValidity_ms,
		});

		await sendEmail({
			receiver: email,
			subject: emailTemplate.subject,
			text: emailTemplate.text,
			template: emailTemplate.EmailHTML,
		});

		return { success: true, message: locale.globals.messages.email_sent_successfully };
	} catch (error) {
		return {
			success: false,
			message: locale.globals.messages.error_sending_email,
		};
	}
};

export const sendPasswordChangeEmail = async (user: Partial<User>) => {
	const locale = get_locale(getLangPref()).content;

	try {
		await db.verificationEmail.deleteMany({
			where: {
				userId: user.id,
				action: UserVerificationActionTypes.CHANGE_PASSWORD,
			},
		});

		const res = await db.verificationEmail.create({
			data: {
				userId: user.id,
				action: UserVerificationActionTypes.CHANGE_PASSWORD,
				token: `${user.id}${generateRandomCode()}`,
			},
		});

		const token = res.token;

		const emailTemplate = ChangePasswordVerificationEmailTemplate({
			name: user.name,
			confirmationPageUrl: `${baseUrl}/verify?token=${encodeURIComponent(token)}`,
			siteUrl: baseUrl,
			expiryDurationMs: changePasswordConfirmationTokenValidity_ms,
		});

		await sendEmail({
			receiver: user.email,
			subject: emailTemplate.subject,
			text: emailTemplate.text,
			template: emailTemplate.EmailHTML,
		});

		return { success: true, message: locale.globals.messages.email_sent_successfully };
	} catch (error) {
		return {
			success: false,
			message: locale.globals.messages.error_sending_email,
		};
	}
};

export const sendAccountDeletionConfirmationEmail = async (user: Partial<User>) => {
	const locale = get_locale(getLangPref()).content;

	try {
		await db.verificationEmail.deleteMany({
			where: {
				userId: user.id,
				action: UserVerificationActionTypes.DELETE_USER_ACCOUNT,
			},
		});

		const res = await db.verificationEmail.create({
			data: {
				userId: user.id,
				action: UserVerificationActionTypes.DELETE_USER_ACCOUNT,
				token: `${user.id}${generateRandomCode()}`, // Longer sized token to make sure it's unique ever for a larger user base
			},
		});

		const token = res.token;

		const emailTemplate = AccountDeletionVerificationEmailTemplate({
			name: user.name,
			confirmationPageUrl: `${baseUrl}/verify?token=${encodeURIComponent(token)}`,
			siteUrl: baseUrl,
			expiryDurationMs: deleteAccountVerificationTokenValidity_ms,
		});

		await sendEmail({
			receiver: user.email,
			subject: emailTemplate.subject,
			text: emailTemplate.text,
			template: emailTemplate.EmailHTML,
		});

		return { success: true, message: locale.globals.messages.email_sent_successfully };
	} catch (error) {
		return {
			success: false,
			message: locale.globals.messages.error_sending_email,
		};
	}
};
