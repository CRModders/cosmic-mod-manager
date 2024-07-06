import { CapitalizeAndFormatString } from "@root/lib/utils";

export const NewPasswordConfirmationEmailTemplate = ({
    name,
    confirmationPageUrl,
    siteUrl,
    expiryDuration,
}: {
    name?: string;
    confirmationPageUrl: string;
    siteUrl: string;
    expiryDuration?: number;
}) => {
    const EmailHTML = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="theme" content="#252729"><title>Change password</title></head><body style="margin: 0; padding: 0; width: 100%; display: flex; align-items: center; justify-content: center; background-color: #FFFFFF; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto' , 'Oxygen' , 'Ubuntu' , 'Cantarell' , 'Fira Sans', 'Droid Sans' , 'Helvetica Neue' , sans-serif;"><table width="100%" border="0" cellspacing="0" cellpadding="0" style="width:100%!important"><tbody><tr><td align="center"><table style="border: 1px solid #ACABAD; border-radius: 8px; margin: 48px 0; background-color: #fafafa;"><tbody><tr><td style="padding: 48px; width: 100%; max-width: 375px;"><table width="100%" cellspacing="0" cellpadding="0"><tbody><tr><td align="center"> <img src="https://i.postimg.cc/wxDvLDB4/image.png" style="width: 80px; height: 80px;" /> </td></tr><tr><td align="center"><h1 style="color: #101214; font-weight: 400; font-size: 1.6rem; margin-top: 4px; margin-bottom: 12px;">Verify your new password</h1></td></tr></tbody></table><table width="100%" cellspacing="0" cellpadding="0"><tbody><tr><td style="padding-top: 16px; margin-bottom: 0;"><p style="color: #252729; margin-top: 8px; margin-bottom: 0; font-size: 14px;">Hi ${name || "there"},</p></td></tr><tr><td style="margin-top: 0;"><p style="color: #252729; margin-bottom: 8px; padding-top: 0; font-size: 14px;">A new password was recently added to your account. Confirm below if this was you. The new password will not work until then.</p></td></tr></tbody></table><table width="100%" cellspacing="0" cellpadding="0"><tbody><tr><td align="center" style="padding-top: 8px; padding-bottom: 12px;"> <a href="${confirmationPageUrl}" data-saferedirecturl="${confirmationPageUrl}" style="text-decoration: none;"><p style="background-color: #f43f5e; color: white; width: fit-content; padding: 8px 32px 12px 32px; border-radius: 8px; font-size: 14px;">Verify new password</p></a> </td></tr><tr><td><p style="color: #252729; margin: 8px; font-size: 14px;">This link is valid for <span style="font-weight: 600;">${Math.round(expiryDuration / (60 * 60))} hour(s)</span></p></td></tr><tr><td><div style="width: 100%; height: 1px; background-color: #85878A; margin: 16px 0;"></div></td></tr><tr><td align="center"> <a href="${siteUrl}" style="color: #050608; text-decoration: none;"><p style="text-decoration: underline; text-underline-offset: 2px;">Cosmic Reach Mod Manager</p></a> </td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></body> </html> `;
    const subject = "Verify your new password";
    const text = `A new password was recently added to your account. Confirm below if this was you. The new password will not work until then.\nOpen the link for more details and options\n${confirmationPageUrl}\n${
        expiryDuration ? `This link is valid for ${Math.round(expiryDuration / (60 * 60))} hour(s)` : ""
    }\n\nCosmic Reach Mod Manager`;

    return { EmailHTML, subject, text };
};

export const ChangePasswordVerificationEmailTemplate = ({
    name,
    confirmationPageUrl,
    siteUrl,
    expiryDuration,
}: {
    name?: string;
    confirmationPageUrl: string;
    siteUrl: string;
    expiryDuration?: number;
}) => {
    const EmailHTML = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="theme" content="#252729"><title>Change password</title></head><body style="margin: 0; padding: 0; width: 100%; display: flex; align-items: center; justify-content: center; background-color: #FFFFFF; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto' , 'Oxygen' , 'Ubuntu' , 'Cantarell' , 'Fira Sans', 'Droid Sans' , 'Helvetica Neue' , sans-serif;"><table width="100%" border="0" cellspacing="0" cellpadding="0" style="width:100%!important"><tbody><tr><td align="center"><table style="border: 1px solid #ACABAD; border-radius: 8px; margin: 48px 0; background-color: #fafafa;"><tbody><tr><td style="padding: 48px; width: 100%; max-width: 375px;"><table width="100%" cellspacing="0" cellpadding="0"><tbody><tr><td align="center"> <img src="https://i.postimg.cc/wxDvLDB4/image.png" style="width: 80px; height: 80px;" /> </td></tr><tr><td align="center"><h1 style="color: #101214; font-weight: 400; font-size: 1.6rem; margin-top: 4px; margin-bottom: 12px;">Change your password </h1></td></tr></tbody></table><table width="100%" cellspacing="0" cellpadding="0"><tbody><tr><td style="padding-top: 16px; margin-bottom: 0;"><p style="color: #252729; margin-top: 8px; margin-bottom: 0; font-size: 14px;">Hi ${name || "there"},</p></td></tr><tr><td style="margin-top: 0;"><p style="color: #252729; margin-bottom: 8px; padding-top: 0; font-size: 14px;">We received a request to change your password. Click the link below to change your account password.</p></td></tr></tbody></table><table width="100%" cellspacing="0" cellpadding="0"><tbody><tr><td align="center" style="padding-top: 8px; padding-bottom: 12px;"> <a href="${confirmationPageUrl}" data-saferedirecturl="${confirmationPageUrl}" style="text-decoration: none;"><p style="background-color: #f43f5e; color: white; width: fit-content; padding: 8px 32px 10px 32px; border-radius: 8px; font-size: 14px;">Change password</p></a> </td></tr><tr><td><p style="color: #252729; margin: 8px; font-size: 14px;">This link is valid for <span style="font-weight: 600;">${Math.round(expiryDuration / (60 * 60))} hour(s)</span></p></td></tr><tr><td><div style="width: 100%; height: 1px; background-color: #85878A; margin: 16px 0;"></div></td></tr><tr><td align="center"> <a href="${siteUrl}" style="color: #050608; text-decoration: none;"><p style="text-decoration: underline; text-underline-offset: 2px;">Cosmic Reach Mod Manager</p></a> </td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></body></html>`;

    const subject = "Change your CRMM account password";
    const text = `Open the link to change your account password.\n${confirmationPageUrl}${
        expiryDuration ? `\nThis link is valid for ${Math.round(expiryDuration / (60 * 60))} hour(s)` : ""
    }\n\nCosmic Reach Mod Manager`;

    return { EmailHTML, subject, text };
};

export const AccountDeletionVerificationEmailTemplate = ({
    name,
    confirmationPageUrl,
    siteUrl,
    expiryDuration,
}: {
    name?: string;
    confirmationPageUrl: string;
    siteUrl: string;
    expiryDuration?: number;
}) => {
    const EmailHTML = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="theme" content="#252729"><title>Delete your account</title></head><body style="margin: 0; padding: 0; width: 100%; display: flex; align-items: center; justify-content: center; background-color: #FFFFFF; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto' , 'Oxygen' , 'Ubuntu' , 'Cantarell' , 'Fira Sans', 'Droid Sans' , 'Helvetica Neue' , sans-serif;"><table width="100%" border="0" cellspacing="0" cellpadding="0" style="width:100%!important"><tbody><tr><td align="center"><table style="border: 1px solid #ACABAD; border-radius: 8px; margin: 48px 0; background-color: #fafafa;"><tbody><tr><td style="padding: 48px; width: 100%; max-width: 375px;"><table width="100%" cellspacing="0" cellpadding="0"><tbody><tr><td align="center"> <img src="https://i.postimg.cc/wxDvLDB4/image.png" style="width: 80px; height: 80px;" /> </td></tr><tr><td align="center"><h1 style="color: #101214; font-weight: 400; font-size: 1.6rem; margin-top: 4px; margin-bottom: 12px;">Confirm to delete your account</h1></td></tr></tbody></table><table width="100%" cellspacing="0" cellpadding="0"><tbody><tr><td style="padding-top: 16px; margin-bottom: 0;"><p style="color: #252729; margin-top: 8px; margin-bottom: 0; font-size: 14px;">Hi ${name || "there"},</p></td></tr><tr><td style="margin-top: 0;"><p style="color: #252729; margin-bottom: 8px; padding-top: 0; font-size: 14px;">We received a request that you wanted to delete your account. Click the link below to confirm that.</p></td></tr></tbody></table><table width="100%" cellspacing="0" cellpadding="0"><tbody><tr><td align="center" style="padding-top: 8px; padding-bottom: 12px;"> <a href="${confirmationPageUrl}" data-saferedirecturl="${confirmationPageUrl}" style="text-decoration: none;"><p style="background-color: #f43f5e; color: white; width: fit-content; padding: 8px 32px 10px 32px; border-radius: 8px; font-size: 14px;">Delete my account</p></a> </td></tr><tr><td><p style="color: #252729; margin: 8px; font-size: 14px;">This link is valid for <span style="font-weight: 600;"> ${Math.round(expiryDuration / (60 * 60))} hour(s)</span></p></td></tr><tr><td><div style="width: 100%; height: 1px; background-color: #85878A; margin: 16px 0;"></div></td></tr><tr><td align="center"> <a href="${siteUrl}" style="color: #050608; text-decoration: none;"><p style="text-decoration: underline; text-underline-offset: 2px;">Cosmic Reach Mod Manager</p></a> </td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></body></html>`;

    const subject = "Confirm to delete your account on crmm";
    const text = `Click this link to verify that you want to delete your account.\n${confirmationPageUrl}${
        expiryDuration ? `\nThis link is valid for ${Math.round(expiryDuration / (60 * 60))} hour(s)` : ""
    }\n\nCosmic Reach Mod Manager`;

    return { EmailHTML, subject, text };
};

export const NewSignInAlertEmailTemplate = ({
    name,
    sessions_page_url,
    site_url,
    os_name,
    browser_name,
    ip_address,
    location,
    formatted_timestamp,
    auth_provider,
}: {
    name?: string;
    sessions_page_url: string;
    site_url: string;
    os_name: string;
    browser_name: string;
    ip_address: string;
    location: string;
    formatted_timestamp: string;
    auth_provider: string;
}) => {
    const EmailHTML = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="theme" content="#252729"><title>Signin alert</title></head><body style="margin: 0; padding: 0; width: 100%; display: flex; align-items: center; justify-content: center; background-color: #FFFFFF; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto' , 'Oxygen' , 'Ubuntu' , 'Cantarell' , 'Fira Sans', 'Droid Sans' , 'Helvetica Neue' ,sans-serif;"><table width="100%" border="0" cellspacing="0" cellpadding="0" style="width:100%!important"><tbody><tr><td align="center"><table style="border: 1px solid #ACABAD; border-radius: 8px; margin: 48px 0; background-color: #fafafa;"><tbody><tr><td style="padding: 48px; width: 100%; max-width: 375px;"><table width="100%" cellspacing="0" cellpadding="0"><tbody><tr><td align="center"> <img src="https://i.postimg.cc/wxDvLDB4/image.png"style="width: 80px; height: 80px;" /> </td></tr><tr><td align="center"><h1 style="color: #101214; font-weight: 400; font-size: 1.6rem; margin-top: 4px; margin-bottom: 12px;">A new signin on ${os_name}</h1></td></tr></tbody></table><table width="100%" cellspacing="0" cellpadding="0"><tbody><tr><td style="padding-top: 16px; margin-bottom: 0;"><p style="color: #252729; margin-top: 8px; margin-bottom: 0; font-size:14px;">Hi ${name || "there"},</p></td></tr><tr><td style="margin-top: 0;"><p style="color: #252729; margin-bottom: 8px; padding-top: 0; font-size: 14px; line-height: 22px;">We noticed a new sign-in to your CRMM Account on a ${os_name} device. If this was you, you don’t need to do anything. If not, we’ll help you secure your account. </p></td></tr><tr><td style="margin-top: 0;"><p style="color: #252729; margin-bottom: 8px; padding-top: 0; font-size: 14px; line-height: 22px;"><span>When:&nbsp; ${formatted_timestamp}</span> <br /> <span>Device:&nbsp; ${browser_name} ${os_name} (<em>${ip_address}</em>)</span><br /> <span>Near:&nbsp; ${location}</span><br /> <span>Auth provider:&nbsp; ${CapitalizeAndFormatString(auth_provider)}</span> </p></td></tr></tbody></table><table width="100%" cellspacing="0" cellpadding="0"><tbody><tr><td align="center" style="padding-top: 8px; padding-bottom: 12px;"> <a href="${sessions_page_url}"data-saferedirecturl="${sessions_page_url}"style="text-decoration: none;"><p style="background-color: #f43f5e; color: white; width: fit-content; padding: 10px 32px 12px 32px; border-radius: 8px; font-size: 14px;">Check logged in sessions</p></a> </td></tr><tr><td><div style="width:100%; height: 1px; background-color: #85878A; margin: 16px 0;"></div></td></tr><tr><td align="center"><a href="${site_url}" style="color: #050608; text-decoration: none;"><p style="text-decoration: underline; text-underline-offset: 2px;">Cosmic Reach Mod Manager</p> </a></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></body></html>`;

    const subject = "New signin to your CRMM account";
    const text = `There was a new signin on your CRMM account on ${formatted_timestamp} from ${location} on device ${browser_name} ${os_name} (${ip_address}). Check your logged in session on "${sessions_page_url}"`;

    return { EmailHTML, subject, text };
};
