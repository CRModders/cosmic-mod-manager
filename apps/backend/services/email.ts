import * as nodemailer from "nodemailer";
import env from "~/utils/env";

const noReplyEmailTransporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false,
    auth: {
        user: env.BREVO_USER,
        pass: env.NOREPLY_EMAIL_PASSWORD,
    },
});

type sendEmailOptions = {
    receiver: string;
    subject: string;
    template: string;
    text?: string;
};

export async function sendEmail({ receiver, subject, text, template }: sendEmailOptions) {
    return await noReplyEmailTransporter.sendMail({
        from: env.NOREPLY_EMAIL,
        to: receiver,
        subject: subject,
        text: text || "",
        html: template,
    });
}
