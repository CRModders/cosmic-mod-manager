import { ConfirmAddPasswordTokenExpiry } from "@/config";
import db from "@/lib/db";
import { sendEmail } from "@/lib/email";
import {
	ChangePasswordVerificationEmailTemplate,
	NewPasswordConfirmationEmailTemplate,
} from "@/lib/email/templates";
import { generateRandomCode, shuffleCharacters } from "@/lib/utils";
import { User, UserVerificationActionTypes } from "@prisma/client";

const baseUrl = process.env.BASE_URL;

export const sendNewPasswordVerificationEmail = async ({
	userId,
	email,
	name,
}: { userId: string; email: string; name: string }) => {
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
				token: shuffleCharacters(`${userId}${generateRandomCode({})}`), // Longer sized token to make sure it's unique ever for a larger user base
			},
		});

		const token = res.token;

		const emailTemplate = NewPasswordConfirmationEmailTemplate({
			name: name,
			confirmationPageUrl: `${baseUrl}/verify?token=${encodeURIComponent(
				token,
			)}`,
			siteUrl: baseUrl,
			expiryDurationMs: ConfirmAddPasswordTokenExpiry,
		});

		await sendEmail({
			receiver: email,
			subject: emailTemplate.subject,
			text: emailTemplate.text,
			template: emailTemplate.EmailHTML,
		});

		return { success: true, message: "Email sent successfully" };
	} catch (error) {
		return {
			success: false,
			message: "Error while sending confirmation email",
		};
	}
};

export const sendPasswordChangeEmail = async (user: Partial<User>) => {
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
				token: shuffleCharacters(`${user.id}${generateRandomCode({})}`), // Longer sized token to make sure it's unique ever for a larger user base
			},
		});

		const token = res.token;

		const emailTemplate = ChangePasswordVerificationEmailTemplate({
			name: user.name,
			confirmationPageUrl: `${baseUrl}/verify?token=${encodeURIComponent(
				token,
			)}`,
			siteUrl: baseUrl,
			expiryDurationMs: ConfirmAddPasswordTokenExpiry,
		});

		await sendEmail({
			receiver: user.email,
			subject: emailTemplate.subject,
			text: emailTemplate.text,
			template: emailTemplate.EmailHTML,
		});

		return { success: true, message: "Email sent successfully" };
	} catch (error) {
		return {
			success: false,
			message: "Error while sending confirmation email",
		};
	}
};
