export const NewPasswordConfirmationEmailTemplate = ({
	name,
	confirmationPageUrl,
	siteUrl,
	expiryDurationMs,
}: {
	name?: string;
	confirmationPageUrl: string;
	siteUrl: string;
	expiryDurationMs?: number;
}) => {
	const EmailHTML = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta content="IE=edge" http-equiv="X-UA-Compatible"><meta content="width=device-width,initial-scale=1" name="viewport"><meta name="theme-color" content="#151719"><title>Verify your new password</title></head><body style="width:100%;padding:0;margin:0;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;color:#fff;background-color:#151719;padding:32px 0"><table cellspacing="0" style="margin:auto;max-width:400px;background-color:#252729;border-radius:8px;padding:32px"><tr><td><h1 style="width:100%;text-align:center;font-size:20px;line-height:24px;color:#f43f5e">Verify your new password</h1></td></tr><tr><td><p>Hi ${
		name || "there"
	},<br>A new password was recently added to your account. Confirm below if this was you. The new password will not work until then.</p></td></tr><tr style="width:100%"><td style="width:100%"><a href="${confirmationPageUrl}" style="width:100%;text-decoration:none;margin:0;padding:0" data-saferedirecturl="${confirmationPageUrl}"><p style="width:100%;font-size:20px;background-color:#f43f5e;text-align:center;text-decoration:none;color:#fff;padding:6px 0;border-radius:8px;margin:4px 0">Verify</p></a><span style="color:#c5c7c9">Open the link for more details and options</span></td></tr><tr><td><p style="color:#d0d2d5">If the above link didn't work, copy and paste this url in the browser<br><a href="${confirmationPageUrl}" style="text-decoration:none;color:#60a5fa" data-saferedirecturl="${confirmationPageUrl}">${confirmationPageUrl}</a></p></td></tr>${
		expiryDurationMs
			? `<tr><td><p style="color:#d0d2d5">This link is valid for <span style="font-weight: 600;">${Math.round(
					expiryDurationMs / (60 * 1000),
			  )} minutes</span></p></td></tr>`
			: ""
	}<tr style="width:100%"><td style="width:100%"><div style="width:100%;height:1px;background-color:#a5a7a9"></div></td></tr><tr style="width:100%;text-align:center"><td style="width:100%;text-align:center"><a href="${siteUrl}" style="color:#60a5fa;text-decoration:none"><p>Cosmic Reach Mod Manager</p></a></td></tr></table></body></html>`;
	const subject = "Verify your new password";
	const text = `Hi ${
		name || "there"
	},\nA new password was recently added to your account. Confirm below if this was you. The new password will not work until then.\nOpen the link for more details and options\n${confirmationPageUrl}\n${
		expiryDurationMs
			? `This link is valid for ${Math.round(
					expiryDurationMs / (60 * 1000),
			  )} minutes`
			: ""
	}\n\nCosmic Reach Mod Manager`;

	return { EmailHTML, subject, text };
};

export const ChangePasswordVerificationEmailTemplate = ({
	name,
	confirmationPageUrl,
	siteUrl,
	expiryDurationMs,
}: {
	name?: string;
	confirmationPageUrl: string;
	siteUrl: string;
	expiryDurationMs?: number;
}) => {
	const EmailHTML = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta content="IE=edge" http-equiv="X-UA-Compatible"><meta content="width=device-width,initial-scale=1" name="viewport"><meta name="theme-color" content="#151719"><title>Change your account password</title></head><body style="width:100%;padding:0;margin:0;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;color:#fff;background-color:#151719;padding:32px 0"><table cellspacing="0" style="margin:auto;max-width:400px;background-color:#252729;border-radius:8px;padding:32px"><tr><td><h1 style="width:100%;text-align:center;font-size:20px;line-height:24px;color:#f43f5e">Change your account password</h1></td></tr><tr><td><p>Hi ${
		name || "there"
	},<br>Click the link below to change your account password.</p></td></tr><tr style="width:100%"><td style="width:100%"><a href="${confirmationPageUrl}" style="width:100%;text-decoration:none;margin:0;padding:0" data-saferedirecturl="${confirmationPageUrl}"><p style="width:100%;font-size:20px;background-color:#f43f5e;text-align:center;text-decoration:none;color:#fff;padding:6px 0;border-radius:8px;margin:4px 0">Change password</p></a></td></tr><tr><td><p style="color:#d0d2d5">If the above link didn't work, copy and paste this url in the browser<br><a href="${confirmationPageUrl}" style="text-decoration:none;color:#60a5fa" data-saferedirecturl="${confirmationPageUrl}">${confirmationPageUrl}</a></p></td></tr>${
		expiryDurationMs
			? `<tr><td><p style="color:#d0d2d5">This link is valid for <span style="font-weight:600">${Math.round(
					expiryDurationMs / (60 * 1000),
			  )} minutes</span></p></td></tr>`
			: ""
	}<tr style="width:100%"><td style="width:100%"><div style="width:100%;height:1px;background-color:#a5a7a9"></div></td></tr><tr style="width:100%;text-align:center"><td style="width:100%;text-align:center"><a href="${siteUrl}" style="color:#60a5fa;text-decoration:none"><p>Cosmic Reach Mod Manager</p></a></td></tr></table></body></html>`;

	const subject = "Change your CRMM account password";
	const text = `Hi ${
		name || "there"
	},\nOpen the link to change your account password.\n${confirmationPageUrl}${
		expiryDurationMs
			? `\nThis link is valid for${Math.round(
					expiryDurationMs / (60 * 1000),
			  )} minutes`
			: ""
	}\n\nCosmic Reach Mod Manager`;

	return { EmailHTML, subject, text };
};